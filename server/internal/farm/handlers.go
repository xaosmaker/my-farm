package farm

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpd"
)

func (q farmQeuries) createFarm(w http.ResponseWriter, r *http.Request) {

	type farmBody struct {
		Name string `json:"name" validate:"required,alphanumspace"`
	}
	farmFields := farmBody{}

	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	if httpErr := httpd.DecodeAndValidate(r, &farmFields); httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		httpd.GeneralError(400, "Farm already Exist cannot create another")(w, r)
		return
	}
	f, err := q.DB.CreateFarm(r.Context(), db.CreateFarmParams{Name: farmFields.Name, ID: user.ID})
	if err != nil {
		httpd.GeneralError(500, []string{"internal server error"})(w, r)
		return
	}

	data, err := json.Marshal([]farmResponse{toFarmResponse(db.Farm(f))})
	if err != nil {
		httpd.GeneralError(500, nil)(w, r)
		return

	}

	w.WriteHeader(201)
	w.Write(data)

}

func (q farmQeuries) getFarm(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpd.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		//this code never run it is validated in the middleware
		httpd.GeneralError(404, "Farm Not Found")(w, r)
		return
	}
	data, err := json.Marshal(toFarmResponse(farm))
	if err != nil {
		httpd.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(data)

}
