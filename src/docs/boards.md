# Boards

A board is a object that gathers the information about the Raspberry Pi

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `boardId` | String | yes | user | A unique id for each board | 
| `userId` | String | no | user | The Id of the user to which the board is assigned |
| `status` | String | yes | user/server | The status of the board |
| `courseId` | String | no | user/server | The course to which the board is assigned |
| `lastInfo` | Date | yes | server | Last time the board received information  |
| `command` | String | yes | server | The command that the board needs to execute next |
| `ip` | String | yes | server | The ip of the board |

### Exchange

> Note: This request does not need an authorization token

`POST` /boards/exchange

The route that all the boards will access every 10 seconds for status updates

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The ID of the board |
| `courseId` | no | The ID of the course the board is assigned to |
| `userId` | no | The ID of the user the board is assigned to |
| `status` | no | The current status of the board |

#### Response 

200 OK
````json
{
	"err": 0,
	"command": "the command that the board will execute"
}
````

### Get board

`GET` /boards/get/:boardId

Get the board with the ID boardId

#### Response 

200 OK
````json
{
	"err": 0,
	"board": {
		"status": "the status of the board",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of the board"
	}
}
````

### Get board for user

`GET` /boards/user

Get the board used by the logged in user. If the user doesn't use a board, the returned board is null.

#### Response 

200 OK
````json
{
	"err": 0,
	"board": {
		"status": "the status of the board",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of the board",
		"boardId": "the serial of the board"
	}
}
````

### Disconnect a user

`POST` /boards/disconnect

Disconnect a user from the board

> Note: Only an administrator or a teacher for the course can access this route.

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The ID of the board |


#### Response 

200 OK
````json
{
	"err": 0
}
````

### Assign a board to a user

`POST` /boards/assign

The board must not be assigned to another course or another user.

> Note: Only an administrator can access this route.

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The ID of the board |
| `courseId` | yes | The ID of the course |
| `userId` | yes | The ID of the user |


#### Response 

200 OK
````json
{
	"err": 0,
	"board": {
		"status": "the status of the board",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of the board",
		"boardId": "the serial of the board"
	}
}
````

### List boards assigned to course

`GET` /boards/list/:courseId

Lists the boards that are assigned to this course

> Note: Only an administrator, a student or a teacher for the course can access this route.

#### Response 

200 OK
````json
{
	"err": 0,
	"boards": [
		{
		"status": "the status of board1",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of board1",
		"boardId": "the serial of board1"
		},
		{
		"status": "the status of board2",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of board2",
		"boardId": "the serial of board2"
		},
		.......
	]
}
````

### List all boards

`GET` /boards/list

> Note: Only an administrator can access this route

#### Response 

200 OK
````json
{
	"err": 0,
	"boards": [
		{
		"status": "the status of board1",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of board1",
		"boardId": "the serial of board1"
		},
		{
		"status": "the status of board2",
		"lastInfo": "yyyy-mm-ddThh:mm:ss",
		"courseId": "ID of the course",
		"userId": "ID of the user",
		"command": "the command of board2",
		"boardId": "the serial of board2"
		},
		.......
	]
}
````

### Reboot a board

`POST` /boards/reboot

> Note: Only an administrator a teacher for the course, or the user assigned can access this route.

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The ID of the board |


#### Response 

200 OK
````json
{
	"err": 0
}
````

### Remove a board

`POST` /boards/remove

> Note: Only an administrator can access this route.

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The ID of the board |


#### Response 

200 OK
````json
{
	"err": 0
}
````