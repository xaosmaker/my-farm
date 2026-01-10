package seasons

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

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
		seasonsSlice = append(seasonsSlice, toSeasonResponse(season))

	}
	seasonsEncoded, err := json.Marshal(seasonsSlice)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
	}
	w.WriteHeader(200)
	w.Write(seasonsEncoded)

}
