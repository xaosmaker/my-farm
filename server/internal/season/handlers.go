package season

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

//TODO: need to make a validation to not add or edit data on finished season
// on finished season WE CAN ADD NOTHING!

func (q seasonsQueries) getAllActiveSeasons(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	seasons, err := q.DB.GetALLActiveSeasons(r.Context(), *user.FarmID)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
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

	seasonReqBoby := struct {
		Name         *string  `json:"name" validate:"omitnil,alphanumspace"`
		StartSeason  *string  `json:"startSeason" validate:"omitnil,isTimestamptz"`
		FinishSeason *string  `json:"finishSeason" validate:"omitnil,isTimestamptz"`
		Crop         *int64   `json:"crop" validate:"omitnil,number"`
		AreaInMeters *float64 `json:"areaInMeters" validate:"omitnil,number"`
	}{}

	if httpErr := httpx.DecodeAndValidate(r, &seasonReqBoby); httpErr != nil {
		httpErr(w, r)
		return
	}

	// check if season exist for the user
	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)
		return
	}

	season, err := q.DB.GetSeasonById(r.Context(), seasonId)
	if err != nil {
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)
		return
	}

	// check if the season is finised
	if season.FinishSeason != nil {
		/*
			if the season is finished we can not modify it
		*/
		httpx.ServerError(400, httpx.NewErrMessage("Cannot Edit season when a season is finished", apperror.SEASON_FINISH_ERROR, nil))(w, r)
		return
	}

	if seasonReqBoby.StartSeason != nil {
		/*
			here we check if the season start correct after the previous seasn
			and before the first job
		*/

		reqStartSeason := *util.UnsafeStrToTimeConverter(seasonReqBoby.StartSeason)

		// check if season start before previous season
		if startSeasonError := q.checkIfSeasonStartIsAfterPrevSeason(r, season.FieldID, reqStartSeason); startSeasonError != nil {
			startSeasonError(w, r)
			return
		}

		// check if season start before a job
		if startSeasonError := q.checkIfSeasonStartIsBeforeFirstJob(r, seasonId, reqStartSeason); startSeasonError != nil {
			startSeasonError(w, r)
			return
		}
	}

	// here we check if the finishSeason date in > the last job
	// then finish season can't be lower than the last job
	if seasonReqBoby.FinishSeason != nil {
		/*
			here we check if the finish season is finish after the start of season
			and finish after the last job
		*/

		reqFinishSeasonTime := *util.UnsafeStrToTimeConverter(seasonReqBoby.FinishSeason)

		if finishSeasonError := q.checkIfFinishSeasonIsAfterLastJob(r, seasonId, reqFinishSeasonTime); finishSeasonError != nil {
			finishSeasonError(w, r)
			return
		}

		startSeason := season.StartSeason
		if seasonReqBoby.StartSeason != nil {
			startSeason = *util.UnsafeStrToTimeConverter(seasonReqBoby.StartSeason)
		}
		if startSeason.After(reqFinishSeasonTime) {
			httpx.ServerError(400, httpx.NewErrMessage(fmt.Sprintf("The Date to finish season must be greater of the last job: greater Than %v", startSeason.Format(time.RFC3339)),
				apperror.INVALID_SEASON_FINISH_DATE, httpx.Meta{"date": startSeason.Format(time.RFC3339), "dateLimit": "greater"},
			))(w, r)
			return
		}
	}

	if seasonReqBoby.AreaInMeters != nil {
		// change the area to m2
		*seasonReqBoby.AreaInMeters = *seasonReqBoby.AreaInMeters * float64(util.UnitConverter(user.LandUnit))

		//the diff here is how is grow or shring the field and check only is this available area exist or not
		changeAreaDif := *seasonReqBoby.AreaInMeters - season.AreaInMeters

		if seasonAreaError := q.checkIfSeasonAreaIsLowerOrEqualToFieldArea(r, season.FieldID, changeAreaDif, user.LandUnit); seasonAreaError != nil {
			seasonAreaError(w, r)
			return
		}
	}

	err = q.DB.UpdateSeason(r.Context(), db.UpdateSeasonParams{
		ID:           seasonId,
		Name:         seasonReqBoby.Name,
		Crop:         seasonReqBoby.Crop,
		AreaInMeters: seasonReqBoby.AreaInMeters,
		StartSeason:  util.UnsafeStrToTimeConverter(seasonReqBoby.StartSeason),
		FinishSeason: util.UnsafeStrToTimeConverter(seasonReqBoby.FinishSeason),
	})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}
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

	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)
		return
	}
	if season, _ := q.DB.GetSeasonById(r.Context(), seasonId); season.FinishSeason != nil {
		httpx.ServerError(400, httpx.NewErrMessage("Cannot delete season when a season is finished", apperror.SEASON_FINISH_ERROR, nil))(w, r)
		return

	}

	err := q.DB.DeleteSeason(r.Context(), seasonId)
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
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
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)
		return
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: season.FieldID,
		UserID:  user.ID,
	})
	if err != nil {
		httpx.NewNotFoundError(404, "Season not found", "Season")(w, r)
		return
	}
	data, err := json.Marshal(toSeasonDetailResponse(season, user.LandUnit))
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(data)
}

func (q seasonsQueries) createSeason(w http.ResponseWriter, r *http.Request) {

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

	seasonReqBoby := struct {
		Name         *string `json:"name" validate:"required,alphanumspace"`
		StartSeason  string  `json:"startSeason" validate:"required,isTimestamptz"`
		Crop         int64   `json:"crop" validate:"required,number"`
		AreaInMeters float64 `json:"areaInMeters" validate:"required,number"`
	}{}

	if httpErr := httpx.DecodeAndValidate(r, &seasonReqBoby); httpErr != nil {
		httpErr(w, r)
		return

	}

	_, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})

	if err != nil {
		httpx.NewNotFoundError(404, "Field not found", "Field")(w, r)
		return
	}

	if seasonStartError := q.checkIfSeasonStartIsAfterPrevSeason(r, fieldId, *util.UnsafeStrToTimeConverter(&seasonReqBoby.StartSeason)); seasonStartError != nil {
		seasonStartError(w, r)
		return
	}

	// convert to m2 where we save our data
	seasonReqBoby.AreaInMeters = seasonReqBoby.AreaInMeters * float64(util.UnitConverter(user.LandUnit))
	// if you want to start a season or add more meter you cant
	if seasonAreaError := q.checkIfSeasonAreaIsLowerOrEqualToFieldArea(r, fieldId, seasonReqBoby.AreaInMeters, user.LandUnit); seasonAreaError != nil {
		seasonAreaError(w, r)
		return
	}

	_, err = q.DB.CreateSeason(r.Context(), db.CreateSeasonParams{
		Name:         seasonReqBoby.Name,
		FieldID:      fieldId,
		Crop:         seasonReqBoby.Crop,
		AreaInMeters: seasonReqBoby.AreaInMeters,
		StartSeason:  *util.UnsafeStrToTimeConverter(&seasonReqBoby.StartSeason),
	})
	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
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
		httpx.NewNotFoundError(404, "Field does not exist", "Field")(w, r)
		return
	}

	seasons, _ := q.DB.GetSeasonsByFieldId(r.Context(), fieldId)

	seasonsSlice := make([]seasonResponse, 0, len(seasons))

	for _, season := range seasons {
		seasonsSlice = append(seasonsSlice, toSeasonResponse(season, user.LandUnit))
	}

	seasonsEncoded, err := json.Marshal(seasonsSlice)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
	}

	w.WriteHeader(200)
	w.Write(seasonsEncoded)

}
