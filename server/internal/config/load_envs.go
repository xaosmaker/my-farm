package config

import (
	"log"
	"os"
)

func CheckEnvs() {
	_, ok := os.LookupEnv("JWT_KEY")

	if !ok {
		log.Fatal("JWT_KEY enviroment variable is not set")
	}
	_, ok = os.LookupEnv("DB_URL")
	if !ok {
		log.Fatal("DB_URL enviroment variable is not set")
	}

}
