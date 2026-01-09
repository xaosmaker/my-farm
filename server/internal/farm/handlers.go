package farm

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q farmQeuries) createFarm(w http.ResponseWriter, r *http.Request) {

	type farmBody struct {
		Name string `json:"name" validate:"required,alphanumspace"`
	}
	farmFields := farmBody{}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		httpx.GeneralError(400, []string{"Farm already Exist can create another"})(w, r)
		return
	}
	if httpErr := httpx.DecodeAndValidate(r, &farmFields); httpErr != nil {
		fmt.Println("Create farm errors ", err)
		httpErr(w, r)
		return
	}
	f, err := q.DB.CreateFarm(r.Context(), db.CreateFarmParams{Name: farmFields.Name, ID: user.ID})
	if err != nil {
		fmt.Println("Create farm in DB errors ", err)
		httpx.GeneralError(500, []string{"internal server error"})(w, r)
		return
	}

	data, err := json.Marshal([]farmResponse{toFarmResponse(db.Farm(f))})
	if err != nil {
		fmt.Println("Create farm in DB errors ", err)
		httpx.GeneralError(500, nil)(w, r)
		return

	}

	w.WriteHeader(201)
	w.Write(data)

}

func (q farmQeuries) getFarm(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		httpx.GeneralError(400, "Farm Not Found")(w, r)
		return
	}
	data, err := json.Marshal([]farmResponse{toFarmResponse(farm)})
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(data)

}
