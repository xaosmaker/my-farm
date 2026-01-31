package httpx

import "github.com/xaosmaker/server/internal/apperror"

func NewNotFoundError(code int, message, metaName string) ServerErrorResponse {
	return ServerError(code, NewErrMessage(message, apperror.NOT_FOUND_ERROR, Meta{"name": metaName}))

}

func NewExistError(code int, message, metaName string) ServerErrorResponse {
	return ServerError(code, NewErrMessage(message, apperror.EXIST_ERROR, Meta{"name": metaName}))

}

func NewDBError(message string) ServerErrorResponse {
	return ServerError(503, NewErrMessage(message, apperror.DB_ERROR, nil))

}

// func NewUnknownError(message string) ServerErrorResponse{
// 	return ServerError(503, NewErrMessage(message, apperror.DB_ERROR, nil))
//
// }
