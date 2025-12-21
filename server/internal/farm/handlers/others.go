package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q FarmQeuries) GetFarm(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to continue")(w, r)
		return
	}
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		er.GeneralError(400, "Farm Not Found")(w, r)
		return
	}
	data, err := json.Marshal([]db.Farm{farm})
	if err != nil {
		er.GeneralError(500, "Internal Server Error")(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(data)

}
