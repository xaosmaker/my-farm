package handlers

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
)

type farmResponse struct {
	ID        int64              `json:"id"`
	Name      string             `json:"name"`
	CreatedAt pgtype.Timestamptz `json:"createdAt"`
	UpdatedAt pgtype.Timestamptz `json:"updatedAt"`
}

func toFarmResponse(s db.Farm) farmResponse {

	f := farmResponse{
		ID:        s.ID,
		Name:      s.Name,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}
	return f

}
