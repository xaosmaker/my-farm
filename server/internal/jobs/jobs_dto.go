package jobs

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type jobResponse struct {
	ID           int64              `json:"id"`
	JobType      string             `json:"jobType"`
	Description  *string            `json:"description"`
	SeasonID     int64              `json:"seasonId"`
	JobDate      pgtype.Timestamptz `json:"jobDate"`
	CreatedAt    pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt    pgtype.Timestamptz `json:"updatedAt"`
	JobsSupplies *json.RawMessage   `json:"jobsSupplies"`
}

func toJobResponse(f db.GetAllJobsRow) jobResponse {

	return jobResponse{
		ID:           f.ID,
		JobType:      f.JobType,
		Description:  f.Description,
		SeasonID:     f.SeasonID,
		JobDate:      f.JobDate,
		CreatedAt:    f.CreatedAt,
		UpdatedAt:    f.UpdatedAt,
		JobsSupplies: f.JobsSupplies,
	}
}

func toJobDetailsResponse(f db.GetJobDetailsRow) jobResponse {

	return jobResponse{
		ID:           f.ID,
		JobType:      f.JobType,
		Description:  f.Description,
		SeasonID:     f.SeasonID,
		JobDate:      f.JobDate,
		CreatedAt:    f.CreatedAt,
		UpdatedAt:    f.UpdatedAt,
		JobsSupplies: f.JobsSupplies,
	}
}
