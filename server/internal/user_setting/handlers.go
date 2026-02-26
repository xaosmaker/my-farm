package usersetting

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q userSettingsQueries) getSettings(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	setting, err := q.DB.GetUserSettings(r.Context(), user.ID)
	if err != nil {

		return apperror.New404NotFoundError("Settings not found", "Settings", err)
	}
	return httpx.WriteJSON(w, 200, toSettingsResponse(setting))

}

func (q userSettingsQueries) updateSettings(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	settingReqBody := struct {
		LandUnit string `json:"landUnit" validate:"required,landUnitVal"`
	}{}

	if err := httpx.DecodeAndVal(r, &settingReqBody); err != nil {
		return err
	}

	_, err = q.DB.UpdateSettings(r.Context(), db.UpdateSettingsParams{
		LandUnit: settingReqBody.LandUnit,
		UserID:   user.ID,
	})
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 204, nil)

}
