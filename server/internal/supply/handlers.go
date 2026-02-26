package supply

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q suppliesQueries) updateSupply(w http.ResponseWriter, r *http.Request) error {
	supplyId, err := httpx.GetPathValToInt(r, "supplyId")

	if err != nil {
		return err
	}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	supplyReqbody := struct {
		SupplyType      *string `json:"supplyType" validate:"omitnil,supplyTypeVal"`
		Nickname        *string `json:"nickname"`
		Name            *string `json:"name" validate:"omitnil"`
		MeasurementUnit *string `json:"measurementUnit" validate:"omitnil,measurementUnitsVal"`
	}{}

	if err := httpx.DecodeAndVal(r, &supplyReqbody); err != nil {
		return err
	}
	if _, err := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	}); err != nil {

		return apperror.New404NotFoundError("Supply not found", "Supply", err)
	}

	err = q.DB.UpdateSupply(r.Context(), db.UpdateSupplyParams{
		ID:              supplyId,
		SupplyType:      supplyReqbody.SupplyType,
		Name:            supplyReqbody.Name,
		Nickname:        supplyReqbody.Nickname,
		MeasurementUnit: supplyReqbody.MeasurementUnit,
	})

	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			return apperror.New409ExistError("Supply already exist", "Supply", err)
		}
		return apperror.New503DBError("DB errror", err)
	}

	return httpx.WriteJSON(w, 204, nil)

}

func (q suppliesQueries) createSupply(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	supplyReqBody := struct {
		SupplyType      string  `json:"supplyType" validate:"required,supplyTypeVal"`
		Nickname        *string `json:"nickname"`
		Name            string  `json:"name" validate:"required"`
		MeasurementUnit string  `json:"measurementUnit" validate:"required,measurementUnitsVal"`
	}{}
	if err := httpx.DecodeAndVal(r, &supplyReqBody); err != nil {
		return err
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
			return apperror.New409ExistError("Supply already exist", "Supply", err)
		}
		return apperror.New503DBError("DB Error", err)
	}

	return httpx.WriteJSON(w, 201, toSupplyResponse(supply))
}

func (q suppliesQueries) getSupplyDetails(w http.ResponseWriter, r *http.Request) error {

	supplyId, err := httpx.GetPathValToInt(r, "supplyId")
	if err != nil {
		return err
	}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	fmt.Println("Here")

	supply, err := q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		return apperror.New404NotFoundError("Supply dont exist", "Supply", err)
	}
	return httpx.WriteJSON(w, 200, toSupplyResponse(supply))
}

func (q suppliesQueries) getAllSupplies(w http.ResponseWriter, r *http.Request) error {

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	supplies, err := q.DB.GetAllSupplies(r.Context(), *user.FarmID)
	if err != nil {
		return apperror.New503DBError("DB error", err)

	}

	suppliesResponse := []supplyResponse{}
	for _, supply := range supplies {
		suppliesResponse = append(suppliesResponse, toSupplyResponse(supply))
	}

	return httpx.WriteJSON(w, 200, suppliesResponse)

}
func (q suppliesQueries) deleteSupply(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	supplyId, err := httpx.GetPathValToInt(r, "supplyId")
	if err != nil {
		return err
	}

	_, err = q.DB.GetSupplyDetails(r.Context(), db.GetSupplyDetailsParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})

	if err != nil {
		return apperror.New404NotFoundError("Supply dont exists", "Supply", err)
	}

	err = q.DB.DeleteSupply(r.Context(), db.DeleteSupplyParams{
		FarmID: *user.FarmID,
		ID:     supplyId,
	})
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}

	return httpx.WriteJSON(w, 204, nil)

}
