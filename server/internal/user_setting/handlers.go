package usersetting

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q userSettingsQueries) getSettings(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	setting, err := q.DB.GetUserSettings(r.Context(), user.ID)
	if err != nil {
		httpx.NewNotFoundError(404, "Settings not found", "Settings")(w, r)
		return
	}
	encodedSettings, err := json.Marshal(toSettingsResponse(setting))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(encodedSettings)

}

func (q userSettingsQueries) updateSettings(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	settingReqBody := struct {
		LandUnit string `json:"landUnit" validate:"required,landUnitVal"`
	}{}

	if settingsValError := httpx.DecodeAndValidate(r, &settingReqBody); settingsValError != nil {
		settingsValError(w, r)
		return
	}

	_, err := q.DB.UpdateSettings(r.Context(), db.UpdateSettingsParams{
		LandUnit: settingReqBody.LandUnit,
		UserID:   user.ID,
	})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}
	w.WriteHeader(204)

}
