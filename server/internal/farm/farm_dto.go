package farm

import (
	"time"

	"github.com/xaosmaker/server/internal/db"
)

type farmResponse struct {
	ID        int64      `json:"id"`
	Name      string     `json:"name"`
	CreatedAt *time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
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
