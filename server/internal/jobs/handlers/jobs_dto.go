package handlers

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type jobResponse struct {
	ID          int64              `json:"id"`
	JobType     string             `json:"jobType"`
	Description *string            `json:"description"`
	FieldID     int64              `json:"fieldId"`
	JobDate     pgtype.Timestamptz `json:"jobDate"`
	CreatedAt   pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt   pgtype.Timestamptz `json:"updatedAt"`
}

type totalJobSuppliesResponse struct {
	jobResponse
	TotalSupplies int64 `json:"totalSupplies"`
}
type jobSuppliesResponse struct {
	JobsSupplies *json.RawMessage `json:"jobsSupplies"`
}

func toTotalJodSuppliesResponse(f db.GetAllJobsRow) totalJobSuppliesResponse {
	return totalJobSuppliesResponse{
		jobResponse: jobResponse{
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
