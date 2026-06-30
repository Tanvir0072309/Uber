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
