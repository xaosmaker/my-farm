package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q SuppliesQueries) GetSupplyDetails(w http.ResponseWriter, r *http.Request) {

	supplyId := r.PathValue("supplyId")
	if supplyId == "" {
		er.GeneralError(400, "supplyId param required in request")(w, r)
		return
	}
	supplyIdNum, err := strconv.ParseInt(supplyId, 10, 64)
	if err != nil {
		er.GeneralError(400, "supplyId param should be an int")(w, r)
		return

	}
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
	data, _ := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: farm.ID,
		ID:     supplyIdNum,
	})
	dataJson, err := json.Marshal([]supplyResponse{toSupplyResponse(data)})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(dataJson)

}

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
