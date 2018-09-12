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

`POST` /boards/get/:boardId

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