package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q JobsQueries) GetAllJobs(w http.ResponseWriter, r *http.Request) {
	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(400, "login")(w, r)
		return
	}
	fieldId := r.PathValue("fieldId")
	if fieldId == "" {
		er.GeneralError(500, nil)(w, r)
		return
	}
	nFieldId, err := strconv.ParseInt(fieldId, 10, 64)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}

	field, err := q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: nFieldId,
		UserID:  user.ID,
	})
	if err != nil {
		er.GeneralError(400, "This Field Doesnt Exist")
	}
	jobs, err := q.DB.GetAllJobs(r.Context(), field.ID)
	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	jJobs := []jobResponse{}
	for _, job := range jobs {
		jJobs = append(jJobs, toJodResponse(job))
	}

	fmt.Println(jJobs)
	data, err := json.Marshal(jJobs)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
func (q JobsQueries) GetJobDetails(w http.ResponseWriter, r *http.Request) {

	user, err := utils.GetUserFromContext(r)
	if err != nil {
		er.GeneralError(400, "login")(w, r)
		return
	}
	fieldId := r.PathValue("fieldId")
	jobId := r.PathValue("jobId")
	if fieldId == "" || jobId == "" {
		er.GeneralError(500, nil)(w, r)
		return
	}
	nFieldId, err := strconv.ParseInt(fieldId, 10, 64)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}

	nJobId, err := strconv.ParseInt(jobId, 10, 64)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}

	_, err = q.DB.GetFieldByIdAndUser(r.Context(), db.GetFieldByIdAndUserParams{
		FieldID: nFieldId,
		UserID:  user.ID,
	})
	if err != nil {
		er.GeneralError(400, "This Field Doesnt Exist")
	}
	job, err := q.DB.GetJobDetails(r.Context(), db.GetJobDetailsParams{
		FieldID: nFieldId,
		JobID:   &nJobId,
	})

	if err != nil {
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	jJob := toJodDetailsResponse(job)

	data, err := json.Marshal(jJob)
	if err != nil {
		er.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(data)

}
