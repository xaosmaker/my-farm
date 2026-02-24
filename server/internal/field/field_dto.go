package field

import (
	"encoding/json"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/util"
)

type fieldResponse struct {
	ID               int64            `json:"id"`
	Name             string           `json:"name"`
	Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary"`
	Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary"`
	MapLocation      *json.RawMessage `json:"mapLocation"`
	FieldLocation    *string          `json:"fieldLocation"`
	AreaInMeters     float64          `json:"areaInMeters"`
	IsOwned          bool             `json:"isOwned"`
	CreatedAt        *time.Time       `json:"createdAt"`
	UpdatedAt        *time.Time       `json:"updatedAt"`
	LandUnit         any              `json:"landUnit"`
	// FarmID           int64              `json:"farmId"`
}

func toFieldResponse(f db.Field, landUnit string) fieldResponse {

	return fieldResponse{
		ID:               f.ID,
		Name:             f.Name,
		Epsg2100Boundary: f.Epsg2100Boundary,
		Epsg4326Boundary: f.Epsg4326Boundary,
		MapLocation:      f.MapLocation,
		FieldLocation:    f.FieldLocation,
		AreaInMeters:     f.AreaInMeters / float64(util.UnitConverter(landUnit)),
		IsOwned:          f.IsOwned,
		CreatedAt:        f.CreatedAt,
		UpdatedAt:        f.UpdatedAt,
		LandUnit:         landUnit,
	}

}
