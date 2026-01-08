package usersettings

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q userSettingsQueries) getSettings(w http.ResponseWriter, r *http.Request) {
	user, _ := utils.GetUserFromContext(r)

	settings, err := q.DB.GetUserSettings(r.Context(), user.ID)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	encodedSettings, err := json.Marshal(toSettingsResponse(settings))
	if err != nil {
		er.GeneralError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(encodedSettings)

}

func (q userSettingsQueries) updateSettings(w http.ResponseWriter, r *http.Request) {
	user, _ := utils.GetUserFromContext(r)
	type settingRequest struct {
		LandUnit any `json:"landUnit" validate:"required,oneof=stremata hectares m2"`
	}
	sReq := settingRequest{}

	if err := utils.DecodeAndValidate(r, &sReq); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}

	_, err := q.DB.UpdateSettings(r.Context(), db.UpdateSettingsParams{
		LandUnit: sReq.LandUnit,
		UserID:   user.ID,
	})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
	}
	w.WriteHeader(204)

}
