package httpx

import (
	"fmt"
	"reflect"
	"slices"
	"strconv"
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func isoTimestamptzValidator(sl validator.FieldLevel) bool {
	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}

	cu := current.Interface().(string)
	fmt.Println(current, cu)
	return false

}

func measurementUnitsValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(MeasurementUnits(), s)

}

func supplyTypeValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(SuppliesTypes(), s)

}

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

func strongPassword(sl validator.FieldLevel) bool {
	field := sl.Field().String()
	length, err := strconv.ParseInt(sl.Param(), 10, 64)
	if err != nil {
		return false
	}

	hasUpper := false
	hasDigit := false
	hasLength := len(field)
	if hasLength < int(length) {
		return false
	}
	if !strings.ContainsAny(field, "@$!") {
		return false

	}

	for _, letter := range field {
		if unicode.IsLetter(letter) || unicode.IsDigit(letter) {
			if unicode.IsUpper(letter) {
				hasUpper = true
			} else if unicode.IsDigit(letter) {
				hasDigit = true

			}

		}

	}
	return hasUpper && hasDigit
}
