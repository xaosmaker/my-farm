package season

import (
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

func (q seasonsQueries) getAllActiveSeasons(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	seasons, err := q.DB.GetALLActiveSeasons(r.Context(), *user.FarmID)
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}

	seasonRes := make([]seasonResponse, 0, len(seasons))
	for _, s := range seasons {
		seasonRes = append(seasonRes, toAllSeasonResponse(s, user.LandUnit))
	}
	return httpx.WriteJSON(w, 200, seasonRes)
}

func (q seasonsQueries) updateSeason(w http.ResponseWriter, r *http.Request) error {
	seasonId, err := httpx.GetPathValToInt(r, "seasonId")
	if err != nil {
		return err
	}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	seasonReqBoby := struct {
		Name         *string  `json:"name" validate:"omitnil,alphanumspace"`
		StartSeason  *string  `json:"startSeason" validate:"omitnil,isTimestamptz"`
		FinishSeason *string  `json:"finishSeason" validate:"omitnil,isTimestamptz"`
		Crop         *int64   `json:"crop" validate:"omitnil,number"`
		AreaInMeters *float64 `json:"areaInMeters" validate:"omitnil,number"`
	}{}

	if err := httpx.DecodeAndVal(r, &seasonReqBoby); err != nil {
		return err
	}

	// check if season exist for the user
	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	season, err := q.DB.GetSeasonById(r.Context(), seasonId)
	if err != nil {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	// check if the season is finised
	if season.FinishSeason != nil {
		/*
			if the season is finished we can not modify it
		*/
		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: "Cannot Edit season when a season is finished",
				AppCode: apperror.SEASON_FINISH_ERROR,
				Meta:    nil,
			},
		}, nil)
	}

	if seasonReqBoby.StartSeason != nil {
		/*
			here we check if the season start correct after the previous seasn
			and before the first job
		*/

		reqStartSeason := *util.UnsafeStrToTimeConverter(seasonReqBoby.StartSeason)

		// check if season start before previous season
		if err := q.checkIfSeasonStartIsAfterPrevSeason(r, season.FieldID, reqStartSeason); err != nil {
			return err
		}

		// check if season start before a job
		if err := q.checkIfSeasonStartIsBeforeFirstJob(r, seasonId, reqStartSeason); err != nil {
			return err
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

		if err := q.checkIfFinishSeasonIsAfterLastJob(r, seasonId, reqFinishSeasonTime); err != nil {
			return err
		}

		startSeason := season.StartSeason
		if seasonReqBoby.StartSeason != nil {
			startSeason = *util.UnsafeStrToTimeConverter(seasonReqBoby.StartSeason)
		}
		if startSeason.After(reqFinishSeasonTime) {

			return apperror.New400Error([]apperror.ErrorMessage{{
				Message: fmt.Sprintf("The Date to finish season must be greater of the last job: greater Than %v", startSeason.Format(time.RFC3339)),
				AppCode: apperror.INVALID_SEASON_FINISH_DATE,
				Meta: apperror.Meta{
					"date":      startSeason.Format(time.RFC3339),
					"dateLimit": "greater",
				}}}, nil)
		}
	}

	if seasonReqBoby.AreaInMeters != nil {
		// change the area to m2
		*seasonReqBoby.AreaInMeters = *seasonReqBoby.AreaInMeters * float64(util.UnitConverter(user.LandUnit))

		//the diff here is how is grow or shring the field and check only is this available area exist or not
		changeAreaDif := *seasonReqBoby.AreaInMeters - season.AreaInMeters

		if err := q.checkIfSeasonAreaIsLowerOrEqualToFieldArea(r, season.FieldID, changeAreaDif, user.LandUnit); err != nil {
			return err
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
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 204, nil)
}

func (q seasonsQueries) deleteSeason(w http.ResponseWriter, r *http.Request) error {
	seasonId, err := httpx.GetPathValToInt(r, "seasonId")
	if err != nil {
		return err
	}
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	if farmId, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || farmId != *user.FarmID {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}
	if season, _ := q.DB.GetSeasonById(r.Context(), seasonId); season.FinishSeason != nil {
		return apperror.New400Error([]apperror.ErrorMessage{{
			Message: "Cannot delete season when a season is finished",
			AppCode: apperror.SEASON_FINISH_ERROR,
			Meta:    nil,
		}}, nil)

	}

	err = q.DB.DeleteSeason(r.Context(), seasonId)
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 204, nil)

}

func (q seasonsQueries) getSeasonDetails(w http.ResponseWriter, r *http.Request) error {
	seasonId, err := httpx.GetPathValToInt(r, "seasonId")
	if err != nil {
		return err
	}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	season, err := q.DB.GetSeasonById(r.Context(), seasonId)

	if err != nil {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: season.FieldID,
		UserID:  user.ID,
	})
	if err != nil {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	return httpx.WriteJSON(w, 200, toSeasonDetailResponse(season, user.LandUnit))
}

func (q seasonsQueries) createSeason(w http.ResponseWriter, r *http.Request) error {

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	fieldId, err := httpx.GetPathValToInt(r, "fieldId")
	if err != nil {
		return err
	}

	seasonReqBoby := struct {
		Name         *string `json:"name" validate:"required,alphanumspace"`
		StartSeason  string  `json:"startSeason" validate:"required,isTimestamptz"`
		Crop         int64   `json:"crop" validate:"required,number"`
		AreaInMeters float64 `json:"areaInMeters" validate:"required,number"`
	}{}

	if err := httpx.DecodeAndVal(r, &seasonReqBoby); err != nil {
		return err

	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})

	if err != nil {
		return apperror.New404NotFoundError("Field not found", "Field", err)
	}

	if err := q.checkIfSeasonStartIsAfterPrevSeason(r, fieldId, *util.UnsafeStrToTimeConverter(&seasonReqBoby.StartSeason)); err != nil {
		return err
	}

	// convert to m2 where we save our data
	seasonReqBoby.AreaInMeters = seasonReqBoby.AreaInMeters * float64(util.UnitConverter(user.LandUnit))
	// if you want to start a season or add more meter you cant
	if err := q.checkIfSeasonAreaIsLowerOrEqualToFieldArea(r, fieldId, seasonReqBoby.AreaInMeters, user.LandUnit); err != nil {
		return err
	}

	_, err = q.DB.CreateSeason(r.Context(), db.CreateSeasonParams{
		Name:         seasonReqBoby.Name,
		FieldID:      fieldId,
		Crop:         seasonReqBoby.Crop,
		AreaInMeters: seasonReqBoby.AreaInMeters,
		StartSeason:  *util.UnsafeStrToTimeConverter(&seasonReqBoby.StartSeason),
	})
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 201, nil)

}

func (q seasonsQueries) getAllSeasons(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	fieldId, err := httpx.GetPathValToInt(r, "fieldId")
	if err != nil {
		return err
	}
	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: fieldId,
		UserID:  user.ID,
	})
	if err != nil {
		return apperror.New404NotFoundError("Field does not exist", "Field", err)
	}

	seasons, _ := q.DB.GetSeasonsByFieldId(r.Context(), fieldId)

	seasonsSlice := make([]seasonResponse, 0, len(seasons))

	for _, season := range seasons {
		seasonsSlice = append(seasonsSlice, toSeasonResponse(season, user.LandUnit))
	}

	return httpx.WriteJSON(w, 200, seasonsSlice)

}
