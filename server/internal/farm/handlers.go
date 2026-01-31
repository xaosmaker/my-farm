package farm

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q farmQeuries) createFarm(w http.ResponseWriter, r *http.Request) {

	farmFields := struct {
		Name string `json:"name" validate:"required,alphanumspace"`
	}{}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	if httpErr := httpx.DecodeAndValidate(r, &farmFields); httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		httpx.NewExistError(409, "Farm already exist", "Farm")(w, r)
		return
	}
	f, err := q.DB.CreateFarm(r.Context(), db.CreateFarmParams{Name: farmFields.Name, ID: user.ID})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	data, err := json.Marshal(toFarmResponse(db.Farm(f)))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
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
		//this code never run it is validated in the middleware
		httpx.NewNotFoundError(404, "Farm not found", "Farm")(w, r)
		return
	}
	data, err := json.Marshal(toFarmResponse(farm))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(data)

}
