package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
	"net/http"
)

func (q FarmQeuries) CreateFarm(w http.ResponseWriter, r *http.Request) {

	type FarmBody struct {
		Name string `json:"name" validate:"required,alphanumspace"`
	}
	farmFields := FarmBody{}

	user, _ := utils.GetUserFromContext(r)

	_, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		er.GeneralError(400, []string{"Farm already Exist can create another"})(w, r)
		return
	}
	if err := utils.DecodeAndValidate(r, &farmFields); err != nil {
		fmt.Println("Create farm errors ", err)
		er.GeneralError(400, err)(w, r)
		return
	}
	f, err := q.DB.CreateFarm(r.Context(), db.CreateFarmParams{Name: farmFields.Name, ID: user.ID})
	if err != nil {
		fmt.Println("Create farm in DB errors ", err)
		er.GeneralError(500, []string{"internal server error"})(w, r)
		return
	}

	data, err := json.Marshal([]farmResponse{toFarmResponse(db.Farm(f))})
	if err != nil {
		fmt.Println("Create farm in DB errors ", err)
		er.GeneralError(500, []string{"internal server error"})(w, r)
		return

	}

	w.WriteHeader(201)
	w.Write(data)

}
