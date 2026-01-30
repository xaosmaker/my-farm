package httpx

import (
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/apptypes"
)

func formatValidator(f validator.FieldError) errorMessage {
	switch strings.ToLower(f.Tag()) {

	case "required":
		return errorMessage{
			fmt.Sprintf("%v is Required!", f.Field()),
			apperror.REQUIRED_FIELD,
			Meta{"name": f.Field()},
		}
	case "min":
		return errorMessage{
			fmt.Sprintf("%v length should be greater than %v", f.Field(), f.Param()),
			apperror.INVALID_MIN_NUMBER,
			Meta{"min": f.Param()},
		}
	case "max":
		return errorMessage{
			fmt.Sprintf("%v length cant exceed %v", f.Field(), f.Param()),
			apperror.INVALID_MAX_LENGTH,
			Meta{"max": f.Param()},
		}
	case "email":
		return errorMessage{"Please provide a valid email",
			apperror.INVALID_EMAIL,
			nil,
		}
	case "alphanumspace":
		return errorMessage{
			fmt.Sprintf("%v should contain only chars spaces and number", f.Field()),
			apperror.INVALID_NUM_SPACE_CHAR,
			nil,
		}
	case "jobtype":
		return errorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.JobTypes(), ", ")),
			apperror.INVALID_JOB_TYPE,
			Meta{"oneof": strings.Join(apptypes.JobTypes(), ", ")},
		}
	case "strongpassword":
		return errorMessage{
			fmt.Sprintf("%v should contains Capital letters, digits and has length greater than %v", f.Field(), f.Param()),
			apperror.INVALID_PASSWORD_LENGTH,
			Meta{"min": f.Param()},
		}
	case "eqfield":
		if f.Field() == "ConfirmPassword" {

			return errorMessage{

				fmt.Sprintf("%v mismatch %v", f.Field(), f.Param()),
				apperror.INVALID_PASSWORD_MISMATCH,
				Meta{"fieldA": f.Field(), "fieldB": f.Param()},
			}

		}
		return errorMessage{

			fmt.Sprintf("%v mismatch %v", f.Field(), f.Param()),
			apperror.INVALID_EQUAL_FIELDS,
			Meta{"fieldA": f.Field(), "fieldB": f.Param()},
		}

	case "supplytypeval":
		return errorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.SuppliesTypes(), ", ")),
			apperror.INVALID_SUPPLY_TYPE,
			Meta{"oneof": strings.Join(apptypes.SuppliesTypes(), ", ")},
		}
	case "measurementunitsval":
		return errorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.MeasurementUnits(), ", ")),
			apperror.INVALID_MEASUREMENT_UNIT,
			Meta{"oneof": strings.Join(apptypes.MeasurementUnits(), ", ")},
		}
	case "istimestamptz":
		return errorMessage{fmt.Sprintf("%v should be of format '2026-01-13T02:12:00.000Z'", f.Field()),
			apperror.INVALID_TIMESTAMP,
			nil,
		}
	default:
		return errorMessage{
			fmt.Sprintf("format Validator uknown format %v", f.Error()),
			apperror.UNKNOWN_ERROR,
			nil,
		}
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

func ValidateFields(s any) *ErrMessage {
	validate := validator.New(validator.WithRequiredStructEnabled())
	validate.RegisterValidation("jobtype", jobTypeValidator)
	validate.RegisterValidation("alphanumspace", alphaNumSpacesGreek)
	validate.RegisterValidation("strongPassword", strongPassword)
	validate.RegisterValidation("supplyTypeVal", supplyTypeValidator)
	validate.RegisterValidation("measurementUnitsVal", measurementUnitsValidator)
	validate.RegisterValidation("isTimestamptz", isoTimestamptzValidator)

	err := validate.Struct(s)

	fieldErrors := ErrMessage{}

	if err != nil {
		for _, e := range err.(validator.ValidationErrors) {
			errMess := formatValidator(e)
			if errMess.AppCode == apperror.REQUIRED_FIELD {
				errMess.Meta["name"] = getFieldJsonTag(s, e.Field())
			}
			errMess.Message = fmt.Sprintf("%v: %v", getFieldJsonTag(s, e.Field()), errMess.Message)
			fieldErrors.Errors = append(fieldErrors.Errors, errMess)
		}
		return &fieldErrors
	}

	return nil

}

func DecodeAndValidate(r *http.Request, s any) *ErrMessage {
	DecodeBody(r, s)
	err := ValidateFields(s)
	if err != nil {
		return err
	}

	return nil
}
