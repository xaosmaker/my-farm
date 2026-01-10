package seasons

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q seasonsQueries) createSeason(w http.ResponseWriter, r *http.Request) {
	type seasonRequest struct {
		Name         *string   `json:"name" validate:"required,alphanumspace"`
		StartSeason  time.Time `json:"startSeason" validate:"isTimestamptz"`
		Crop         int64     `json:"crop" validate:"required,number"`
		AreaInMeters float64   `json:"areaInMeters" validate:"required,number"`
	}
	seasonBoby := seasonRequest{}
	if httpErr := httpx.DecodeAndValidate(r, &seasonBoby); httpErr != nil {
		httpErr(w, r)
		return

	}
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	fieldId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "Field doent exist")(w, r)
		return
	}
	if val, _ := q.DB.GetRemainingAreaOfFieldForSeason(r.Context(), fieldId); val < 0.001 {
		httpx.GeneralError(400, fmt.Sprintf("No area to cultivate, remaining area: %.2f", val))(w, r)
		return
	}
	_, err = q.DB.CreateSeason(r.Context(), db.CreateSeasonParams{
		Name:         seasonBoby.Name,
		FieldID:      fieldId,
		Crop:         seasonBoby.Crop,
		AreaInMeters: seasonBoby.AreaInMeters,
		StartSeason:  seasonBoby.StartSeason,
	})
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
	}
	w.WriteHeader(201)

}

func (q seasonsQueries) getAllSeasons(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	fieldId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "Field doent exist")(w, r)
		return
	}
	seasons, _ := q.DB.GetSeasonsByFieldId(r.Context(), fieldId)
	seasonsSlice := []seasonResponse{}
	for _, season := range seasons {
		seasonsSlice = append(seasonsSlice, toSeasonResponse(season, user.LandUnit))

	}
	seasonsEncoded, err := json.Marshal(seasonsSlice)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(seasonsEncoded)

}
