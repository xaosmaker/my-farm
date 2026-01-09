package handlers

import (
	"encoding/json"
	"net/http"
	"slices"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

//WARN: overwite the seasonId

type jobSupplyParams struct {
	Quantity float64 `json:"quantity" validate:"required"`
	SupplyID *int64  `json:"supplyId" validate:"required"`
}

type requestParams struct {
	JobType     string             `json:"jobType" validate:"required,jobtype"`
	Description *string            `json:"description"`
	JobDate     pgtype.Timestamptz `json:"jobDate" validate:"required"`
	FieldID     int64              `json:"fieldId" validate:"required"`
	JobSupplies []jobSupplyParams  `json:"jobSupplies" validate:"required"`
}

func (q JobsQueries) CreateJob(w http.ResponseWriter, r *http.Request) {
	hasSupplies := false

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to continue")(w, r)
		return
	}
	requestData := requestParams{}
	if err := utils.DecodeAndValidate(r, &requestData); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}
	if slices.Contains(utils.JobTypesWithSupplies(), requestData.JobType) {
		if len(requestData.JobSupplies) == 0 {
			er.GeneralError(400, "JobSupplies should be [{quantity greater than 0 , SupplyId greater than 0}]")(w, r)
			return

		}
		for _, job := range requestData.JobSupplies {

			if err := utils.ValidateFields(&job); err != nil {
				er.GeneralError(400, err)(w, r)
				return

			}
		}
		hasSupplies = true
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		UserID:  user.ID,
		FieldID: requestData.FieldID,
	})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	job, err := q.DB.CreateJob(r.Context(), db.CreateJobParams{
		JobType:     requestData.JobType,
		Description: requestData.Description,
		JobDate:     requestData.JobDate,
		SeasonID:    1,
	})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
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
				er.GeneralError(400, err.Error())(w, r)
				return
			}
		}
	}

	jData, err := json.Marshal(job)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(201)
	w.Write(jData)
}
