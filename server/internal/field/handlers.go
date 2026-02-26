package field

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

func (q fieldQueries) updateField(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	id, err := httpx.GetPathValToInt(r, "id")
	if err != nil {
		return err
	}
	//  validate the field exist for the current user
	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})
	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", nil)
	}

	fieldReqBody := struct {
		Name             *string          `json:"name" validate:"omitnil,alphanumspace"`
		Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"omitnil"`
		Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"omitnil"`
		AreaInMeters     *float64         `json:"areaInMeters" validate:"omitnil,number"`
		MapLocation      *json.RawMessage `json:"mapLocation" validate:"omitnil"`
		FieldLocation    *string          `json:"fieldLocation" validate:"omitnil,alphanumspace"`
		IsOwned          *bool            `json:"isOwned" validate:"omitnil,boolean"`
	}{}

	if err := httpx.DecodeAndVal(r, &fieldReqBody); err != nil {
		return err
	}

	if fieldReqBody.AreaInMeters != nil {
		*fieldReqBody.AreaInMeters *= float64(util.UnitConverter(user.LandUnit))
	}

	fieldBody := db.UpdateFieldParams{
		ID:               id,
		Name:             fieldReqBody.Name,
		Epsg2100Boundary: fieldReqBody.Epsg2100Boundary,
		Epsg4326Boundary: fieldReqBody.Epsg4326Boundary,
		AreaInMeters:     fieldReqBody.AreaInMeters,
		FieldLocation:    fieldReqBody.FieldLocation,
		MapLocation:      fieldReqBody.MapLocation,
		IsOwned:          fieldReqBody.IsOwned,
	}

	field, err := q.DB.UpdateField(r.Context(), fieldBody)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			return apperror.New409ExistError("Field already exist", "Field", err)
		}

		return apperror.New503DBError("DB error", err)
	}

	return httpx.WriteJSON(w, 200, toFieldResponse(field, user.LandUnit))
}

func (q fieldQueries) createField(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	fieldReqBody := struct {
		Name             string           `json:"name" validate:"required,alphanumspace"`
		Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary" validate:"excluded_if=fieldEpsg210Boundary []"`
		Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary" validate:"excluded_if=fieldEpsg4326Boundary []"`
		MapLocation      *json.RawMessage `json:"mapLocation" validate:"excluded_if=mapLocation []"`
		FieldLocation    *string          `json:"fieldLocation" validate:"alphanumspace"`
		AreaInMeters     float64          `json:"areaInMeters" validate:"required,number"`
		IsOwned          bool             `json:"isOwned" validate:"boolean"`
	}{}

	if err := httpx.DecodeAndVal(r, &fieldReqBody); err != nil {
		return err
	}

	fieldData := db.CreateFieldParams{
		Name:             fieldReqBody.Name,
		Epsg2100Boundary: fieldReqBody.Epsg2100Boundary,
		Epsg4326Boundary: fieldReqBody.Epsg4326Boundary,
		AreaInMeters:     fieldReqBody.AreaInMeters * float64(util.UnitConverter(user.LandUnit)),
		MapLocation:      fieldReqBody.MapLocation,
		FieldLocation:    fieldReqBody.FieldLocation,
		FarmID:           *user.FarmID,
		IsOwned:          fieldReqBody.IsOwned,
	}

	field, err := q.DB.CreateField(r.Context(), fieldData)
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			return apperror.New409ExistError("Field already exist", "Field", err)
		}

		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 201, toFieldResponse(field, user.LandUnit))

}

func (q fieldQueries) deleteField(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	id, err := httpx.GetPathValToInt(r, "id")
	if err != nil {
		return err
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})
	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", err)
	}

	err = q.DB.DeleteField(r.Context(), id)
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 204, nil)

}

func (q fieldQueries) getFieldById(w http.ResponseWriter, r *http.Request) error {
	id, err := httpx.GetPathValToInt(r, "id")
	if err != nil {
		return err
	}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	data, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: id,
		UserID:  user.ID,
	})

	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", err)
	}

	return httpx.WriteJSON(w, 200, toFieldResponse(data, user.LandUnit))

}

func (q fieldQueries) getAllFields(w http.ResponseWriter, r *http.Request) error {

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	data, err := q.DB.GetAllFields(r.Context(), user.ID)
	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", err)

	}

	listData := []fieldResponse{}
	for _, field := range data {
		listData = append(listData, toFieldResponse(field, user.LandUnit))
	}

	return httpx.WriteJSON(w, 200, listData)

}
