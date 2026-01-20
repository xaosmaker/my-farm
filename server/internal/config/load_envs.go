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
	_, ok = os.LookupEnv("NEXTAUTH_URL")
	if !ok {
		log.Fatal("NEXTAUTH_URL enviroment variable is not set")
	}

	_, ok = os.LookupEnv("EMAIL_HOST")
	if !ok {
		log.Fatal("EMAIL_HOST enviroment variable is not set")
	}

	_, ok = os.LookupEnv("EMAIL_PORT")
	if !ok {
		log.Fatal("EMAIL_PORT enviroment variable is not set")
	}

	_, ok = os.LookupEnv("EMAIL_HOST_USER")
	if !ok {
		log.Fatal("EMAIL_HOST_USER enviroment variable is not set")
	}

	_, ok = os.LookupEnv("EMAIL_HOST_PASSWORD")
	if !ok {
		log.Fatal("EMAIL_HOST_PASSWORD enviroment variable is not set")
	}

	_, ok = os.LookupEnv("EMAIL_VERIFY_KEY")
	if !ok {
		log.Fatal("EMAIL_VERIFY_KEY enviroment variable is not set")
	}

}
