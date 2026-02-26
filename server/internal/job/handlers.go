package job

import (
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

func (q jobsQueries) deleteJob(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	jobId, err := httpx.GetPathValToInt(r, "jobId")
	if err != nil {
		return err
	}
	finishSeason, err := q.DB.JobExistsReturnFinishSeason(r.Context(), db.JobExistsReturnFinishSeasonParams{
		FarmID: *user.FarmID,
		JobID:  jobId,
	})
	if err != nil {
		return apperror.New404NotFoundError("Job Not Found", "Job", err)
	}

	if finishSeason != nil {
		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: "Cannot Edit season when a season is finished",
				AppCode: apperror.SEASON_FINISH_ERROR,
				Meta:    nil,
			},
		}, nil)
	}

	err = q.DB.DeleteJob(r.Context(), jobId)
	if err != nil {
		return apperror.New503DBError("DB error", err)

	}
	return httpx.WriteJSON(w, 204, nil)

}

func (q jobsQueries) createJob(w http.ResponseWriter, r *http.Request) error {
	hasSupplies := false

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	requestData := requestParams{}
	if err := httpx.DecodeAndVal(r, &requestData); err != nil {
		return err
	}
	//TODO This
	if slices.Contains(apptypes.JobTypesWithSupplies(), requestData.JobType) {
		if len(requestData.JobSupplies) == 0 {
			return apperror.New400Error([]apperror.ErrorMessage{
				{
					Message: "JobSupplies us required",
					AppCode: apperror.REQUIRED_FIELD,
					Meta: apperror.Meta{
						"name": "JobSupplies"},
				}}, nil)

		}

		for _, job := range requestData.JobSupplies {

			if err := apperror.ValidateFields(&job); err != nil {
				return apperror.New400Error(err, nil)

			}
		}
		hasSupplies = true
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: requestData.FieldID,
		UserID:  user.ID,
	})
	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", err)
	}

	season, err := q.DB.GetSeasonById(r.Context(), requestData.SeasonID)
	if err != nil {
		return apperror.New404NotFoundError("Season Not found", "Season", nil)
	}
	if season.FinishSeason != nil {
		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: "Cannot Edit season when a season is finished",
				AppCode: apperror.SEASON_FINISH_ERROR,
				Meta:    nil,
			}}, nil)
	}

	if requestData.JobDate.Before(season.StartSeason) {
		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: "Cannot add job before the season start",
				AppCode: apperror.INVALID_JOB_START,
				Meta: apperror.Meta{
					"max": season.StartSeason.String()},
			}}, nil)
	}

	job, err := q.DB.CreateJob(r.Context(), db.CreateJobParams{
		JobType:      requestData.JobType,
		Description:  requestData.Description,
		JobDate:      requestData.JobDate,
		SeasonID:     requestData.SeasonID,
		AreaInMeters: requestData.AreaInMeters * float64(util.UnitConverter(user.LandUnit)),
	})
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}

	if hasSupplies {
		for _, j := range requestData.JobSupplies {
			_, err = q.DB.CreateJobSupplies(r.Context(), db.CreateJobSuppliesParams{
				Quantity: j.Quantity,
				SupplyID: j.SupplyID,
				JobID:    &job.ID,
			})
			if err != nil {
				return apperror.New503DBError("DB error", err)
			}
		}
	}

	return httpx.WriteJSON(w, 201, job)
}

func (q jobsQueries) getAllJobs(w http.ResponseWriter, r *http.Request) error {
	seasonId, err := httpx.GetPathValToInt(r, "seasonId")
	if err != nil {
		return err
	}
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		return apperror.New404NotFoundError("Farm not found", "Farm", err)
	}

	if _, err := q.DB.GetSeasonById(r.Context(), seasonId); err != nil {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	jobs, err := q.DB.GetAllJobs(r.Context(), seasonId)
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}

	jJobs := []jobResponse{}
	for _, job := range jobs {
		jJobs = append(jJobs, toJobResponse(job, user.LandUnit))
	}

	return httpx.WriteJSON(w, 200, jJobs)

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
