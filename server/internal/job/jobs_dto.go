package job

import (
	"encoding/json"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpd"
)

type jobResponse struct {
	ID           int64            `json:"id"`
	JobType      string           `json:"jobType"`
	Description  *string          `json:"description"`
	SeasonID     int64            `json:"seasonId"`
	JobDate      time.Time        `json:"jobDate"`
	AreaInMeters float64          `json:"areaInMeters"`
	Boundary     *json.RawMessage `json:"boundary"`
	LandUnit     string           `json:"landUnit"`
	CreatedAt    *time.Time       `json:"createdAt"`
	UpdatedAt    *time.Time       `json:"updatedAt"`
	JobsSupplies *json.RawMessage `json:"jobsSupplies"`
}

func toJobResponse(f db.GetAllJobsRow, landUnit string) jobResponse {

	return jobResponse{
		ID:           f.ID,
		JobType:      f.JobType,
		Description:  f.Description,
		SeasonID:     f.SeasonID,
		JobDate:      f.JobDate,
		AreaInMeters: f.AreaInMeters / float64(httpd.UnitConverter(landUnit)),
		Boundary:     f.Boundary,
		CreatedAt:    f.CreatedAt,
		UpdatedAt:    f.UpdatedAt,
		JobsSupplies: f.JobsSupplies,
		LandUnit:     landUnit,
	}
}

func toJobDetailsResponse(f db.GetJobDetailsRow) jobResponse {

	return jobResponse{
		ID:           f.ID,
		JobType:      f.JobType,
		Description:  f.Description,
		SeasonID:     f.SeasonID,
		JobDate:      f.JobDate,
		AreaInMeters: f.AreaInMeters,
		Boundary:     f.Boundary,
		CreatedAt:    f.CreatedAt,
		UpdatedAt:    f.UpdatedAt,
		JobsSupplies: f.JobsSupplies,
	}
}
