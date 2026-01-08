package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDb(ctx context.Context) *pgxpool.Pool {
	env := os.Getenv("DB_URL")
	if env == "" {
		log.Fatal("DB_URL enviroment variable is not set")
	}

	dbTries := 0
	for {

		dbTries++
		pool, err := pgxpool.New(ctx, env)
		if err != nil {
			log.Fatal("Cannot Create db pool:", err)
		}
		err = pool.Ping(ctx)
		if err == nil {
			fmt.Println("Connection Established to DB")
			return pool
		}

		if dbTries >= 10 {
			log.Fatalf("Cannot connect to db after: %vs error: %v", dbTries*5, err)
		}
		fmt.Println("Trying to Connect to DB")
		time.Sleep(time.Second * 5)
	}

}
