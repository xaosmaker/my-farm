package supply

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q suppliesQueries) updateSupply(w http.ResponseWriter, r *http.Request) {
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

	supplyReqbody := struct {
		SupplyType      *string `json:"supplyType" validate:"omitnil,supplyTypeVal"`
		Nickname        *string `json:"nickname"`
		Name            *string `json:"name" validate:"omitnil"`
		MeasurementUnit *string `json:"measurementUnit" validate:"omitnil,measurementUnitsVal"`
	}{}
	if httpErr := httpx.DecodeAndValidate(r, &supplyReqbody); httpErr != nil {
		httpErr(w, r)
		return
	}
	if _, err := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	}); err != nil {
		httpx.NewNotFoundError(404, "Supply not found", "Supply")(w, r)
		return
	}
	err := q.DB.UpdateSupply(r.Context(), db.UpdateSupplyParams{
		ID:              supplyId,
		SupplyType:      supplyReqbody.SupplyType,
		Name:            supplyReqbody.Name,
		Nickname:        supplyReqbody.Nickname,
		MeasurementUnit: supplyReqbody.MeasurementUnit,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.NewExistError(409, "Supply already exist", "Supply")(w, r)
			return
		}
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	w.WriteHeader(204)

}

func (q suppliesQueries) createSupply(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	supplyReqBody := struct {
		SupplyType      string  `json:"supplyType" validate:"required,supplyTypeVal"`
		Nickname        *string `json:"nickname"`
		Name            string  `json:"name" validate:"required"`
		MeasurementUnit string  `json:"measurementUnit" validate:"required,measurementUnitsVal"`
	}{}
	if err := httpx.DecodeAndValidate(r, &supplyReqBody); err != nil {
		err(w, r)
		return
	}
	supply, err := q.DB.CreateSupplies(r.Context(), db.CreateSuppliesParams{
		SupplyType:      supplyReqBody.SupplyType,
		Nickname:        supplyReqBody.Nickname,
		Name:            supplyReqBody.Name,
		MeasurementUnit: supplyReqBody.MeasurementUnit,
		FarmID:          *user.FarmID,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.NewExistError(409, "Supply already exist", "Supply")(w, r)
			return
		}
		httpx.NewDBError(err.Error())(w, r)
		return
	}
	data, err := json.Marshal(toSupplyResponse(supply))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
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

	supply, err := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Supply dont exist", "Supply")(w, r)
		return
	}

	supplyEnc, err := json.Marshal(toSupplyResponse(supply))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(200)
	w.Write(supplyEnc)

}

func (q suppliesQueries) getAllSupplies(w http.ResponseWriter, r *http.Request) {

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	supplies, err := q.DB.GetAllSupplies(r.Context(), *user.FarmID)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)

		return

	}

	suppliesResponse := []supplyResponse{}
	for _, supply := range supplies {
		suppliesResponse = append(suppliesResponse, toSupplyResponse(supply))
	}

	suppliesResponseEncoded, err := json.Marshal(suppliesResponse)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
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

	_, err := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Supply dont exists", "Supply")(w, r)
		return
	}

	err = q.DB.DeleteSupply(r.Context(), db.DeleteSupplyParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	w.WriteHeader(204)

}
