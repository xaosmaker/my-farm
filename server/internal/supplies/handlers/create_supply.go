package handlers

import (
	"encoding/json"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
	"net/http"
	"strings"
)

func (q SuppliesQueries) CreateSupply(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(401, "login")(w, r)
		return
	}
	farm, err := q.DB.GetFarm(r.Context(), user.ID)

	if err != nil {
		er.GeneralError(400, "Create a Farm to continue")(w, r)
	}

	type supplyRequest struct {
		SupplyType      string  `json:"supplyType" validate:"required,oneof=chemicals fertilizers seeds"`
		Nickname        *string `json:"nickname"`
		Name            string  `json:"name" validate:"required"`
		MeasurementUnit string  `json:"measurementUnit" validate:"required,oneof=KG L"`
	}
	rd := supplyRequest{}
	if err := utils.DecodeAndValidate(r, &rd); err != nil {
		er.GeneralError(400, err)(w, r)
		return
	}
	supply, err := q.DB.CreateSupplies(r.Context(), db.CreateSuppliesParams{
		SupplyType:      rd.SupplyType,
		Nickname:        rd.Nickname,
		Name:            rd.Name,
		MeasurementUnit: rd.MeasurementUnit,
		FarmID:          farm.ID,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			er.GeneralError(400, "Name Already Exists")(w, r)
			return
		}
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	data, err := json.Marshal([]supplyResponse{toSupplyResponse(supply)})
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(201)
	w.Write(data)
}
