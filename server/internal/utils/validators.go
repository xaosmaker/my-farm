package utils

import (
	"reflect"
	"slices"

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
