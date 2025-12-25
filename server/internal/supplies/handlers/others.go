package handlers

import (
	"encoding/json"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
	"net/http"
)

func (q SuppliesQueries) GetAllSupplies(w http.ResponseWriter, r *http.Request) {

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "Login to continue")(w, r)
		return
	}
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		er.GeneralError(400, "Create A Farm to continue")(w, r)
		return
	}
	supplies, err := q.DB.GetAllSupplies(r.Context(), farm.ID)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return

	}
	s := []supplyResponse{}
	for _, supply := range supplies {
		s = append(s, toSupplyResponse(supply))
	}
	suppliesRES, err := json.Marshal(s)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(suppliesRES)

}
