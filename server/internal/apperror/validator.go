package apperror

import (
	"reflect"
	"slices"
	"strconv"
	"time"
	"unicode"

	"github.com/go-playground/validator/v10"
	"github.com/xaosmaker/server/internal/apptypes"
)

func isoTimestamptzValidator(sl validator.FieldLevel) bool {
	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}

	_, err := time.Parse(time.RFC3339, current.String())
	if err != nil {
		return false
	}

	return true

}

func measurementUnitsValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(apptypes.MeasurementUnits(), s)

}

func landUnitValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(apptypes.LandMeasurementUnit(), s)

}

func supplyTypeValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(apptypes.SuppliesTypes(), s)

}

func jobTypeValidator(sl validator.FieldLevel) bool {

	current := sl.Field()
	if current.Kind() == reflect.Pointer {
		current = current.Elem()
	}
	s := current.String()

	return slices.Contains(apptypes.JobTypes(), s)
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
