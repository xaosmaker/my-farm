package farm

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q farmQeuries) createFarm(w http.ResponseWriter, r *http.Request) error {

	farmFields := struct {
		Name string `json:"name" validate:"required,alphanumspace"`
	}{}

	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	if err := httpx.DecodeAndVal(r, &farmFields); err != nil {
		return err
	}

	_, err = q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		return apperror.New409ExistError("Farm already exist", "Farm", err)
	}
	f, err := q.DB.CreateFarm(r.Context(), db.CreateFarmParams{Name: farmFields.Name, ID: user.ID})
	if err != nil {
		return apperror.New503DBError("DB error", err)
	}

	return httpx.WriteJSON(w, 201, toFarmResponse(db.Farm(f)))

}

func (q farmQeuries) getFarm(w http.ResponseWriter, r *http.Request) error {
	user, err := httpx.GetUserFromCtx(r)
	if err != nil {
		return err
	}

	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err != nil {
		//this code never run it is validated in the middleware
		return apperror.New404NotFoundError("Farm not found", "Farm", err)
	}

	return httpx.WriteJSON(w, 200, toFarmResponse(farm))
}
