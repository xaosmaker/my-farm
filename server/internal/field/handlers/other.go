package handlers

import (
	"encoding/json"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
	"net/http"
	"strconv"
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
		FieldID: nId,
		UserID:  user.ID,
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
		FieldID: nId,
		UserID:  user.ID,
	})

	if err != nil {
		er.GeneralError(404, "No Field found")(w, r)
		return
	}
	listData := []fieldResponse{toFieldResponse(data)}
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

	listData := []fieldResponse{}
	for _, field := range data {
		listData = append(listData, toFieldResponse(field))
	}

	jData, err := json.Marshal(data)

	if err != nil {
		er.GeneralError(500, "Internal Server Error")
		return
	}

	w.WriteHeader(200)
	w.Write(jData)

}
