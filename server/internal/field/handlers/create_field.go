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

func (q FieldQueries) CreateField(w http.ResponseWriter, r *http.Request) {
	user, _ := utils.GetUserFromContext(r)
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		er.GeneralError(400, "Need to create farm before you create Field")(w, r)
		return
	}

	type createFieldRequestParams struct {
		FieldName             string           `json:"fieldName" validate:"required,alphanumspace"`
		FieldEpsg2100Boundary *json.RawMessage `json:"fieldEpsg2100Boundary" validate:"excluded_if=fieldEpsg210Boundary []"`
		FieldEpsg4326Boundary *json.RawMessage `json:"fieldEpsg4326Boundary" validate:"excluded_if=fieldEpsg4326Boundary []"`
		FieldAreaInMeters     float64          `json:"fieldAreaInMeters" validate:"required,number"`
		FieldLocation         *json.RawMessage `json:"fieldLocation" validate:"excluded_if=fieldLocation []"`
		FarmFieldID           int64
		IsOwned               bool `json:"isOwned" validate:"boolean"`
	}
	fields := createFieldRequestParams{}

	if err := utils.DecodeAndValidate(r, &fields); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}

	// params := db.CreateFieldParams{
	// 	FieldName:             fields.FieldName,
	// 	FieldEpsg2100Boundary: fields.FieldEpsg2100Boundary,
	// 	FieldEpsg4326Boundary: fields.FieldEpsg4326Boundary,
	// 	FieldAreaInMeters:     fields.FieldAreaInMeters,
	// 	FieldLocation:         fields.FieldLocation,
	// 	FarmFieldID:           farm.ID,
	// 	IsOwned:               fields.IsOwned,
	// }
	params := db.CreateFieldParams(fields)
	params.FarmFieldID = farm.ID

	field, err := q.DB.CreateField(r.Context(), params)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {

			er.GeneralError(400, "Field already exists with this name")(w, r)
			return
		}
		fmt.Println(err, "Error")
	}
	data, _ := json.Marshal(field)
	w.WriteHeader(201)
	w.Write(data)

}
