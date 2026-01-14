package jobs

import (
	"encoding/json"
	"net/http"
	"slices"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

//WARN: overwite the seasonId

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
	if slices.Contains(httpx.JobTypesWithSupplies(), requestData.JobType) {
		if len(requestData.JobSupplies) == 0 {
			httpx.GeneralError(400, "JobSupplies should be [{quantity: greater than 0 , supplyId: the id of a supply object}]")(w, r)
			return

		}
		for _, job := range requestData.JobSupplies {

			if err := httpx.ValidateFields(&job); err != nil {
				httpx.GeneralError(400, err)(w, r)
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
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}

	_, err = q.DB.GetSeasonById(r.Context(), requestData.SeasonID)
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}

	job, err := q.DB.CreateJob(r.Context(), db.CreateJobParams{
		JobType:      requestData.JobType,
		Description:  requestData.Description,
		JobDate:      requestData.JobDate,
		SeasonID:     requestData.SeasonID,
		AreaInMeters: requestData.AreaInMeters * float64(httpx.UnitConverter(user.LandUnit)),
	})
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
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
				httpx.GeneralError(400, err.Error())(w, r)
				return
			}
		}
	}

	jData, err := json.Marshal(job)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
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
		httpx.GeneralError(404, "Resourse not found")(w, r)
		return
	}

	if _, err := q.DB.GetSeasonById(r.Context(), seasonId); err != nil {
		httpx.GeneralError(404, "Resource not found")

		return
	}

	jobs, err := q.DB.GetAllJobs(r.Context(), seasonId)
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}

	jJobs := []jobResponse{}
	for _, job := range jobs {
		jJobs = append(jJobs, toJobResponse(job, user.LandUnit))
	}

	data, err := json.Marshal(jJobs)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
func (q jobsQueries) getJobDetails(w http.ResponseWriter, r *http.Request) {
	//WARN: this method is unused for now

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	fieldId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	jobId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "This Field Doesnt Exist")
	}
	job, err := q.DB.GetJobDetails(r.Context(), db.GetJobDetailsParams{
		//WARN: overwrite the season id
		SeasonID: 1,
		JobID:    &jobId,
	})

	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}
	jJob := toJobDetailsResponse(job)

	data, err := json.Marshal(jJob)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
