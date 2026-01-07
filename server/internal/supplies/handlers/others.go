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

	supplyId, err := strconv.ParseInt(r.PathValue("supplyId"), 10, 64)
	if err != nil {
		er.GeneralError(400, "Supply not found")(w, r)
		return
	}

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	supplies, _ := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})

	suppliesResponse, err := json.Marshal([]supplyResponse{toSupplyResponse(supplies)})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(suppliesResponse)

}

func (q SuppliesQueries) GetAllSupplies(w http.ResponseWriter, r *http.Request) {

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	supplies, err := q.DB.GetAllSupplies(r.Context(), *user.FarmID)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return

	}

	suppliesResponse := []supplyResponse{}
	for _, supply := range supplies {
		suppliesResponse = append(suppliesResponse, toSupplyResponse(supply))
	}

	suppliesResponseEncoded, err := json.Marshal(suppliesResponse)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(suppliesResponseEncoded)

}
func (q SuppliesQueries) DeleteSupply(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	supplyId, err := strconv.ParseInt(r.PathValue("supplyId"), 10, 64)
	if err != nil {
		er.GeneralError(400, "Supply not found")(w, r)
		return
	}

	err = q.DB.DeleteSupply(r.Context(), db.DeleteSupplyParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}

	w.WriteHeader(204)

}
