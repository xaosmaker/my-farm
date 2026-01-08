package utils

import (
	"errors"
	"github.com/xaosmaker/server/internal/db"
	"net/http"
)

func GetUserFromContext(r *http.Request) (db.GetUserByIdWithSettingsRow, error) {
	// Here we asume the user exist from the middleware so the user error
	// will never run
	v := r.Context().Value("user")

	if v != nil {
		user, ok := v.(db.GetUserByIdWithSettingsRow)
		if !ok {
			return db.GetUserByIdWithSettingsRow{}, errors.New("Cant cast type user")
		}
		if user.FarmID == nil {
			return user, errors.New("Create a farm before continue")
		}
		return user, nil
	}
	return db.GetUserByIdWithSettingsRow{}, errors.New("User not found")

}
