package utils

import (
	"reflect"
	"slices"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func jobTypeValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(JobTypes(), s)
}

func alphaNumSpacesGreek(sl validator.FieldLevel) bool {
	for _, letter := range sl.Field().String() {
		if unicode.IsLetter(letter) || unicode.IsDigit(letter) || unicode.IsSpace(letter) {
			continue
		}
		return false
	}
	return true

}
