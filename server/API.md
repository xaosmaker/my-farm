# API


## Errors Response 

Server errors always return the same schema.

`message`: is a description of the error

`appCode`: is an custom app code who show the error and can used with translation

`meta`: if the error has ranges we send it with meta else meta is `null`

here is the schema and one small example of meta
each api is doc well so you know what meta you receive
```json
{
    "errors":
    [
        {
            "message":"The value should be greater than 10",
            "appCode":"invalid_min_value",
            "meta":{"min":10}

        }
    ]
}
```
***

### <span style="color:green">POST</span> /api/users/login
<details>

#### body:
```json
{
    "email":"test@test.com",
    "password":"test"
}

```
#### responses:

<span style="color:green">200</span>
also send an access cookie to client
```json
{
    "id":1,
    "email":"test@test.com",
    "farmId":1,
    "farmName":"farm nam"
}
```

<span style="color:red">400</span>
fields not completed well or not pass validations
```json
{
    "errors":
    [
        {
            "message":"email: Email is Required!",
            "appCode":"required_field",
            "meta":null
        },
        {
            "message":"password: Password is Required!",
            "appCode":"required_field",
            "meta":null
        }
    ]
}
```
invalid email
```json
{
    "errors":
    [
        {
            "message":"email: Please provide a valid email",
            "appCode":"invalid_email",
            "meta":null
        }
    ]
}
```

<span style="color:red">401</span>
wrong email or password
```json
{
    "errors":
    [
        {
            "message":"Unauthorized",
            "appCode":"unauthorized_error",
            "meta":null
        }
    ]
}
```
</details>

---
<!-- <span style="color:red"></span> -->
