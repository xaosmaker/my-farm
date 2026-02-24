package apperror

type ErrorCode = string

/*
 here the comment represent the meta the error take
*/

const (
	// general
	NOT_FOUND_ERROR        ErrorCode = "not_found_error"        //  name: field name | resource name
	SERVER_ERROR           ErrorCode = "server_error"           //
	INVALID_URL_PARAM      ErrorCode = "invalid_url_param"      //
	UNAUTHORIZED_ERROR     ErrorCode = "unauthorized_error"     //
	UNKNOWN_ERROR          ErrorCode = "unknown_error"          //     * this will used on special ocasion
	ROUTE_NOT_FOUND        ErrorCode = "route_not_found"        //
	METHOD_NOT_FOUND       ErrorCode = "method_not_found"       //
	REQUIRED_FIELD         ErrorCode = "required_field"         // name: field name | resource name
	EXIST_ERROR            ErrorCode = "exist_error"            // name: field name | resource name
	DB_ERROR               ErrorCode = "db_error"               //
	EMAIL_SEND_ERROR       ErrorCode = "email_send_error"       //
	INVALID_MAX            ErrorCode = "invalid_max"            // max: the length we expect
	INVALID_MIN            ErrorCode = "invalid_min"            // min: the length or the number we expect
	INVALID_NUM_SPACE_CHAR ErrorCode = "invalid_num_space_char" //
	INVALID_TIMESTAMP      ErrorCode = "invalid_timestamp"      //format: format of the timestamp
	INVALID_NUMBER         ErrorCode = "invalid_number"
	// season errors
	INVALID_SEASON_START_DATE  ErrorCode = "invalid_season_start_date"  // date: min date of start season, dateLimit: lower || greater
	INVALID_SEASON_FINISH_DATE ErrorCode = "invalid_season_finish_date" // date: min date  for season finish, dateLimit: lower || greater
	SEASON_FINISH_ERROR        ErrorCode = "season_finish_error"
	INVALID_SEASON_AREA        ErrorCode = "invalid_season_area" // area: remaining area

	// auth errors
	EMAIL_EXIST_ERROR          ErrorCode = "email_exist_error"          //
	INVALID_EMAIL              ErrorCode = "invalid_email"              //
	EMAIL_VERIFIED             ErrorCode = "email_verified"             //
	INVALID_VERIFICATION_TOKEN ErrorCode = "invalid_verification_token" //
	INVALID_PASSWORD           ErrorCode = "invalid_password"           // min: min length of char *but we have to provide the other val
	PASSWORD_MISMATCH_ERROR    ErrorCode = "password_mismatch_error"    //
	// job errors
	INVALID_JOB_TYPE  ErrorCode = "invalid_job_type"  // oneof: a string with the values we expect
	INVALID_JOB_START ErrorCode = "invalid_job_start" // max : start of job greater than date

	// supply errors
	INVALID_SUPPLY_TYPE ErrorCode = "invalid_supply_type" // oneof: a string with the values we expect

	// measuremet unit errors
	INVALID_MEASUREMENT_UNIT ErrorCode = "invalid_measurement_unit" // oneof: a string with the values we expect
	// land unit
	INVALID_LAND_UNIT ErrorCode = "invalid_land_unit"
	//
	INVALID_EQUAL_FIELDS ErrorCode = "invalid_equal_fields" //fieldA: name , fieldB: name,
)
