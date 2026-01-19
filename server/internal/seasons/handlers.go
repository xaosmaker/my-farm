package seasons

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/utils"
)

//TODO: need to make a validation to not add or edit data on finished season
// on finished season WE CAN ADD NOTHING!

func (q seasonsQueries) getAllActiveSeasons(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
	}
	seasons, err := q.DB.GetALLActiveSeasons(r.Context(), *user.FarmID)
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
	}
	seasonRes := make([]seasonResponse, 0, len(seasons))
	for _, s := range seasons {
		seasonRes = append(seasonRes, toAllSeasonResponse(s, user.LandUnit))
	}
	data, err := json.Marshal(seasonRes)
	w.WriteHeader(200)
	w.Write(data)
}

func (q seasonsQueries) updateSeason(w http.ResponseWriter, r *http.Request) {
	type seasonRequest struct {
		Name         *string  `json:"name" validate:"omitnil,alphanumspace"`
		StartSeason  *string  `json:"startSeason" validate:"omitnil,isTimestamptz"`
		FinishSeason *string  `json:"finishSeason" validate:"omitnil,isTimestamptz"`
		Crop         *int64   `json:"crop" validate:"omitnil,number"`
		AreaInMeters *float64 `json:"areaInMeters" validate:"omitnil,number"`
	}

	seasonId, httpErr := httpx.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	seasonBoby := seasonRequest{}
	if httpErr := httpx.DecodeAndValidate(r, &seasonBoby); httpErr != nil {
		httpErr(w, r)
		return
	}
	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		httpx.GeneralError(404, "resourse not found")(w, r)
		return
	}

	season, err := q.DB.GetSeasonById(r.Context(), seasonId)
	if err != nil {
		httpx.GeneralError(404, "resourse not found")(w, r)
		return
	}

	// here we check if the finishSeason date in > the last job
	// then finish season can't be lower than the last job
	if seasonBoby.FinishSeason != nil {
		finishSeasonTime := *utils.UnsafeStrToTimeConverter(seasonBoby.FinishSeason)
		lastJob, _ := q.DB.GetLastJobBySeasonId(r.Context(), seasonId)
		if lastJob.JobDate.After(finishSeasonTime) {
			httpx.GeneralError(400, fmt.Sprintf("The Date to finish season must be greater of the last job: greater Than %v", lastJob.JobDate))(w, r)
			return
		}
	}
	// hehe we check if the startSeason < the first job
	// the startSeason can't be greater than the first job
	if seasonBoby.StartSeason != nil {
		startSeason := *utils.UnsafeStrToTimeConverter(seasonBoby.StartSeason)
		firstJob, err := q.DB.GetFirstJobBySeasonId(r.Context(), seasonId)
		if err == nil && firstJob.JobDate.Before(startSeason) {
			httpx.GeneralError(400, fmt.Sprintf("The Date to start season must be lower of the first job: lower Than %v", firstJob.JobDate))(w, r)
			return

		}
	}

	if season.FinishSeason != nil {
		httpx.GeneralError(400, "Cannot Edit season when a season is finished")(w, r)
		return
	}

	if seasonBoby.AreaInMeters != nil {
		*seasonBoby.AreaInMeters = *seasonBoby.AreaInMeters * float64(httpx.UnitConverter(user.LandUnit))
		if *seasonBoby.AreaInMeters > season.AreaInMeters {
			dif := *seasonBoby.AreaInMeters - season.AreaInMeters
			if val, _ := q.DB.GetRemainingAreaOfFieldForSeason(r.Context(), season.FieldID); val < dif {
				httpx.GeneralError(400, fmt.Sprintf("No area to cultivate, remaining area: %.2f", val/float64(httpx.UnitConverter(user.LandUnit))))(w, r)
				return
			}
		}
	}

	err = q.DB.UpdateSeason(r.Context(), db.UpdateSeasonParams{
		ID:           seasonId,
		Name:         seasonBoby.Name,
		Crop:         seasonBoby.Crop,
		AreaInMeters: seasonBoby.AreaInMeters,
		StartSeason:  utils.UnsafeStrToTimeConverter(seasonBoby.StartSeason),
		FinishSeason: utils.UnsafeStrToTimeConverter(seasonBoby.FinishSeason),
	})
	w.WriteHeader(204)

}

func (q seasonsQueries) deleteSeason(w http.ResponseWriter, r *http.Request) {
	seasonId, httpErr := httpx.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil && farmId != *user.FarmID {
		httpx.GeneralError(404, "Resourse not found")(w, r)
		return
	}
	if season, _ := q.DB.GetSeasonById(r.Context(), seasonId); season.FinishSeason != nil {
		httpx.GeneralError(400, "Can't delete a finished season")(w, r)
		return

	}

	err := q.DB.DeleteSeason(r.Context(), seasonId)
	if err != nil {
		httpx.GeneralError(404, err.Error())(w, r)
		return
	}
	w.WriteHeader(204)

}

func (q seasonsQueries) getSeasonDetails(w http.ResponseWriter, r *http.Request) {
	seasonId, httpErr := httpx.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	season, err := q.DB.GetSeasonById(r.Context(), seasonId)

	if err != nil {
		httpx.GeneralError(404, "Resourse Not Found")(w, r)
		return
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: season.FieldID,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(404, "Resourse Not Found")(w, r)
		return
	}
	data, _ := json.Marshal(toSeasonDetailResponse(season, user.LandUnit))
	w.WriteHeader(200)
	w.Write(data)
}

func (q seasonsQueries) createSeason(w http.ResponseWriter, r *http.Request) {
	type seasonRequest struct {
		Name         *string `json:"name" validate:"required,alphanumspace"`
		StartSeason  string  `json:"startSeason" validate:"required,isTimestamptz"`
		Crop         int64   `json:"crop" validate:"required,number"`
		AreaInMeters float64 `json:"areaInMeters" validate:"required,number"`
	}
	seasonBoby := seasonRequest{}
	if httpErr := httpx.DecodeAndValidate(r, &seasonBoby); httpErr != nil {
		httpErr(w, r)
		return

	}
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	seasonBoby.AreaInMeters = seasonBoby.AreaInMeters * float64(httpx.UnitConverter(user.LandUnit))
	fieldId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "Field doent exist")(w, r)
		return
	}
	if val, _ := q.DB.GetRemainingAreaOfFieldForSeason(r.Context(), fieldId); val < seasonBoby.AreaInMeters {
		httpx.GeneralError(400, fmt.Sprintf("No area to cultivate, remaining area: %.2f", val/float64(httpx.UnitConverter(user.LandUnit))))(w, r)
		return
	}
	_, err = q.DB.CreateSeason(r.Context(), db.CreateSeasonParams{
		Name:         seasonBoby.Name,
		FieldID:      fieldId,
		Crop:         seasonBoby.Crop,
		AreaInMeters: seasonBoby.AreaInMeters,
		StartSeason:  *utils.UnsafeStrToTimeConverter(&seasonBoby.StartSeason),
	})
	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
	}
	w.WriteHeader(201)

}

func (q seasonsQueries) getAllSeasons(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	fieldId, httpErr := httpx.GetPathValueToInt64(r, "fieldId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.GeneralError(400, "Field doent exist")(w, r)
		return
	}
	seasons, _ := q.DB.GetSeasonsByFieldId(r.Context(), fieldId)
	seasonsSlice := []seasonResponse{}
	for _, season := range seasons {
		seasonsSlice = append(seasonsSlice, toSeasonResponse(season, user.LandUnit))

	}
	seasonsEncoded, err := json.Marshal(seasonsSlice)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(seasonsEncoded)

}
