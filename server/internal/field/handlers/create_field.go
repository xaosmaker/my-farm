package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
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

func (q FieldQueries) CreateField(w http.ResponseWriter, r *http.Request) {
	user, _ := utils.GetUserFromContext(r)
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		er.GeneralError(400, "Need to create farm before you create Field")(w, r)
		return
	}

	fields := createFieldRequestParams{}

	if err := utils.DecodeAndValidate(r, &fields); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}
	fmt.Println(fields, 1234234)

	params := db.CreateFieldParams{
		Name:             fields.Name,
		Epsg2100Boundary: fields.Epsg2100Boundary,
		Epsg4326Boundary: fields.Epsg4326Boundary,
		AreaInMeters:     fields.AreaInMeters,
		MapLocation:      fields.MapLocation,
		FieldLocation:    fields.FieldLocation,
		FarmID:           farm.ID,
		IsOwned:          fields.IsOwned,
	}

	field, err := q.DB.CreateField(r.Context(), params)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {

			er.GeneralError(400, "Field already exists with this name")(w, r)
			return
		}
		er.GeneralError(400, err.Error())
		fmt.Println(err, "Error")
	}
	data, _ := json.Marshal([]fieldResponse{toFieldResponse(field)})
	w.WriteHeader(201)
	w.Write(data)

}
