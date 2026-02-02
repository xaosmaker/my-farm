package season

import (
	"fmt"
	"net/http"
	"time"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

/*
	checkArea is in limits

check if first job is greater than the start season
*/

func (q seasonsQueries) checkIfSeasonStartIsAfterPrevSeason(r *http.Request, fieldId int64, reqStartOfSeason time.Time) httpx.ServerErrorResponse {

	lastSeason, err := q.DB.GetLastFinishSeason(r.Context(), fieldId)
	if err == nil {
		if reqStartOfSeason.Before(*lastSeason.FinishSeason) {
			return httpx.ServerError(400, httpx.NewErrMessage(fmt.Sprintf("season can't start before the previous season!  season should start after %v", lastSeason.FinishSeason.Format(time.RFC3339)),
				apperror.INVALID_SEASON_START_DATE, httpx.Meta{"date": lastSeason.FinishSeason.Format(time.RFC3339), "dateLimit": "greater"},
			))
		}
	}
	return nil

}

func (q seasonsQueries) checkIfSeasonStartIsBeforeFirstJob(r *http.Request, seasonId int64, reqStartOfSeason time.Time) httpx.ServerErrorResponse {

	firstJob, err := q.DB.GetFirstJobBySeasonId(r.Context(), seasonId)
	// check if season start after a job thats invalid
	if err == nil && firstJob.JobDate.Before(reqStartOfSeason) {

		return httpx.ServerError(400, httpx.NewErrMessage(fmt.Sprintf("The Date to start season must be lower of the first job: lower Than %v", firstJob.JobDate.Format(time.RFC3339)),
			apperror.INVALID_SEASON_START_DATE, httpx.Meta{"date": firstJob.JobDate.Format(time.RFC3339), "dateLimit": "lower"},
		))

	}
	return nil

}

func (q seasonsQueries) checkIfSeasonAreaIsLowerOrEqualToFieldArea(r *http.Request, fieldId int64, reqAreaInM2 float64, landUnit string) httpx.ServerErrorResponse {

	remainingArea, _ := q.DB.GetRemainingAreaOfFieldForSeason(r.Context(), fieldId)
	if remainingArea < reqAreaInM2 {
		remainingAreaInUserPref := remainingArea / float64(util.UnitConverter(landUnit))

		return httpx.ServerError(400, httpx.NewErrMessage(fmt.Sprintf("No area to cultivate, remaining area: %.2f", remainingAreaInUserPref),
			apperror.INVALID_SEASON_AREA, httpx.Meta{"area": fmt.Sprintf("%.2f", remainingAreaInUserPref)}),
		)
	}
	return nil

}

func (q seasonsQueries) checkIfFinishSeasonIsAfterLastJob(r *http.Request, seasonId int64, reqFinishSeason time.Time) httpx.ServerErrorResponse {
	lastJob, _ := q.DB.GetLastJobBySeasonId(r.Context(), seasonId)
	if lastJob.JobDate.After(reqFinishSeason) {
		return httpx.ServerError(400, httpx.NewErrMessage(fmt.Sprintf("The Date to finish season must be greater of the last job: greater Than %v", lastJob.JobDate),

			apperror.INVALID_SEASON_FINISH_DATE, httpx.Meta{"date": lastJob.JobDate.Format(time.RFC3339), "dateLimit": "greater"},
		))
	}
	return nil

}
