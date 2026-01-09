package supplies

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q suppliesQueries) createSupply(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	type supplyRequest struct {
		SupplyType      string  `json:"supplyType" validate:"required,supplyTypeVal"`
		Nickname        *string `json:"nickname"`
		Name            string  `json:"name" validate:"required"`
		MeasurementUnit string  `json:"measurementUnit" validate:"required,measurementUnitsVal"`
	}
	rd := supplyRequest{}
	if err := httpx.DecodeAndValidate(r, &rd); err != nil {
		httpx.GeneralError(400, err)(w, r)
		return
	}
	supply, err := q.DB.CreateSupplies(r.Context(), db.CreateSuppliesParams{
		SupplyType:      rd.SupplyType,
		Nickname:        rd.Nickname,
		Name:            rd.Name,
		MeasurementUnit: rd.MeasurementUnit,
		FarmID:          *user.FarmID,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.GeneralError(400, "Name Already Exists")(w, r)
			return
		}
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}
	data, err := json.Marshal([]supplyResponse{toSupplyResponse(supply)})
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(201)
	w.Write(data)
}

func (q suppliesQueries) getSupplyDetails(w http.ResponseWriter, r *http.Request) {

	supplyId, httpErr := httpx.GetPathValueToInt64(r, "supplyId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	supplies, _ := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})

	suppliesResponse, err := json.Marshal([]supplyResponse{toSupplyResponse(supplies)})
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(suppliesResponse)

}

func (q suppliesQueries) getAllSupplies(w http.ResponseWriter, r *http.Request) {

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	supplies, err := q.DB.GetAllSupplies(r.Context(), *user.FarmID)
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return

	}

	suppliesResponse := []supplyResponse{}
	for _, supply := range supplies {
		suppliesResponse = append(suppliesResponse, toSupplyResponse(supply))
	}

	suppliesResponseEncoded, err := json.Marshal(suppliesResponse)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(suppliesResponseEncoded)

}
func (q suppliesQueries) deleteSupply(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	supplyId, httpErr := httpx.GetPathValueToInt64(r, "supplyId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	err := q.DB.DeleteSupply(r.Context(), db.DeleteSupplyParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}

	w.WriteHeader(204)

}
