package apperror

import "fmt"

const (
	SEVERITY_INFO     = "info"
	SEVERITY_WARN     = "warning"
	SEVERITY_ERR      = "error"
	SEVERITY_CRITICAL = "critical"
)

type Meta = map[string]string

type AppError struct {
	StatusCode int
	Severity   string
	Errors     []ErrorMessage `json:"errors"`
	Err        error
}

func (a AppError) Error() string {
	s := fmt.Sprintln("StatusCode:", a.StatusCode, ",severity:", a.Severity, ",Original Error:", a.Err, ",Error Messages:", a.Errors)
	return s
}

type ErrorMessage struct {
	Message string `json:"message"`
	AppCode string `json:"appCode"`
	Meta    Meta   `json:"meta"`
}

func NewAppErrorConstructor(statusCode int, severity string, message string, appCode string, meta Meta, err error) AppError {
	return AppError{
		StatusCode: statusCode,
		Severity:   severity,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: message,
				AppCode: appCode,
				Meta:    meta,
			},
		},
	}

}

func New500Error(err error) AppError {

	return AppError{
		StatusCode: 500,
		Severity:   SEVERITY_CRITICAL,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: "Internal Server Error",
				AppCode: SERVER_ERROR,
				Meta:    nil,
			},
		},
	}
}

func New401UnauthorizedError(message string, err error) AppError {
	if message == "" {
		message = "Unauthorized"
	}
	return AppError{
		StatusCode: 401,
		Severity:   SEVERITY_CRITICAL,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: message,
				AppCode: UNAUTHORIZED_ERROR,
				Meta:    nil,
			},
		},
	}

}

func New404NotFoundError(message, metaName string, err error) AppError {
	return AppError{
		StatusCode: 404,
		Severity:   SEVERITY_WARN,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: message,
				AppCode: NOT_FOUND_ERROR,
				Meta: Meta{
					"name": metaName,
				},
			},
		},
	}
}

func New400Error(errorMessages []ErrorMessage, err error) AppError {
	return AppError{
		StatusCode: 400,
		Severity:   SEVERITY_WARN,
		Err:        nil,
		Errors:     errorMessages,
	}
}
func New409ExistError(message, metaName string, err error) AppError {

	return AppError{
		StatusCode: 409,
		Severity:   SEVERITY_WARN,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: message,
				AppCode: EXIST_ERROR,
				Meta: Meta{
					"name": metaName,
				},
			},
		},
	}
}

func New503DBError(message string, err error) AppError {

	return AppError{
		StatusCode: 503,
		Severity:   SEVERITY_ERR,
		Err:        err,
		Errors: []ErrorMessage{
			{
				Message: message,
				AppCode: DB_ERROR,
				Meta:    nil,
			},
		},
	}
}
