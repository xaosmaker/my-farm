package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenType string

const (
	TokenTypeAccess TokenType = "ai-farm-access"
)

var jwtKey string = os.Getenv("JWT_KEY")

func MakeJwt(userID, singingKey string, expiresIn time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    string(TokenTypeAccess),
		IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
		ExpiresAt: jwt.NewNumericDate(time.Now().UTC().Add(expiresIn)),
		Subject:   userID,
	})
	return token.SignedString([]byte(singingKey))
}

func ValidateJwt(tokenString string) (string, error) {
	claims := jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (any, error) {
		// since we only use the one private key to sign the tokens,
		// we also only use its public counter part to verify
		return []byte(jwtKey), nil
	})

	if err != nil {
		return "", err
	}

	id, err := token.Claims.GetSubject()
	if err != nil {
		return "", err
	}

	return id, nil
}
