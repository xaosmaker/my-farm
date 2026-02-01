package field

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

func (q fieldQueries) updateField(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	id, httpErr := httpx.GetPathValueToInt64(r, "id")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	//  validate the field exist for the current user
	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return
	}

	fieldReqBody := struct {
		Name             *string          `json:"name" validate:"omitnil,alphanumspace"`
		Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"omitnil"`
		Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"omitnil"`
		AreaInMeters     *float64         `json:"areaInMeters" validate:"omitnil,number"`
		MapLocation      *json.RawMessage `json:"mapLocation" validate:"omitnil"`
		FieldLocation    *string          `json:"fieldLocation" validate:"omitnil,alphanumspace"`
		IsOwned          *bool            `json:"isOwned" validate:"omitnil,boolean"`
	}{}

	if fieldValidateError := httpx.DecodeAndValidate(r, &fieldReqBody); fieldValidateError != nil {
		fieldValidateError(w, r)
		return
	}
	if fieldReqBody.AreaInMeters != nil {
		*fieldReqBody.AreaInMeters *= float64(util.UnitConverter(user.LandUnit))
	}

	fieldBody := db.UpdateFieldParams{
		ID:               id,
		Name:             fieldReqBody.Name,
		Epsg2100Boundary: fieldReqBody.Epsg2100Boundary,
		Epsg4326Boundary: fieldReqBody.Epsg4326Boundary,
		AreaInMeters:     fieldReqBody.AreaInMeters,
		FieldLocation:    fieldReqBody.FieldLocation,
		MapLocation:      fieldReqBody.MapLocation,
		IsOwned:          fieldReqBody.IsOwned,
	}

	field, err := q.DB.UpdateField(r.Context(), fieldBody)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.NewExistError(409, "Field already exist", "Field")(w, r)
			return
		}
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	fieldEnc, err := json.Marshal(toFieldResponse(field, user.LandUnit))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(fieldEnc)
}

func (q fieldQueries) createField(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	fieldReqBody := struct {
		Name             string           `json:"name" validate:"required,alphanumspace"`
		Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"excluded_if=fieldEpsg210Boundary []"`
		Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"excluded_if=fieldEpsg4326Boundary []"`
		MapLocation      *json.RawMessage `json:"mapLocation" validate:"excluded_if=mapLocation []"`
		FieldLocation    *string          `json:"fieldLocation" validate:"alphanumspace"`
		AreaInMeters     float64          `json:"areaInMeters" validate:"required,number"`
		IsOwned          bool             `json:"isOwned" validate:"boolean"`
	}{}

	if fieldValError := httpx.DecodeAndValidate(r, &fieldReqBody); fieldValError != nil {
		fieldValError(w, r)
		return
	}

	fieldData := db.CreateFieldParams{
		Name:             fieldReqBody.Name,
		Epsg2100Boundary: fieldReqBody.Epsg2100Boundary,
		Epsg4326Boundary: fieldReqBody.Epsg4326Boundary,
		AreaInMeters:     fieldReqBody.AreaInMeters * float64(util.UnitConverter(user.LandUnit)),
		MapLocation:      fieldReqBody.MapLocation,
		FieldLocation:    fieldReqBody.FieldLocation,
		FarmID:           *user.FarmID,
		IsOwned:          fieldReqBody.IsOwned,
	}

	field, err := q.DB.CreateField(r.Context(), fieldData)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.NewExistError(409, "Field already exist", "Field")(w, r)
			return
		}

		httpx.NewDBError(err.Error())(w, r)
		return
	}
	fieldEnc, err := json.Marshal(toFieldResponse(field, user.LandUnit))

	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	w.WriteHeader(201)
	w.Write(fieldEnc)

}

func (q fieldQueries) deleteField(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	id, httpErr := httpx.GetPathValueToInt64(r, "id")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return
	}
	err = q.DB.DeleteField(r.Context(), id)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}
	w.WriteHeader(204)

}

func (q fieldQueries) getFieldById(w http.ResponseWriter, r *http.Request) {
	id, httpErr := httpx.GetPathValueToInt64(r, "id")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	data, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})

	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return
	}

	jData, err := json.Marshal(toFieldResponse(data, user.LandUnit))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(jData)

}

func (q fieldQueries) getAllFields(w http.ResponseWriter, r *http.Request) {

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	data, err := q.DB.GetAllFields(r.Context(), user.ID)
	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return

	}

	listData := []fieldResponse{}
	for _, field := range data {
		listData = append(listData, toFieldResponse(field, user.LandUnit))
	}

	jData, err := json.Marshal(listData)

	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(jData)

}
