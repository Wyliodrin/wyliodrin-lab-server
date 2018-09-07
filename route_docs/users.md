# Users

All objects are owned by a user.

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `userId` | String | yes | server | A unique id for each user | 
| `username` | String | yes | user | A unique identifier for each user. It is used for login. |
| `firstName` | String | yes | user | A non unique first name for the user |
| `lastName` | String | yes | user | A non unique last name for the user |
| `email` | String | yes | user | The email address |
| `password` | String | yes | user | An encrypted password |
| `role` | String | yes | user | The role of the user. Default is `user`. Another role is `admin` |


## API

All links are prefixed with `/api/v1`. All data is passed as JSON.

The examples have all the possible parameters. Some are optional, please look at the parameters table.

All requests, except the ones that say otherwise, have to provide the following headers:

| Header | Required | Format | Description |
| ------ | -------- | ------ |-------------| 
| `authorization` | yes | Bearer `token` | The token received from login |

Some requests can only be made by a user with `admin` role

All requests return errors in the following format:



4xx/500 Error
````json
{
	"statusError": "type of error",
	"err":"error text"
}
````

### Login

`POST` /users/login

> Note: This request does not need an authorization token

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `username` | yes | The username |
| `password` | yes | The plain text password |

#### Response

200 OK
````json
{
	"err":0,
	"token":"a token used for requests that require the authorization token",
	"role": "role of user"
}
````


### User Info
This route returns information on the user linked to the bearer token provided in the request 
a.k.a the logged in user. 

`GET` /users/info

#### Response

200 OK
````json
{
	"err":0,
	"user": {
		"userId":"the user id",
		"username":"the username",
		"name":"the user name",
		"email":"the user email",
		"role": "the role of the user",
		"createdAt": "the date at which the user was created"
	}
}
````

<!-- ### User Sessions

`GET` /user/sessions

#### Response -->



<!-- ### Edit User

`POST` /user/edit

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `name` | no | The username |
| `email` | no | The email |

#### Response

200 OK
````json
{
	"err":0,
	"sessions": [
		{
			"userId": "the user id",
			"tokenId":"the session's token id",
			"accessTime":"the date and time when the session was credted, UTC format",
			"accessIP":"the IP address from where the user connected for the first time for this session"
		},
		...
	]
}
```` -->

### Change password

`POST` /user/password/edit

The new password needs to be different than the old password
#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `oldPassword` | yes | The plain text old password |
| `newPassword` | yes | The plain text new password |

#### Response

200 OK
````json
{
	"err":0,
}
````

### Delete a session

`GET` /user/logout/`tokenId`

> Note: The `tokenId` of the session is provided in the url

#### Response

200 OK
````json
{
	"err":0,
}
````

### Logout

`GET` /user/logout

#### Response

200 OK
````json
{
	"err":0,
}
````