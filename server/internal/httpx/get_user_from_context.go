package httpx

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
)

func GetUserFromCtx(r *http.Request) (db.GetUserByIdWithSettingsRow, error) {
	v := r.Context().Value("user")
	isCreateFarm := (r.URL.String() == "/api/farms" && r.Method == "POST")

	if v != nil {
		user, ok := v.(db.GetUserByIdWithSettingsRow)
		if !ok {
			return db.GetUserByIdWithSettingsRow{}, apperror.New500Error(nil)
		}
		if user.FarmID == nil && !isCreateFarm {

			return db.GetUserByIdWithSettingsRow{}, apperror.New404NotFoundError("Farm not found", "Farm", nil)
		}
		return user, nil
	}
	return db.GetUserByIdWithSettingsRow{}, apperror.New401UnauthorizedError("", nil)

}
