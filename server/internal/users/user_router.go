package users

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/users/handlers"
)

func UserMux(conn *pgxpool.Pool) *http.ServeMux {
	q := users_handlers.UserQueries{
		DB: db.New(conn),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /users/login/", q.LoginUser)
	mux.HandleFunc("/", er.FieldErrors(400, nil))

	return mux
}
