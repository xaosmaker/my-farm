package seasons

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/httpx"
)

func (q seasonsQueries) getSeasonStatictic(w http.ResponseWriter, r *http.Request) {
	user, httpErr := httpx.GetUserFromContext(r)
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	seasonId, httpErr := httpx.GetPathValueToInt64(r, "seasonId")
	if httpErr != nil {
		httpErr(w, r)
		return
	}
	if s, err := q.DB.GetFarmIdFromSeasonId(r.Context(), seasonId); err != nil || s != *user.FarmID {
		httpx.GeneralError(404, "Season not found")(w, r)
		return
	}
	stats, err := q.DB.GetSeasonStatistics(r.Context(), seasonId)
	if err != nil {
		httpx.GeneralError(404, "No available stats")
		return
	}
	data := make([]seasonStatisticsResponse, 0, len(stats))
	for _, s := range stats {
		if s.HarvestQuantity > 0 {
			s.TotalQuantity -= s.HarvestQuantity
		}
		data = append(data, toSeasonStatisticsResponse(s))
	}
	dataEnc, err := json.Marshal(data)
	if err != nil {
		httpx.GeneralError(500, "No available stats")
		return
	}
	w.WriteHeader(200)
	w.Write(dataEnc)

}
