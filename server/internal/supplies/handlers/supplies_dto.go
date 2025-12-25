package handlers

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type supplyResponse struct {
	ID              int64              `json:"id"`
	SupplyType      string             `json:"supplyType"`
	Nickname        *string            `json:"nickname"`
	Name            string             `json:"name"`
	MeasurementUnit string             `json:"measurementUnit"`
	CreatedAt       pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt       pgtype.Timestamptz `json:"updatedAt"`
}

func toSupplyResponse(s db.Supply) supplyResponse {
	return supplyResponse{
		ID:              s.ID,
		SupplyType:      s.SupplyType,
		Nickname:        s.Nickname,
		Name:            s.Name,
		MeasurementUnit: s.MeasurementUnit,
		CreatedAt:       s.CreatedAt,
		UpdatedAt:       s.UpdatedAt,
	}

}
