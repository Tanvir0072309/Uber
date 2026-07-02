# Backend API Documentation

## Register User

Creates a new user account and returns an authentication token with the created user data.

### Endpoint

```http
POST /users/register
```

### Required Data

Send the data as JSON in the request body.

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

### Example Success Response

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
    "email": "tanvir@example.com"
  }
}
```

### Example Error Response

**Status code:** `400 Bad Request`

Returned when validation fails, such as invalid email, first name shorter than 3 characters, or password shorter than 6 characters.

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

### Other Error Response

**Status code:** `500 Internal Server Error`

May be returned if user creation fails because of a server or database error.

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

### Required Data

Send the data as JSON in the request body.

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

### Example Success Response

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
    "password": "hashed_password_here"
  }
}
```

### Example Validation Error Response

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

### Example Login Error Response

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

### Other Error Response

**Status code:** `500 Internal Server Error`

May be returned if login fails because of a server or database error.

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

### Authentication Required

This endpoint requires a valid JWT token. Send the token using one of these methods:

```http
Authorization: Bearer jwt_token_here
```

Or send the token in cookies:

```http
token=jwt_token_here
```

### Required Data

No request body is required.

### Example Success Response

**Status code:** `200 OK`

```json
{
  "_id": "user_id_here",
  "fullname": {
    "firstname": "Tanvir",
    "lastname": "Ahmed"
  },
  "email": "tanvir@example.com",
  "socketId": "socket_id_here"
}
```

### Example Error Response

**Status code:** `401 Unauthorized`

Returned when the token is missing, invalid, or expired.

```json
{
  "message": "Unauthorized"
}
```

### Other Error Response

**Status code:** `500 Internal Server Error`

May be returned if profile fetching fails because of a server or database error.

### Example Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer jwt_token_here"
```

## Logout User

Logs out the current user by clearing the token cookie and adding the current token to the blacklist.

### Endpoint

```http
GET /users/logout
```

### Authentication Required

This endpoint requires a valid JWT token. Send the token using one of these methods:

```http
Authorization: Bearer jwt_token_here
```

Or send the token in cookies:

```http
token=jwt_token_here
```

### Required Data

No request body is required.

### Example Success Response

**Status code:** `200 OK`

```json
{
  "message": "Logged Out."
}
```

### Example Error Response

**Status code:** `401 Unauthorized`

Returned when the token is missing, invalid, or expired.

```json
{
  "message": "Unauthorized"
}
```

### Other Error Response

**Status code:** `500 Internal Server Error`

May be returned if logout fails because of a server or database error.

### Example Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer jwt_token_here"
```
