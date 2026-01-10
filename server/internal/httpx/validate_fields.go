package httpx

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"net/http"
	"reflect"
	"strings"
)

type Message struct {
	Message string `json:"message"`
}
type FieldErrors []Message

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
	case "jobtype":
		return fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(JobTypes(), ", "))
	case "strongpassword":
		return fmt.Sprintf("%v should contains Capital letters, one of:'@!$',digits and has length greater than %v", f.Field(), f.Param())
	case "eqfield":
		return fmt.Sprintf("%v mismatch %v", f.Field(), f.Param())
	case "supplytypeval":
		return fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(SuppliesTypes(), ", "))
	case "measurementunitsval":
		return fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(MeasurementUnits(), ", "))
	case "istimestamptz":
		return fmt.Sprintf("%v should be of format '2026-01-13T02:12:00.000Z'", f.Field())
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

func ValidateFields(s any) FieldErrors {
	validate := validator.New(validator.WithRequiredStructEnabled())
	validate.RegisterValidation("jobtype", jobTypeValidator)
	validate.RegisterValidation("alphanumspace", alphaNumSpacesGreek)
	validate.RegisterValidation("strongPassword", strongPassword)
	validate.RegisterValidation("supplyTypeVal", supplyTypeValidator)
	validate.RegisterValidation("measurementUnitsVal", measurementUnitsValidator)
	validate.RegisterValidation("isTimestamptz", isoTimestamptzValidator)

	err := validate.Struct(s)

	fieldErrors := FieldErrors{}

	if err != nil {
		for _, e := range err.(validator.ValidationErrors) {
			fieldErrors = append(fieldErrors, Message{
				Message: fmt.Sprintf("%v: %v", getFieldJsonTag(s, e.Field()), formatValidator(e)),
			})
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

func DecodeAndValidate(r *http.Request, s any) HttpErrorResponse {
	Decoder(r, s)
	err := ValidateFields(s)
	if err != nil {
		return GeneralError(400, err)
	}

	return nil
}
