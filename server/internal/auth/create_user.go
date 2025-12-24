package auth

import (
	"fmt"
	"net/http"

	"github.com/xaosmaker/server/internal/db"
)

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) {
	password, _ := HashPassword("xaos")
	user, _ := q.DB.CreateUser(r.Context(), db.CreateUserParams{
		Email:    "xaos@xaos.com",
		Password: password,
	})
	fmt.Println(password, user)
	w.WriteHeader(700)

}
