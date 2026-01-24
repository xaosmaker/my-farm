package util

import (
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func MailDialer() *gomail.Dialer {

	hostSmtpEmail := os.Getenv("EMAIL_HOST_USER")
	hostSmtpPassword := os.Getenv("EMAIL_HOST_PASSWORD")
	hostSmtp := os.Getenv("EMAIL_HOST")
	hostSmtpPort := os.Getenv("EMAIL_PORT")
	hostSmtpPortNumber, err := strconv.Atoi(hostSmtpPort)
	if err != nil {
		return nil
	}

	d := gomail.NewDialer(hostSmtp, hostSmtpPortNumber, hostSmtpEmail, hostSmtpPassword)
	return d
}

func MailMessage(userEmail, emailSubject, emailBody string) *gomail.Message {

	hostSmtpEmail := os.Getenv("EMAIL_HOST_USER")
	m := gomail.NewMessage()

	m.SetHeader("From", hostSmtpEmail)
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", emailSubject)
	m.SetBody("text/html", emailBody)
	return m
}
