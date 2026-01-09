package httpx

import (
	"github.com/xaosmaker/server/internal/db"
	"net/http"
)

func GetUserFromContext(r *http.Request) (db.GetUserByIdWithSettingsRow, HttpErrorResponse) {
	// Here we asume the user exist from the middleware so the user error
	// will never run
	v := r.Context().Value("user")

	if v != nil {
		user, ok := v.(db.GetUserByIdWithSettingsRow)
		if !ok {
			return db.GetUserByIdWithSettingsRow{}, GeneralError(500, "Cant cast type user")
		}
		if user.FarmID == nil {
			return user, GeneralError(400, "Create a farm before continue")
		}
		return user, nil
	}
	return db.GetUserByIdWithSettingsRow{}, GeneralError(400, "User not found")

}
