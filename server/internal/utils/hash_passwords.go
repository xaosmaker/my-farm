package utils

import (
	"fmt"

	"github.com/alexedwards/argon2id"
)

func ComparePassword(hash, pass string) bool {
	match, _, err := argon2id.CheckHash(pass, hash)
	if err != nil {
		fmt.Printf("Error Hashing the password %v\n", err)
		return false
	}
	return match
}

func HashPassword(password string) (string, error) {
	pass, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		return "", err
	}
	return pass, nil
}
