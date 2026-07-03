# Ubar Backend API Documentation

This backend provides authentication APIs for users and captains. JWT tokens expire in `24h`.

## Base URL

```http
http://localhost:3000
```

## Authentication

Protected routes require a JWT token. Send it in the `Authorization` header:

```http
Authorization: Bearer jwt_token_here
```

Or send it as a cookie:

```http
token=jwt_token_here
```

## Common Error Format

Validation errors return this format:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

Unauthorized requests return:

```json
{
  "message": "Unauthorized"
}
```

# User Routes

## Register User

Creates a new user account and returns an authentication token with the created user data.

### Endpoint

```http
POST /users/register
```

### Request Body

```json
{
  "fullname": {
    "firstname": "Tanvir",
    "lastname": "Ahmed"
  },
  "email": "tanvir@example.com",
  "password": "password123"
}
```

### Body Fields

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters if provided |
| `email` | String | Yes | Must be a valid email |
| `password` | String | Yes | Minimum 6 characters |

### Success Response

**Status code:** `201 Created`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "Tanvir",
      "lastname": "Ahmed"
    },
    "email": "tanvir@example.com",
    "socketId": null
  }
}
```

### Error Responses

**Status code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Tanvir",
      "lastname": "Ahmed"
    },
    "email": "tanvir@example.com",
    "password": "password123"
  }'
```

## Login User

Logs in an existing user and returns an authentication token with the user data.

### Endpoint

```http
POST /users/login
```

### Request Body

```json
{
  "email": "tanvir@example.com",
  "password": "password123"
}
```

### Body Fields

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `email` | String | Yes | Must be a valid email |
| `password` | String | Yes | Minimum 6 characters |

### Success Response

**Status code:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "Tanvir",
      "lastname": "Ahmed"
    },
    "email": "tanvir@example.com",
    "socketId": null
  }
}
```

### Error Responses

**Status code:** `400 Bad Request`

Returned when validation fails.

**Status code:** `401 Unauthorized`

Returned when email or password is incorrect.

```json
{
  "message": "Invalid Email or Password."
}
```

```json
{
  "message": "Invalid Password"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tanvir@example.com",
    "password": "password123"
  }'
```

## User Profile

Returns the logged-in user's profile data.

### Endpoint

```http
GET /users/profile
```

### Authentication

Required.

### Request Body

No request body is required.

### Success Response

**Status code:** `200 OK`

```json
{
  "_id": "user_id_here",
  "fullname": {
    "firstname": "Tanvir",
    "lastname": "Ahmed"
  },
  "email": "tanvir@example.com",
  "socketId": null
}
```

### Error Responses

**Status code:** `401 Unauthorized`

Returned when the token is missing, invalid, or expired.

```json
{
  "message": "Unauthorized"
}
```

### Example Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer jwt_token_here"
```

# Captain Routes

## Register Captain

Creates a new captain account with vehicle details and returns an authentication token with the created captain data.

### Endpoint

```http
POST /captains/register
```

### Request Body

```json
{
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul.captain@example.com",
  "password": "password123",
  "vehicle": {
    "color": "White",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Body Fields

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters if provided |
| `email` | String | Yes | Must be a valid email and unique |
| `password` | String | Yes | Minimum 6 characters |
| `vehicle.color` | String | Yes | Minimum 3 characters |
| `vehicle.plate` | String | Yes | Minimum 3 characters and unique |
| `vehicle.capacity` | Number | Yes | Minimum value `1` |
| `vehicle.vehicleType` | String | Yes | Must be `car`, `motorcycle`, or `auto` |

### Success Response

**Status code:** `201 Created`

```json
{
  "token": "jwt_token_here",
  "captain": {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Rahul",
      "lastname": "Sharma"
    },
    "email": "rahul.captain@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "White",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": null,
      "lng": null
    },
    "createdAt": "2026-07-02T00:00:00.000Z",
    "updatedAt": "2026-07-02T00:00:00.000Z"
  }
}
```

### Error Responses

**Status code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bike",
      "msg": "Invalid vehicle type",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

**Status code:** `400 Bad Request`

Returned when a captain already exists with the same email.

```json
{
  "message": "Captain already exists with this email."
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Rahul",
      "lastname": "Sharma"
    },
    "email": "rahul.captain@example.com",
    "password": "password123",
    "vehicle": {
      "color": "White",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

## Login Captain

Logs in an existing captain and returns an authentication token with the captain data.

### Endpoint

```http
POST /captains/login
```

### Request Body

```json
{
  "email": "rahul.captain@example.com",
  "password": "password123"
}
```

### Body Fields

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `email` | String | Yes | Must be a valid email |
| `password` | String | Yes | Minimum 6 characters |

### Success Response

**Status code:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "captain": {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Rahul",
      "lastname": "Sharma"
    },
    "email": "rahul.captain@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "White",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": null,
      "lng": null
    },
    "createdAt": "2026-07-02T00:00:00.000Z",
    "updatedAt": "2026-07-02T00:00:00.000Z"
  }
}
```

### Error Responses

**Status code:** `400 Bad Request`

Returned when validation fails, such as invalid email or password shorter than 6 characters.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status code:** `401 Unauthorized`

Returned when the email does not exist.

```json
{
  "message": "Invalid Email or Password."
}
```

**Status code:** `401 Unauthorized`

Returned when the password is incorrect.

```json
{
  "message": "Invalid Password"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul.captain@example.com",
    "password": "password123"
  }'
```

## Captain Profile

Returns the logged-in captain's profile data.

### Endpoint

```http
GET /captains/profile
```

### Authentication

Required.

Send the captain JWT token in the `Authorization` header:

```http
Authorization: Bearer jwt_token_here
```

Or send it as a cookie:

```http
token=jwt_token_here
```

### Request Body

No request body is required.

### Success Response

**Status code:** `200 OK`

```json
{
  "_id": "captain_id_here",
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul.captain@example.com",
  "socketId": null,
  "status": "inactive",
  "vehicle": {
    "color": "White",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {
    "lat": null,
    "lng": null
  },
  "createdAt": "2026-07-02T00:00:00.000Z",
  "updatedAt": "2026-07-02T00:00:00.000Z"
}
```

### Error Responses

**Status code:** `401 Unauthorized`

Returned when the token is missing, invalid, expired, or blacklisted.

```json
{
  "message": "Unauthorized"
}
```

**Status code:** `404 Not Found`

Returned when the captain from the token does not exist.

```json
{
  "message": "Captain not found."
}
```

### Example Request

```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer jwt_token_here"
```

## Notes

- User routes are mounted under `/users`.
- Captain routes are mounted under `/captains`.
- JWT tokens expire after `24h`.
- Blacklisted JWT tokens are stored with a `24h` TTL.
- Passwords are hashed before saving.
- Captain accounts are created with default status `inactive`.
