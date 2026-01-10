package utils

import "time"

func UnsafeStrToTimeConverter(s string) *time.Time {
	/*
		unsafe because if someone use it to check here
		we asume that the string is already validated
		by the http validator
		and the return pointer is for nil values
	*/
	t, _ := time.Parse(time.RFC3339, s)
	return &t

}
