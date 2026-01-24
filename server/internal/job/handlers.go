package job

import (
	"encoding/json"
	"net/http"
	"slices"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpd"
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
	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	jobId, httpErr := httpd.GetPathValueToInt64(r, "jobId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	finishSeason, err := q.DB.JobExistsReturnFinishSeason(r.Context(), db.JobExistsReturnFinishSeasonParams{
		FarmID: *user.FarmID,
		JobID:  jobId,
	})
	if err != nil {
		httpd.GeneralError(404, "Job not found")(w, r)
		return
	}
	if finishSeason != nil {
		httpd.GeneralError(400, "Can't delete season is Closed")(w, r)
		return
	}
	err = q.DB.DeleteJob(r.Context(), jobId)
	if err != nil {
		httpd.GeneralError(404, err.Error())(w, r)
		return

	}
	w.WriteHeader(204)

}

func (q jobsQueries) createJob(w http.ResponseWriter, r *http.Request) {
	hasSupplies := false

	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	requestData := requestParams{}
	if err := httpd.DecodeAndValidate(r, &requestData); err != nil {
		err(w, r)
		return
	}
	if slices.Contains(httpd.JobTypesWithSupplies(), requestData.JobType) {
		if len(requestData.JobSupplies) == 0 {
			httpd.GeneralError(400, "JobSupplies should be [{quantity: greater than 0 , supplyId: the id of a supply object}]")(w, r)
			return

		}
		for _, job := range requestData.JobSupplies {

			if err := httpd.ValidateFields(&job); err != nil {
				httpd.GeneralError(400, err)(w, r)
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
		httpd.GeneralError(400, err.Error())(w, r)
		return
	}

	season, err := q.DB.GetSeasonById(r.Context(), requestData.SeasonID)
	if err != nil {
		httpd.GeneralError(400, err.Error())(w, r)
		return
	}
	if season.FinishSeason != nil {
		httpd.GeneralError(400, "Cannot Add Job when a season is finished")(w, r)
		return
	}
	if requestData.JobDate.Before(season.StartSeason) {
		httpd.GeneralError(400, "Cannot add job before the season start")(w, r)
		return
	}

	job, err := q.DB.CreateJob(r.Context(), db.CreateJobParams{
		JobType:      requestData.JobType,
		Description:  requestData.Description,
		JobDate:      requestData.JobDate,
		SeasonID:     requestData.SeasonID,
		AreaInMeters: requestData.AreaInMeters * float64(httpd.UnitConverter(user.LandUnit)),
	})
	if err != nil {
		httpd.GeneralError(400, err.Error())(w, r)
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
				httpd.GeneralError(400, err.Error())(w, r)
				return
			}
		}
	}

	jData, err := json.Marshal(job)
	if err != nil {
		httpd.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(201)
	w.Write(jData)
}

func (q jobsQueries) getAllJobs(w http.ResponseWriter, r *http.Request) {
	seasonId, httpErr := httpd.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		httpd.GeneralError(404, "Resourse not found")(w, r)
		return
	}

	if _, err := q.DB.GetSeasonById(r.Context(), seasonId); err != nil {
		httpd.GeneralError(404, "Resource not found")

		return
	}

	jobs, err := q.DB.GetAllJobs(r.Context(), seasonId)
	if err != nil {
		httpd.GeneralError(400, err.Error())(w, r)
		return
	}

	jJobs := []jobResponse{}
	for _, job := range jobs {
		jJobs = append(jJobs, toJobResponse(job, user.LandUnit))
	}

	data, err := json.Marshal(jJobs)
	if err != nil {
		httpd.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
func (q jobsQueries) getJobDetails(w http.ResponseWriter, r *http.Request) {
	//WARN: this method is unused for now

	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	fieldId, httpErr := httpd.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	jobId, httpErr := httpd.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpd.GeneralError(400, "This Field Doesnt Exist")
	}
	job, err := q.DB.GetJobDetails(r.Context(), db.GetJobDetailsParams{
		//WARN: overwrite the season id
		SeasonID: 1,
		JobID:    &jobId,
	})

	if err != nil {
		httpd.GeneralError(400, err.Error())(w, r)
		return
	}
	jJob := toJobDetailsResponse(job)

	data, err := json.Marshal(jJob)
	if err != nil {
		httpd.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
