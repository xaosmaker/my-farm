package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDb(ctx context.Context) *pgxpool.Pool {
	env := os.Getenv("DB_URL")
	if env == "" {
		log.Fatal("DB_URL enviroment variable is not set")
	}
	pool, err := pgxpool.New(ctx, env)
	if err != nil {
		log.Fatal("Cannot Create db pool:", err)
	}

	if err := pool.Ping(ctx); err != nil {
		log.Fatal("Cannot connect to db:", err)
	}

	return pool
}
