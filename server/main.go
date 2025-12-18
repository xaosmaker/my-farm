package main

import (
	"context"
	"fmt"
	"log"

	"github.com/xaosmaker/server/internal/db"
)

func main() {
	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	defer conn.Close()

	Q := db.New(conn)

	user, err := Q.GetAllUsers(ctx)
	if err != nil {
		log.Fatal(err)

	}
	us := user[0]
	us.Password = "****"
	fmt.Println(us, 12)

	fmt.Println("hello from server")
}
