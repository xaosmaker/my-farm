package seasons

import (
	"encoding/json"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

type seasonResponse struct {
	ID           int64              `json:"id"`
	FieldID      int64              `json:"fieldId"`
	Name         *string            `json:"name"`
	StartSeason  time.Time          `json:"startSeason"`
	FinishSeason pgtype.Timestamptz `json:"finishSeason"`
	Crop         int64              `json:"crop"`
	Boundary     *json.RawMessage   `json:"boundary"`
	AreaInMeters float64            `json:"areaInMeters"`
	CreatedAt    pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt    pgtype.Timestamptz `json:"updatedAt"`
	LandUnit     string             `json:"landUnit"`
	CropName     string             `json:"cropName"`
}

func toSeasonResponse(s db.GetSeasonsByFieldIdRow, landUnit string) seasonResponse {
	return seasonResponse{
		ID:           s.ID,
		FieldID:      s.FieldID,
		Name:         s.Name,
		StartSeason:  s.StartSeason,
		FinishSeason: s.FinishSeason,
		Crop:         s.Crop,
		Boundary:     s.Boundary,
		AreaInMeters: s.AreaInMeters / float64(httpx.UnitConverter(landUnit)),
		CreatedAt:    s.CreatedAt,
		UpdatedAt:    s.UpdatedAt,
		LandUnit:     landUnit,
		CropName:     s.CropName,
	}
}
