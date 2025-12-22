package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q FieldQueries) DeleteField(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to Continue")(w, r)
		return
	}
	id := r.PathValue("id")
	if id == "" {
		er.GeneralError(400, "This method used with params id")(w, r)
		return
	}
	nId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		er.GeneralError(500, "Internal Server Error")(w, r)
		return
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FarmFieldID: nId,
		UserID:      user.ID,
	})
	if err != nil {

		er.GeneralError(400, "Farm Field does not exist")(w, r)
		return
	}
	err = q.DB.DeleteField(r.Context(), nId)
	if err != nil {
		er.GeneralError(500, err.Error())(w, r)
		return
	}
	w.WriteHeader(204)

}

func (q FieldQueries) GetFieldById(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		er.GeneralError(400, "This method used with params id")(w, r)
		return
	}
	nId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		er.GeneralError(500, "Internal Server Error")(w, r)
		return
	}

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to Continue")(w, r)
		return
	}

	data, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FarmFieldID: nId,
		UserID:      user.ID,
	})

	if err != nil {
		er.GeneralError(404, "No Field found")(w, r)
		return
	}
	listData := []db.FarmField{data}
	jData, err := json.Marshal(listData)
	if err != nil {
		er.GeneralError(500, "Internal Server Error")
		return
	}
	w.WriteHeader(200)
	w.Write(jData)

}

func (q FieldQueries) GetAllFields(w http.ResponseWriter, r *http.Request) {

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to Continue")(w, r)
		return
	}
	data, err := q.DB.GetAllFields(r.Context(), user.ID)
	if err != nil {

		er.GeneralError(404, "No Field found")(w, r)
		return

	}

	type FarmFieldSend struct {
		ID                    int64              `json:"id"`
		CreatedAt             pgtype.Timestamptz `json:"createdAt"`
		EditedAt              pgtype.Timestamptz `json:"editedAt"`
		FieldName             string             `json:"fieldName"`
		FieldEpsg2100Boundary *json.RawMessage   `json:"fieldEpsg2100Boundary"`
		FieldEpsg4326Boundary *json.RawMessage   `json:"fieldEpsg4326Boundary"`
		FieldAreaInMeters     float64            `json:"fieldAreaInMeters"`
		FieldLocation         *json.RawMessage   `json:"fieldLocation"`
		FarmFieldID           int64              `json:"farmFieldId"`
		IsOwned               bool               `json:"isOwned"`
	}
	listData := []FarmFieldSend{}
	for _, field := range data {
		listData = append(listData, FarmFieldSend{
			ID:                    field.ID,
			CreatedAt:             field.CreatedAt,
			EditedAt:              field.EditedAt,
			FieldName:             field.FieldName,
			FieldEpsg2100Boundary: field.FieldEpsg2100Boundary,
			FieldEpsg4326Boundary: field.FieldEpsg4326Boundary,
			FieldAreaInMeters:     field.FieldAreaInMeters,
			FieldLocation:         field.FieldLocation,
			FarmFieldID:           field.FarmFieldID,
			IsOwned:               field.IsOwned,
		})
	}

	jData, err := json.Marshal(listData)

	if err != nil {
		er.GeneralError(500, "Internal Server Error")
		return
	}

	w.WriteHeader(200)
	w.Write(jData)

}
