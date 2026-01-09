package field

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

type createFieldRequestParams struct {
	Name             string           `json:"name" validate:"required,alphanumspace"`
	Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"excluded_if=fieldEpsg210Boundary []"`
	Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"excluded_if=fieldEpsg4326Boundary []"`
	MapLocation      *json.RawMessage `json:"mapLocation" validate:"excluded_if=mapLocation []"`
	FieldLocation    *string          `json:"fieldLocation" validate:"alphanumspace"`
	AreaInMeters     float64          `json:"areaInMeters" validate:"required,number"`
	IsOwned          bool             `json:"isOwned" validate:"boolean"`
}

type updateFieldRequestParams struct {
	Name             *string          `json:"name" validate:"omitnil,alphanumspace"`
	Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"omitnil"`
	Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"omitnil"`
	AreaInMeters     *float64         `json:"areaInMeters" validate:"omitnil,number"`
	MapLocation      *json.RawMessage `json:"mapLocation" validate:"omitnil"`
	FieldLocation    *string          `json:"fieldLocation" validate:"omitnil,alphanumspace"`
	IsOwned          *bool            `json:"isOwned" validate:"omitnil,boolean"`
}

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

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "Farm Field does not exist")(w, r)
		return
	}

	s := updateFieldRequestParams{}

	if err := httpx.DecodeAndValidate(r, &s); err != nil {
		err(w, r)
		return
	}
	if s.AreaInMeters != nil {
		*s.AreaInMeters *= float64(httpx.UnitConverter(user.LandUnit))
	}

	fiel := db.UpdateFieldParams{
		ID:               id,
		Name:             s.Name,
		Epsg2100Boundary: s.Epsg2100Boundary,
		Epsg4326Boundary: s.Epsg4326Boundary,
		AreaInMeters:     s.AreaInMeters,
		FieldLocation:    s.FieldLocation,
		MapLocation:      s.MapLocation,
		IsOwned:          s.IsOwned,
	}

	data, err := q.DB.UpdateField(r.Context(), fiel)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {

			httpx.GeneralError(400, "Field already exists with this name")(w, r)
			return
		}

		httpx.GeneralError(400, err.Error())(w, r)
		return
	}
	jData, _ := json.Marshal([]fieldResponse{toFieldResponse(data, user.LandUnit)})
	w.WriteHeader(200)
	w.Write(jData)

}

func (q fieldQueries) createField(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		httpx.GeneralError(400, "Need to create farm before you create Field")(w, r)
		return
	}

	fields := createFieldRequestParams{}

	if err := httpx.DecodeAndValidate(r, &fields); err != nil {
		err(w, r)
		return
	}

	params := db.CreateFieldParams{
		Name:             fields.Name,
		Epsg2100Boundary: fields.Epsg2100Boundary,
		Epsg4326Boundary: fields.Epsg4326Boundary,
		AreaInMeters:     fields.AreaInMeters * float64(httpx.UnitConverter(user.LandUnit)),
		MapLocation:      fields.MapLocation,
		FieldLocation:    fields.FieldLocation,
		FarmID:           farm.ID,
		IsOwned:          fields.IsOwned,
	}

	field, err := q.DB.CreateField(r.Context(), params)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.GeneralError(400, "Field already exists with this name")(w, r)
			return
		}

		httpx.GeneralError(400, err.Error())
	}
	data, _ := json.Marshal([]fieldResponse{toFieldResponse(field, user.LandUnit)})
	w.WriteHeader(201)
	w.Write(data)

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
		httpx.GeneralError(400, "Farm Field does not exist")(w, r)
		return
	}
	err = q.DB.DeleteField(r.Context(), id)
	if err != nil {
		httpx.GeneralError(500, err.Error())(w, r)
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
		httpx.GeneralError(404, "No Field found")(w, r)
		return
	}

	listData := []fieldResponse{toFieldResponse(data, user.LandUnit)}
	jData, err := json.Marshal(listData)
	if err != nil {
		httpx.GeneralError(500, "Internal Server Error")
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

		httpx.GeneralError(404, "No Field found")(w, r)
		return

	}

	listData := []fieldResponse{}
	for _, field := range data {
		listData = append(listData, toFieldResponse(field, user.LandUnit))
	}

	jData, err := json.Marshal(listData)

	if err != nil {
		httpx.GeneralError(500, "Internal Server Error")
		return
	}

	w.WriteHeader(200)
	w.Write(jData)

}
