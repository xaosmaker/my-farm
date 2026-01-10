package seasons

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type seasonResponse struct {
	ID           int64              `json:"id"`
	FieldID      int64              `json:"fieldId"`
	Name         *string            `json:"name"`
	StartSeason  pgtype.Timestamptz `json:"startSeason"`
	FinishSeason pgtype.Timestamptz `json:"endSeason"`
	Crop         int64              `json:"crop"`
	Boundary     *json.RawMessage   `json:"boundary"`
	AreaInMeters float64            `json:"areaInMeters"`
	CreatedAt    pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt    pgtype.Timestamptz `json:"updatedAt"`
}

func toSeasonResponse(s db.Season) seasonResponse {
	return seasonResponse{
		ID:           s.ID,
		FieldID:      s.FieldID,
		Name:         s.Name,
		StartSeason:  s.StartSeason,
		FinishSeason: s.FinishSeason,
		Crop:         s.Crop,
		Boundary:     s.Boundary,
		AreaInMeters: s.AreaInMeters,
		CreatedAt:    s.CreatedAt,
		UpdatedAt:    s.UpdatedAt,
	}
}
