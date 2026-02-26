package season

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q seasonsQueries) getSeasonStatictic(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}
	seasonId, err := httpx.GetPathValToInt(r, "seasonId")
	if err != nil {
		return err
	}
	if s, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || s != *user.FarmID {
		return apperror.New404NotFoundError("Season not found", "Season", err)
	}

	stats, err := q.DB.GetSeasonStatistics(r.Context(), seasonId)
	if err != nil {
		return apperror.New404NotFoundError("Statistics not found", "Statistics", err)
	}
	data := make([]seasonStatisticsResponse, 0, len(stats))
	for _, s := range stats {
		if s.HarvestQuantity > 0 {
			s.TotalQuantity -= s.HarvestQuantity
		}
		data = append(data, toSeasonStatisticsResponse(s))
	}
	return httpx.WriteJSON(w, 200, data)

}
