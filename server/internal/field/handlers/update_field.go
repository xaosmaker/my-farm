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

type updateFieldRequestParams struct {
	Name             *string          `json:"name" validate:"excluded_if=fieldName alphanumspace"`
	Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"excluded_if=epsg210Boundary []"`
	Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"excluded_if=epsg4326Boundary []"`
	AreaInMeters     *float64         `json:"areaInMeters" validate:"excluded_if=areaInMeters number"`
	FieldLocation    *json.RawMessage `json:"fieldLocation" validate:"excluded_if=fieldLocation []"`
	IsOwned          *bool            `json:"isOwned" validate:"excluded_if=isOwned boolean"`
}

func (q FieldQueries) UpdateField(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to continue")(w, r)
		return
	}
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

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: nId,
		UserID:  user.ID,
	})
	if err != nil {
		er.GeneralError(400, "Farm Field does not exist")(w, r)
		return
	}

	s := updateFieldRequestParams{}

	if err := utils.DecodeAndValidate(r, &s); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}

	fiel := db.UpdateFieldParams{
		ID:               nId,
		Name:             s.Name,
		Epsg2100Boundary: s.Epsg2100Boundary,
		Epsg4326Boundary: s.Epsg4326Boundary,
		AreaInMeters:     s.AreaInMeters,
		FieldLocation:    s.FieldLocation,
		IsOwned:          s.IsOwned,
	}

	data, err := q.DB.UpdateField(r.Context(), fiel)
	if err != nil {
		fmt.Println(err, "DB ErOOR")
		er.GeneralError(400, "Name alredy Exists")(w, r)
		return
	}
	jData, _ := json.Marshal([]fieldResponse{toFieldResponse(data)})
	w.WriteHeader(201)
	w.Write(jData)

}
