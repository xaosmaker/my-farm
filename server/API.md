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
---

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
            "meta":{
                "name":"email"
            }
        },
        {
            "message":"password: Password is Required!",
            "appCode":"required_field",
            "meta":{
                "name":"password"
            }
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

### <span style="color:green">POST</span> /api/users/create
<details>

#### body:
```json
{
    "email":"test@test.com",
    "password":"test1",
    "confirmPassword":"test1"
}

```
#### responses:

<span style="color:green">201</span>
```json

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
            "meta":{
                "name":"email"
            }
        },{
            "message":"password: Password is Required!",
            "appCode":"required_field",
            "meta":{
                "name":"password"
            }
        },{
            "message":"confirmPassword: ConfirmPassword is Required!",
            "appCode":"required_field",
            "meta":{
                "name":"confirmPassword"
            }
        }
    ]
}
```
invalid email, password, confirm password
```json
{
    "errors":
    [
        {
            "message":"email: Please provide a valid email",
            "appCode":"invalid_email",
            "meta":null
        },{
            "message":"password: Password should contains Capital letters, digits and has length greater than 8",
            "appCode":"invalid_password",
            "meta":{"min":"8"}
        },{
            "message":"confirmPassword: ConfirmPassword mismatch Password",
            "appCode":"password_mismatch_error",
            "meta":null
        },{
            "message":"invalid email alread exists",
            "appCode":"email_exist_error",
            "meta":null
        }
    ]
}
```
</details>

---
---

### <span style="color:green">POST</span> /api/farms
<details>

#### body:
```json
{
    "name":"farm name"
}
```
#### response:

<span style="color:green">201</span>
```json
{
    "id":3,
    "name":"test",
    "createdAt":"2026-01-31T17:18:27.835461Z",
    "updatedAt":"2026-01-31T17:18:27.835461Z"
}
```

<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"name: Name is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"name"
            }
        },
        {
            "message":"name: Name should contain only chars spaces and number",
            "appCode":"invalid_num_space_char",
            "meta":null
        }
    ]
}
```

<span style="color:red">409</span>
```json
{
    "errors":
    [
        {
            "message":"Farm already exist",
            "appCode":"exist_error",
            "meta":{"name":"Farm"
            }
        }
    ]
}
```
</details>

### <span style="color:blue">GET</span> /api/farms
<details>

#### body: `empty`
#### response:

<span style="color:green">200</span>
```json
{
    "id":1,
    "name":"Farm name",
    "createdAt":"2025-09-11T10:00:00Z",
    "updatedAt":"2025-09-11T10:00:00Z"
}
```

<span style="color:red">401</span>
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

<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Farm not found",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Farm"
            }
        }
    ]
}
```
</details>

---
---

### <span style="color:green">POST</span> /api/fields
<details>

#### body:
```json
{
    "name":"somename",
    "fieldLocation":"some",
    "areaInMeters":200,
    "isOwned": true
}
```
#### response:

<span style="color:green">201</span>
```json
{
    "id":27,
    "name":"somename",
    "epsg2100Boundary":null,
    "epsg4326Boundary":null,
    "mapLocation":null,
    "fieldLocation":"some",
    "areaInMeters":200,
    "isOwned":false,
    "createdAt":"2026-02-01T02:34:27.563058Z",
    "updatedAt":"2026-02-01T02:34:27.563058Z",
    "landUnit":"m2"
}
```

<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"name: Name is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"name"
            }
        },
        {
            "message":"fieldLocation: FieldLocation should contain only chars spaces and number",
            "appCode":"invalid_num_space_char",
            "meta":null
        },
        {
            "message":"areaInMeters: AreaInMeters is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"areaInMeters"
            }
        },
        {
            "message":"name: Name should contain only chars spaces and number",
            "appCode":"invalid_num_space_char",
            "meta":null
        }
    ]
}
```

<span style="color:red">409</span>
```json
{
    "errors":
    [
        {
            "message":"Field already exist",
            "appCode":"exist_error",
            "meta":
            {
                "name":"Field"
            }
        }
    ]
}
```
</details>


### <span style="color:purple">PATCH</span> /api/fields/{fieldId}
all the body `key:pair` are optional
<details>

#### body:
```json
{
    "name":"somename",
    "fieldLocation":"some",
    "areaInMeters":200,
    "isOwned": true
}
```
#### response:

<span style="color:green">200</span>
```json
{
    "id":27,
    "name":"somename",
    "epsg2100Boundary":null,
    "epsg4326Boundary":null,
    "mapLocation":null,
    "fieldLocation":"some",
    "areaInMeters":200,
    "isOwned":false,
    "createdAt":"2026-02-01T02:34:27.563058Z",
    "updatedAt":"2026-02-01T02:34:27.563058Z",
    "landUnit":"m2"
}
```

<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"name: Name is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"name"
            }
        },
        {
            "message":"fieldLocation: FieldLocation should contain only chars spaces and number",
            "appCode":"invalid_num_space_char",
            "meta":null
        },
        {
            "message":"areaInMeters: AreaInMeters is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"areaInMeters"
            }
        },
        {
            "message":"name: Name should contain only chars spaces and number",
            "appCode":"invalid_num_space_char",
            "meta":null
        },
        {
            "message":"Invalid url param expect number",
            "appCode":"invalid_url_param",
            "meta":null
        }
    ]
}
```
<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Field not found",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Field"
            }
        }
    ]
}
```

<span style="color:red">409</span>
```json
{
    "errors":
    [
        {
            "message":"Field already exist",
            "appCode":"exist_error",
            "meta":
            {
                "name":"Field"
            }
        }
    ]
}
```
</details>

### <span style="color:blue">GET</span> /api/fields/{fieldID}
<details>

#### body: `null`
#### response:
<span style="color:green">200</span>
```json
{
    "id":1,
    "name":"γουρουνια",
    "epsg2100Boundary":null,
    "epsg4326Boundary":null,
    "mapLocation":null,
    "fieldLocation":"γουρουνια",
    "areaInMeters":35000,
    "isOwned":false,
    "createdAt":"2026-10-11T00:00:00Z",
    "updatedAt":"2026-10-11T00:00:00Z",
    "landUnit":"m2"
}
```
<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"Invalid url param expect number",
            "appCode":"invalid_url_param",
            "meta":null
        }
    ]
}
```
<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Field not found",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Field"
            }
        }
    ]
}
```
</details>


### <span style="color:red">DELETE</span> /api/fields/{fieldId}
<details>

#### body: `null`
#### response:

<span style="color:green">204</span> `null`

<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"Invalid url param expect number",
            "appCode":"invalid_url_param",
            "meta":null
        }
    ]
}
```
<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Field not found",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Field"
            }
        }
    ]
}
```

</details>

---
---

### <span style="color:green">POST</span> /api/supplies
<details>

#### body:
```json
{
    "supplyType":"chemicals",
    "nickname":"This is optional",
    "name":"somename",
    "measurementUnit":"L"
}
```

#### response:
<span style="color:green">200</span>
```json
{
    "id":11,
    "supplyType":"chemicals",
    "nickname":null,
    "name":"somename",
    "measurementUnit":"L",
    "createdAt":"2026-02-01T22:34:13.323315Z",
    "updatedAt":"2026-02-01T22:34:13.323315Z"
}
```

<span style="color:red">400</span>
```json

{
    "errors":
    [
        {
            "message":"supplyType: SupplyType is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"supplyType"
            }
        },
        {
            "message":"name: Name is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"name"
            }
        },
        {
            "message":"measurementUnit: MeasurementUnit is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"measurementUnit"
            }
        },
        {
            "message":"supplyType: SupplyType should contain one of 'chemicals, fertilizers, seeds, diesel'",
            "appCode":"invalid_supply_type",
            "meta":
            {
                "oneof":"chemicals, fertilizers, seeds, diesel"
            }
        },
        {
            "message":"measurementUnit: MeasurementUnit should contain one of 'KG, L, piece'",
            "appCode":"invalid_measurement_unit",
            "meta":
            {
                "oneof":"KG, L, piece"
            }
        }
    ]
}


```

<span style="color:red">409</span>
```json
{
    "errors":
    [
        {
            "message":"Supply already exist",
            "appCode":"exist_error",
            "meta":
            {
                "name":"Supply"
            }
        }
    ]
}
```



</details>


### <span style="color:purple">PATCH</span> /api/supplies/{supplyId}
<details>

#### body:
every field here is optional
```json
{
    "supplyType":"chemicals",
    "nickname":"This is optional",
    "name":"somename",
    "measurementUnit":"L"
}
```

#### response:
<span style="color:green">204</span> `null`

<span style="color:red">400</span>
```json

{
    "errors":
    [
        {
            "message":"Invalid url param expect number",
            "appCode":"invalid_url_param",
            "meta":null
        },
        {
            "message":"supplyType: SupplyType should contain one of 'chemicals, fertilizers, seeds, diesel'",
            "appCode":"invalid_supply_type",
            "meta":
            {
                "oneof":"chemicals, fertilizers, seeds, diesel"
            }
        },
        {
            "message":"measurementUnit: MeasurementUnit should contain one of 'KG, L, piece'",
            "appCode":"invalid_measurement_unit",
            "meta":
            {
                "oneof":"KG, L, piece"
            }
        }
    ]
}


```

<span style="color:red">409</span>
```json
{
    "errors":
    [
        {
            "message":"Supply already exist",
            "appCode":"exist_error",
            "meta":
            {
                "name":"Supply"
            }
        }
    ]
}
```



</details>


### <span style="color:blue">GET</span> /api/supplies
<details>

#### body: `null`

#### response:
<span style="color:green">200</span>
```json
[
    {
        "id":8,
        "supplyType":"fertilizers",
        "nickname":null,
        "name":"26-0-0",
        "measurementUnit":"KG",
        "createdAt":"2026-02-01T23:08:34.483639Z",
        "updatedAt":"2026-02-01T23:08:34.483639Z"
    }
]
```
</details>


### <span style="color:blue">GET</span> /api/supplies{supplyId}
<details>

#### body: `null`

#### response:
<span style="color:green">200</span>
```json
    {
        "id":8,
        "supplyType":"fertilizers",
        "nickname":null,
        "name":"26-0-0",
        "measurementUnit":"KG",
        "createdAt":"2026-02-01T23:08:34.483639Z",
        "updatedAt":"2026-02-01T23:08:34.483639Z"
    }
```
<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"Invalid url param expect number",
            "appCode":"invalid_url_param",
            "meta":null
        }
    ]
}
```
<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Supply dont exist",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Supply"
            }
        }
    ]
}
```


</details>


### <span style="color:red">DELETE</span> /api/supplies/{supplyId}
<details>

#### body: `null`
#### response:

<span style="color:green">204</span> `null`

<span style="color:red">404</span>
```json
{
    "errors":
    [
        {
            "message":"Supply dont exists",
            "appCode":"not_found_error",
            "meta":
            {
                "name":"Supply"
            }
        }
    ]
}

```
</details>

---
---

### <span style="color:green">POST</span> /api/settings
<details>

#### body:
```json
{
    "landUnit":"hello"
}
```
#### response:

<span style="color:green">204</span> `null`


<span style="color:red">400</span>
```json
{
    "errors":
    [
        {
            "message":"landUnit: LandUnit is Required!",
            "appCode":"required_field",
            "meta":
            {
                "name":"landUnit"
            }
        },
        {
            "message":"landUnit: LandUnit should contain one of 'stremata, hectares, m2'",
            "appCode":"invalid_land_unit",
            "meta":
            {
                "oneof":"stremata, hectares, m2"
            }
        }
    ]
}
```

</details>


### <span style="color:blue">GET</span> /api/setting
<details>

#### body: `null`
#### response:
<span style="color:green">200</span>
```json
{
    "id":1,
    "userId":1,
    "landUnit":"m2",
    "createdAt":"2026-02-02T00:47:18.105067Z",
    "updatedAt":"2026-02-02T00:47:18.105067Z"
}
```

<span style="color:red">401</span>
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

<!-- <span style="color:red"></span> -->
