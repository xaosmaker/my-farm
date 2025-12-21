package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q FieldQueries) UpdateField(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		fmt.Println("cant parse id from update fields")
		er.GeneralError(400, "Internal Server Error")(w, r)
		return
	}
	nId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		fmt.Println("fail to parse the id of the Update Field url", err, nId)
		er.GeneralError(400, "Enter A valid ID Should be Integer to cal the Patch Method")(w, r)
	}

	type updateFieldRequestParams struct {
		FieldName             *string          `json:"fieldName" validate:"excluded_if=fieldName alphanumspace"`
		FieldEpsg2100Boundary *json.RawMessage `json:"fieldEpsg2100Boundary" validate:"excluded_if=fieldEpsg210Boundary []"`
		FieldEpsg4326Boundary *json.RawMessage `json:"fieldEpsg4326Boundary" validate:"excluded_if=fieldEpsg4326Boundary []"`
		FieldAreaInMeters     *float64         `json:"fieldAreaInMeters" validate:"excluded_if=fieldAreaInMeters number"`
		FieldLocation         *json.RawMessage `json:"fieldLocation" validate:"excluded_if=fieldLocation []"`
		FarmFieldID           int64
		IsOwned               *bool `json:"isOwned" validate:"excluded_if=isOwned boolean"`
	}
	s := updateFieldRequestParams{}

	if err := utils.DecodeAndValidate(r, &s); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}

	// FarmFieldID:           &s.FarmFieldID,
	fiel := db.UpdateFieldParams{
		ID:                    nId,
		FieldName:             s.FieldName,
		FieldEpsg2100Boundary: s.FieldEpsg2100Boundary,
		FieldEpsg4326Boundary: s.FieldEpsg4326Boundary,
		FieldAreaInMeters:     s.FieldAreaInMeters,
		FieldLocation:         s.FieldLocation,
		IsOwned:               s.IsOwned,
	}

	data, err := q.DB.UpdateField(r.Context(), fiel)
	if err != nil {
		fmt.Println(err, "DB ErOOR")
		er.GeneralError(400, err)(w, r)
		return
	}
	jData, _ := json.Marshal(data)
	w.WriteHeader(201)
	w.Write(jData)
	fmt.Println(fiel)

}
