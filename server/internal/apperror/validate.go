package apperror

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/xaosmaker/server/internal/apptypes"
)

func formatFields(f validator.FieldError) ErrorMessage {
	switch strings.ToLower(f.Tag()) {

	case "required":
		return ErrorMessage{
			fmt.Sprintf("%v is Required!", f.Field()),
			REQUIRED_FIELD,
			Meta{"name": f.Field()},
		}
	case "min":
		return ErrorMessage{
			fmt.Sprintf("%v < %v", f.Field(), f.Param()),
			INVALID_MIN,
			Meta{"min": f.Param()},
		}
	case "max":
		return ErrorMessage{
			fmt.Sprintf("%v > %v", f.Field(), f.Param()),
			INVALID_MAX,
			Meta{"max": f.Param()},
		}
	case "email":
		return ErrorMessage{"Please provide a valid email",
			INVALID_EMAIL,
			nil,
		}
	case "alphanumspace":
		return ErrorMessage{
			fmt.Sprintf("%v should contain only chars spaces and number", f.Field()),
			INVALID_NUM_SPACE_CHAR,
			nil,
		}
	case "jobtype":
		return ErrorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.JobTypes(), ", ")),
			INVALID_JOB_TYPE,
			Meta{"oneof": strings.Join(apptypes.JobTypes(), ", ")},
		}
	case "strongpassword":
		return ErrorMessage{
			fmt.Sprintf("%v should contains Capital letters, digits and has length greater than %v", f.Field(), f.Param()),
			INVALID_PASSWORD,
			Meta{"min": f.Param()},
		}
	case "eqfield":
		if f.Field() == "ConfirmPassword" {

			return ErrorMessage{

				fmt.Sprintf("%v mismatch %v", f.Field(), f.Param()),
				PASSWORD_MISMATCH_ERROR,
				nil,
			}

		}
		return ErrorMessage{

			fmt.Sprintf("%v mismatch %v", f.Field(), f.Param()),
			INVALID_EQUAL_FIELDS,
			Meta{"fieldA": f.Field(), "fieldB": f.Param()},
		}

	case "supplytypeval":
		return ErrorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.SuppliesTypes(), ", ")),
			INVALID_SUPPLY_TYPE,
			Meta{"oneof": strings.Join(apptypes.SuppliesTypes(), ", ")},
		}
	case "measurementunitsval":
		return ErrorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.MeasurementUnits(), ", ")),
			INVALID_MEASUREMENT_UNIT,
			Meta{"oneof": strings.Join(apptypes.MeasurementUnits(), ", ")},
		}
	case "landunitval":
		return ErrorMessage{
			fmt.Sprintf("%v should contain one of '%v'", f.Field(), strings.Join(apptypes.LandMeasurementUnit(), ", ")),
			INVALID_LAND_UNIT,
			Meta{"oneof": strings.Join(apptypes.LandMeasurementUnit(), ", ")},
		}
	case "istimestamptz":
		return ErrorMessage{fmt.Sprintf("%v should be of format '2026-01-13T02:12:00.000Z'", f.Field()),
			INVALID_TIMESTAMP,
			Meta{"format": "'2026-01-13T02:12:00.000Z'"},
		}
	default:
		return ErrorMessage{
			fmt.Sprintf("format Validator uknown format %v", f.Error()),
			UNKNOWN_ERROR,
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

func ValidateFields(s any) []ErrorMessage {
	validate := validator.New(validator.WithRequiredStructEnabled())
	validate.RegisterValidation("jobtype", jobTypeValidator)
	validate.RegisterValidation("alphanumspace", alphaNumSpacesGreek)
	validate.RegisterValidation("strongPassword", strongPassword)
	validate.RegisterValidation("supplyTypeVal", supplyTypeValidator)
	validate.RegisterValidation("measurementUnitsVal", measurementUnitsValidator)
	validate.RegisterValidation("isTimestamptz", isoTimestamptzValidator)
	validate.RegisterValidation("landUnitVal", landUnitValidator)

	err := validate.Struct(s)

	fieldErrors := make([]ErrorMessage, 0)

	if err != nil {
		for _, e := range err.(validator.ValidationErrors) {
			errMess := formatFields(e)
			if errMess.AppCode == REQUIRED_FIELD {
				errMess.Meta["name"] = getFieldJsonTag(s, e.Field())
			}
			errMess.Message = fmt.Sprintf("%v: %v", getFieldJsonTag(s, e.Field()), errMess.Message)
			fieldErrors = append(fieldErrors, errMess)
		}
		return fieldErrors
	}

	return nil

}
