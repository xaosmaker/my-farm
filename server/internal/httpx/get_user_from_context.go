package httpx

import (
	"net/http"

	"github.com/xaosmaker/server/internal/db"
)

func GetUserFromContext(r *http.Request) (db.GetUserByIdWithSettingsRow, ServerErrorResponse) {
	// Here we asume the user exist from the middleware so the user error
	// will never run
	v := r.Context().Value("user")
	isCreateFarm := (r.URL.String() == "/api/farms" && r.Method == "POST")

	if v != nil {
		user, ok := v.(db.GetUserByIdWithSettingsRow)
		if !ok {
			return db.GetUserByIdWithSettingsRow{}, ServerError(500, nil)
		}
		if user.FarmID == nil && !isCreateFarm {

			return db.GetUserByIdWithSettingsRow{}, NewNotFoundError(404, "Farm not found", "Farm")
		}
		return user, nil
	}
	return db.GetUserByIdWithSettingsRow{}, ServerError(401, nil)

}
