package job

import (
	"encoding/json"
	"net/http"
	"slices"
	"time"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/apptypes"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

//WARN: overwite the seasonId
//TODO: cannot add or edit job when a season is finish
//TODO: when we add a job the jobdate cant be lower from the season start

type jobSupplyParams struct {
	Quantity float64 `json:"quantity" validate:"required"`
	SupplyID *int64  `json:"supplyId" validate:"required"`
}

type requestParams struct {
	JobType      string            `json:"jobType" validate:"required,jobtype"`
	Description  *string           `json:"description"`
	JobDate      time.Time         `json:"jobDate" validate:"required"`
	SeasonID     int64             `json:"seasonId" validate:"required"`
	FieldID      int64             `json:"fieldId" validate:"required"`
	AreaInMeters float64           `json:"areaInMeters" validate:"required"`
	JobSupplies  []jobSupplyParams `json:"jobSupplies" validate:"required"`
}

func (q jobsQueries) deleteJob(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	jobId, httpErr := httpx.GetPathValueToInt64(r, "jobId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	finishSeason, err := q.DB.JobExistsReturnFinishSeason(r.Context(), db.JobExistsReturnFinishSeasonParams{
		FarmID: *user.FarmID,
		JobID:  jobId,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Job Not Found", "Job")(w, r)
		return
	}
	if finishSeason != nil {
		httpx.ServerError(400, httpx.NewErrMessage("Cannot Edit season when a season is finished", apperror.SEASON_FINISH_ERROR, nil))(w, r)
		return
	}
	err = q.DB.DeleteJob(r.Context(), jobId)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return

	}
	w.WriteHeader(204)

}

func (q jobsQueries) createJob(w http.ResponseWriter, r *http.Request) {
	hasSupplies := false

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	requestData := requestParams{}
	if err := httpx.DecodeAndValidate(r, &requestData); err != nil {
		err(w, r)
		return
	}
	//TODO This
	if slices.Contains(apptypes.JobTypesWithSupplies(), requestData.JobType) {
		if len(requestData.JobSupplies) == 0 {
			httpx.ServerError(400, httpx.NewErrMessage("JobSupplies us required", apperror.REQUIRED_FIELD, httpx.Meta{"name": "JobSupplies"}))(w, r)
			return

		}
		for _, job := range requestData.JobSupplies {

			if err := httpx.ValidateFields(&job); err != nil {
				httpx.ServerError(400, err)(w, r)
				return

			}
		}
		hasSupplies = true
	}
	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: requestData.FieldID,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return
	}

	season, err := q.DB.GetSeasonById(r.Context(), requestData.SeasonID)
	if err != nil {
		httpx.NewNotFoundError(404, "Season Not found", "Season")(w, r)
		return
	}
	if season.FinishSeason != nil {
		httpx.ServerError(400, httpx.NewErrMessage("Cannot Edit season when a season is finished", apperror.SEASON_FINISH_ERROR, nil))(w, r)
		return
	}
	if requestData.JobDate.Before(season.StartSeason) {
		httpx.ServerError(400, httpx.NewErrMessage("Cannot add job before the season start", apperror.INVALID_JOB_START, httpx.Meta{"max": season.StartSeason.String()}))(w, r)
		return
	}

	job, err := q.DB.CreateJob(r.Context(), db.CreateJobParams{
		JobType:      requestData.JobType,
		Description:  requestData.Description,
		JobDate:      requestData.JobDate,
		SeasonID:     requestData.SeasonID,
		AreaInMeters: requestData.AreaInMeters * float64(util.UnitConverter(user.LandUnit)),
	})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}
	if hasSupplies {
		for _, j := range requestData.JobSupplies {
			_, err = q.DB.CreateJobSupplies(r.Context(), db.CreateJobSuppliesParams{
				Quantity: j.Quantity,
				SupplyID: j.SupplyID,
				JobID:    &job.ID,
			})
			if err != nil {
				httpx.NewDBError(err.Error())(w, r)
				return
			}
		}
	}

	jData, err := json.Marshal(job)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(201)
	w.Write(jData)
}

func (q jobsQueries) getAllJobs(w http.ResponseWriter, r *http.Request) {
	seasonId, httpErr := httpx.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		httpx.NewNotFoundError(404, "Farm not found", "Farm")(w, r)
		return
	}

	if _, err := q.DB.GetSeasonById(r.Context(), seasonId); err != nil {
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)

		return
	}

	jobs, err := q.DB.GetAllJobs(r.Context(), seasonId)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	jJobs := []jobResponse{}
	for _, job := range jobs {
		jJobs = append(jJobs, toJobResponse(job, user.LandUnit))
	}

	data, err := json.Marshal(jJobs)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}

// func (q jobsQueries) getJobDetails(w http.ResponseWriter, r *http.Request) {
// 	//WARN: this method is unused for now
//
// 	user, httpErr := httpd.GetUserFromContext(r)
// 	if httpErr != nil {
// 		httpErr(w, r)
// 		return
// 	}
//
// 	fieldId, httpErr := httpd.GetPathValueToInt64(r, "fieldId")
// 	if httpErr != nil {
// 		httpErr(w, r)
// 		return
// 	}
//
// 	jobId, httpErr := httpd.GetPathValueToInt64(r, "fieldId")
// 	if httpErr != nil {
// 		httpErr(w, r)
// 		return
// 	}
//
// 	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
// 		FieldID: fieldId,
// 		UserID:  user.ID,
// 	})
// 	if err != nil {
// 		httpd.GeneralError(400, "This Field Doesnt Exist")
// 	}
// 	job, err := q.DB.GetJobDetails(r.Context(), db.GetJobDetailsParams{
// 		//WARN: overwrite the season id
// 		SeasonID: 1,
// 		JobID:    &jobId,
// 	})
//
// 	if err != nil {
// 		httpd.GeneralError(400, err.Error())(w, r)
// 		return
// 	}
// 	jJob := toJobDetailsResponse(job)
//
// 	data, err := json.Marshal(jJob)
// 	if err != nil {
// 		httpd.GeneralError(500, nil)(w, r)
// 		return
// 	}
// 	w.WriteHeader(200)
// 	w.Write(data)
//
// }
