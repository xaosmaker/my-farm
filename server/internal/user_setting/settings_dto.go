package usersetting

import (
	"time"

	"github.com/xaosmaker/server/internal/db"
)

type SettingsResponse struct {
	ID        int64      `json:"id"`
	UserID    int64      `json:"userId"`
	LandUnit  any        `json:"landUnit"`
	CreatedAt *time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}

func toSettingsResponse(s db.Setting) SettingsResponse {
	return SettingsResponse{
		ID:        s.ID,
		UserID:    s.UserID,
		LandUnit:  s.LandUnit,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}

}
