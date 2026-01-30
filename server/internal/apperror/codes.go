package apperror

type ErrorCode = string

const (
	SERVER_ERROR               ErrorCode = "server_error"
	UNAUTHORIZED_ERROR         ErrorCode = "unauthorized_error"
	UNKNOWN_ERROR              ErrorCode = "unknown_error"
	ERROR_EMAIL_SEND           ErrorCode = "error_email_send"
	ROUTE_NOT_FOUND            ErrorCode = "route_not_found"
	METHOD_NOT_FOUND           ErrorCode = "method_not_found"
	REQUIRED_FIELD             ErrorCode = "required_field"
	INVALID_MIN_NUMBER         ErrorCode = "invalid_min_number"
	INVALID_MAX_LENGTH         ErrorCode = "invalid_max_length"
	INVALID_EMAIL              ErrorCode = "invalid_email"
	INVALID_EMAIL_EXIST        ErrorCode = "invalid_email_exist"
	INVALID_EMAIL_VERIFIED     ErrorCode = "invalid_email_verified"
	INVALID_VERIFICATION_TOKEN ErrorCode = "invalid_verification_token"
	INVALID_NUM_SPACE_CHAR     ErrorCode = "invalid_num_space_char"
	INVALID_JOB_TYPE           ErrorCode = "invalid_job_type"
	INVALID_PASSWORD_LENGTH    ErrorCode = "invalid_password_length"
	INVALID_SUPPLY_TYPE        ErrorCode = "invalid_supply_type"
	INVALID_MEASUREMENT_UNIT   ErrorCode = "invalid_measurement_unit"
	INVALID_TIMESTAMP          ErrorCode = "invalid_timestamp"
	INVALID_EQUAL_FIELDS       ErrorCode = "invalid_equal_fields"
	INVALID_PASSWORD_MISMATCH  ErrorCode = "invalid_password_mismatch"
)
