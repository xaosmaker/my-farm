package season

import (
	"fmt"
	"net/http"
	"time"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/util"
)

/*
	checkArea is in limits

check if first job is greater than the start season
*/

func (q seasonsQueries) checkIfSeasonStartIsAfterPrevSeason(r *http.Request, fieldId int64, reqStartOfSeason time.Time) error {

	lastSeason, err := q.DB.GetLastFinishSeason(r.Context(), fieldId)
	if err == nil {
		if reqStartOfSeason.Before(*lastSeason.FinishSeason) {
			return apperror.New400Error([]apperror.ErrorMessage{
				{
					Message: fmt.Sprintf("season can't start before the previous season!  season should start after %v", lastSeason.FinishSeason.Format(time.RFC3339)),
					AppCode: apperror.INVALID_SEASON_START_DATE,
					Meta: apperror.Meta{
						"date":      lastSeason.FinishSeason.Format(time.RFC3339),
						"dateLimit": "greater",
					},
				},
			}, nil)
		}
	}
	return nil

}

func (q seasonsQueries) checkIfSeasonStartIsBeforeFirstJob(r *http.Request, seasonId int64, reqStartOfSeason time.Time) error {

	firstJob, err := q.DB.GetFirstJobBySeasonId(r.Context(), seasonId)
	// check if season start after a job thats invalid
	if err == nil && firstJob.JobDate.Before(reqStartOfSeason) {

		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: fmt.Sprintf("The Date to start season must be lower of the first job: lower Than %v", firstJob.JobDate.Format(time.RFC3339)),
				AppCode: apperror.INVALID_SEASON_START_DATE,
				Meta: apperror.Meta{
					"date":      firstJob.JobDate.Format(time.RFC3339),
					"dateLimit": "lower",
				},
			},
		}, nil)
	}
	return nil

}

func (q seasonsQueries) checkIfSeasonAreaIsLowerOrEqualToFieldArea(r *http.Request, fieldId int64, reqAreaInM2 float64, landUnit string) error {

	remainingArea, _ := q.DB.GetRemainingAreaOfFieldForSeason(r.Context(), fieldId)
	if remainingArea < reqAreaInM2 {
		remainingAreaInUserPref := remainingArea / float64(util.UnitConverter(landUnit))

		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: fmt.Sprintf("No area to cultivate, remaining area: %.2f", remainingAreaInUserPref),
				AppCode: apperror.INVALID_SEASON_AREA,
				Meta: apperror.Meta{
					"area": fmt.Sprintf("%.2f", remainingAreaInUserPref),
				}}}, nil)
	}
	return nil

}

func (q seasonsQueries) checkIfFinishSeasonIsAfterLastJob(r *http.Request, seasonId int64, reqFinishSeason time.Time) error {
	lastJob, _ := q.DB.GetLastJobBySeasonId(r.Context(), seasonId)
	if lastJob.JobDate.After(reqFinishSeason) {

		return apperror.New400Error([]apperror.ErrorMessage{{
			Message: fmt.Sprintf("The Date to finish season must be greater of the last job: greater Than %v", lastJob.JobDate),

			AppCode: apperror.INVALID_SEASON_FINISH_DATE,
			Meta:    apperror.Meta{"date": lastJob.JobDate.Format(time.RFC3339), "dateLimit": "greater"},
		}}, nil)
	}
	return nil

}
