package utils

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"net/http"
	"reflect"
	"strings"
)

type FieldErrors map[string]string

func formatValidator(f validator.FieldError) string {
	switch strings.ToLower(f.Tag()) {

	case "required":
		return fmt.Sprintf("%v is Required!", f.Field())
	case "min":
		return fmt.Sprintf("%v length should be greater than %v", f.Field(), f.Param())
	case "max":
		return fmt.Sprintf("%v length cant exceed %v", f.Field(), f.Param())
	case "email":
		return "Please provide a valid email"
	case "alphanumspace":
		return fmt.Sprintf("%v should contain only chars spaces and number", f.Field())
	case "oneof":
		return fmt.Sprintf("%v should contain one of '%v'", f.Field(), f.Param())
	default:
		return fmt.Sprintf("format Validator uknown format %v", f.Error())
	}

}

func getFieldJsonTag(s any, field string) string {

	t := reflect.TypeOf(s)

	if t.Kind() == reflect.Pointer {
		t = t.Elem()
	}

	if t.Kind() != reflect.Struct {
		return "unknown"
	}

	f, ok := t.FieldByName(field)

	if !ok {
		return f.Name
	}

	tag := f.Tag.Get("json")

	if tag != "" {
		return tag
	}
	return f.Name
}

func ValidateFields(s any) map[string]string {
	validate := validator.New(validator.WithRequiredStructEnabled())
	err := validate.Struct(s)

	fieldErrors := map[string]string{}

	if err != nil {
		for _, e := range err.(validator.ValidationErrors) {
			fieldErrors[getFieldJsonTag(s, e.Field())] = formatValidator(e)
		}
		return fieldErrors
	}

	return nil

}

func Decoder(r *http.Request, s any) error {

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&s)
	if err != nil {
		return err
	}
	return nil

}

func DecodeAndValidate(r *http.Request, s any) FieldErrors {
	Decoder(r, s)
	err := ValidateFields(s)
	if err != nil {
		return err
	}

	return nil
}
