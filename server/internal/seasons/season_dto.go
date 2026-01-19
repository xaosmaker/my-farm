package seasons

import (
	"encoding/json"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

type seasonStatisticsResponse struct {
	TotalQuantity   float64 `json:"totalQuantity"`
	HarvestQuantity float64 `json:"harvestQuantity"`
	SupplyID        *int64  `json:"supplyId"`
	SupplyName      *string `json:"supplyName"`
	MeasurementUnit *string `json:"measurementUnit"`
}

func toSeasonStatisticsResponse(s db.GetSeasonStatisticsRow) seasonStatisticsResponse {
	return seasonStatisticsResponse{
		TotalQuantity:   s.TotalQuantity,
		HarvestQuantity: s.HarvestQuantity,
		SupplyID:        s.SupplyID,
		SupplyName:      s.SupplyName,
		MeasurementUnit: s.MeasurementUnit,
	}

}

type seasonResponse struct {
	ID                int64            `json:"id"`
	FieldID           int64            `json:"fieldId"`
	Name              *string          `json:"name"`
	StartSeason       time.Time        `json:"startSeason"`
	FinishSeason      *time.Time       `json:"finishSeason"`
	Crop              int64            `json:"crop"`
	Boundary          *json.RawMessage `json:"boundary"`
	AreaInMeters      float64          `json:"areaInMeters"`
	CreatedAt         *time.Time       `json:"createdAt"`
	UpdatedAt         *time.Time       `json:"updatedAt"`
	LandUnit          string           `json:"landUnit"`
	CropName          string           `json:"cropName"`
	FieldName         string           `json:"fieldName"`
	FieldAreaInMeters float64          `json:"fieldAreaInMeters"`
}

func toSeasonResponse(s db.GetSeasonsByFieldIdRow, landUnit string) seasonResponse {
	return seasonResponse{
		ID:                s.ID,
		FieldID:           s.FieldID,
		Name:              s.Name,
		StartSeason:       s.StartSeason,
		FinishSeason:      s.FinishSeason,
		Crop:              s.Crop,
		Boundary:          s.Boundary,
		AreaInMeters:      s.AreaInMeters / float64(httpx.UnitConverter(landUnit)),
		CreatedAt:         s.CreatedAt,
		UpdatedAt:         s.UpdatedAt,
		LandUnit:          landUnit,
		CropName:          s.CropName,
		FieldName:         s.FieldName,
		FieldAreaInMeters: s.FieldAreaInMeters / float64(httpx.UnitConverter(landUnit)),
	}
}

func toSeasonDetailResponse(s db.GetSeasonByIdRow, landUnit string) seasonResponse {
	return seasonResponse{
		ID:                s.ID,
		FieldID:           s.FieldID,
		Name:              s.Name,
		StartSeason:       s.StartSeason,
		FinishSeason:      s.FinishSeason,
		Crop:              s.Crop,
		Boundary:          s.Boundary,
		AreaInMeters:      s.AreaInMeters / float64(httpx.UnitConverter(landUnit)),
		CreatedAt:         s.CreatedAt,
		UpdatedAt:         s.UpdatedAt,
		LandUnit:          landUnit,
		CropName:          s.CropName,
		FieldName:         s.FieldName,
		FieldAreaInMeters: s.FieldAreaInMeters / float64(httpx.UnitConverter(landUnit)),
	}
}

func toAllSeasonResponse(s db.GetALLActiveSeasonsRow, landUnit string) seasonResponse {
	return seasonResponse{
		ID:                s.ID,
		FieldID:           s.FieldID,
		Name:              s.Name,
		StartSeason:       s.StartSeason,
		FinishSeason:      s.FinishSeason,
		Crop:              s.Crop,
		Boundary:          s.Boundary,
		AreaInMeters:      s.AreaInMeters / float64(httpx.UnitConverter(landUnit)),
		CreatedAt:         s.CreatedAt,
		UpdatedAt:         s.UpdatedAt,
		LandUnit:          landUnit,
		CropName:          s.CropName,
		FieldName:         s.FieldName,
		FieldAreaInMeters: s.FieldAreaInMeters / float64(httpx.UnitConverter(landUnit)),
	}
}
