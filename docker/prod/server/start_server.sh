#!/bin/sh
echo "Running db migrations..."
goose -dir sql/schemas postgres $DB_URL up                                                                                                                      ─╯
echo "Starting server..."
exec ./server
