package handlers

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type internalJobResponse struct {
	ID          int64              `json:"id"`
	JobType     string             `json:"jobType"`
	Description *string            `json:"description"`
	FieldID     int64              `json:"fieldId"`
	JobDate     pgtype.Timestamptz `json:"jobDate"`
	CreatedAt   pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt   pgtype.Timestamptz `json:"updatedAt"`
}

type jobResponse struct {
	internalJobResponse
	TotalSupplies int64 `json:"totalSupplies"`
}
type jobDetailsResponse struct {
	internalJobResponse
	JobsSupplies *json.RawMessage `json:"jobsSupplies"`
}

func toJodResponse(f db.GetAllJobsRow) jobResponse {
	return jobResponse{
		internalJobResponse: internalJobResponse{
			ID:          f.ID,
			JobType:     f.JobType,
			Description: f.Description,
			FieldID:     f.FieldID,
			JobDate:     f.JobDate,
			CreatedAt:   f.CreatedAt,
			UpdatedAt:   f.UpdatedAt,
		},
		TotalSupplies: f.TotalSupplies,
	}
}

func toJodDetailsResponse(f db.GetJobDetailsRow) jobDetailsResponse {
	return jobDetailsResponse{
		internalJobResponse: internalJobResponse{
			ID:          f.ID,
			JobType:     f.JobType,
			Description: f.Description,
			FieldID:     f.FieldID,
			JobDate:     f.JobDate,
			CreatedAt:   f.CreatedAt,
			UpdatedAt:   f.UpdatedAt,
		},
		JobsSupplies: f.JobsSupplies,
	}
}
