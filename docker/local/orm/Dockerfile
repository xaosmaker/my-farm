FROM python:3.14-alpine3.23


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /orm
COPY orm/ .
RUN python3 -m venv /py && /py/bin/pip install -r requirements.txt 


ENV PATH="/py/bin:$PATH"
