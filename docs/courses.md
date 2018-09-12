# Courses
	A course is an object that groups together the teachers, students and other relevant information for the course.

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `courseId` | String | yes | server | A unique id for each course | 
| `name` | String | yes | user | The name of the course. Name can only be alphanumeric |
| `teachers` | String Array | yes | user/server | The list of teachers for the course |
| `students` | String Array | yes | user/server | The list of students for the course |
| `imageId` | String | no | user/server | The ID of the image which will be used on the Raspberry Pi's for the course |
| `open` | Boolean | yes | user/server | The property that defines if the enrollment to the course is open or not |


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


### List public courses

`GET` /courses/public

> Note: This request does not need an authorization token

#### Response

200 OK
````json
{
	"err":0,
	"courses": [
		{ 
			"name": "name of course1",
			"courseId": "ID of the course1"
		},
		{ 
			"name": "name of course2",
			"courseId": "ID of the course2"
		}
		...
		]
}
````

### List courses for logged in user

`GET` /courses/

#### Response

200 OK
````json
{
	"err":0,
	"courses": [
		{ 
			"name": "name of course",
			"teachers": [
				"teacher1 ID",
				"teacher2 ID"
			],
			"students": [
				"student1 ID",
				"student2 ID"
			],
			"courseId": "ID of the course",
			"open": "True or False",
		}
		...
		]
}
````

### Remove students from course

`POST` /courses/students/remove

> Note: Only an administrator or a teacher for the course can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `studentId` | yes | One or multiple student IDs. It can be a String or a String Array |
| `courseId` | yes | The ID of the course from which the students will be removed |

#### Response 

200 OK
````json
{
	"err": 0
}
````

### Add students to course

`POST` /courses/students/add

> Note: Only an administrator or a teacher for the course can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `studentId` | yes | One or multiple student IDs. It can be a String or a String Array |
| `courseId` | yes | The ID of the course to which the students will be added |

#### Response 

200 OK
````json
{
	"err": 0
}
````

### List all courses

`GET` /courses/all

> Note: Only an administrator can access this route

#### Response

200 OK
````json
{
	"err":0,
	"courses": [
		{ 
			"name": "name of course1",
			"teachers": [
				"teacher1 ID",
				"teacher2 ID"
			],
			"students": [
				"student1 ID",
				"student2 ID"
			],
			"courseId": "ID of the course1",
			"open": "True or False",
		},
		{ 
			"name": "name of course2",
			"teachers": [
				"teacher1 ID",
				"teacher2 ID"
			],
			"students": [
				"student1 ID",
				"student2 ID"
			],
			"courseId": "ID of the course2",
			"open": "True or False",
		}
		...
		]
}
````

### Add a new course

`POST` /courses/add
If students of teachers are not specified, the new course is created with empty arrays.

> Note: Only an administrator can access this route
#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `students` | no | The array of student IDs |
| `teachers` | no | The array of teacher IDs |
| `name` | yes | The name of the course |
| `imageId` | no | The ID of the image for the course |

#### Response

200 OK
````json
{
	"err":0,
	"course": { 
			"name": "name of the created course",
			"teachers": [
				"teacher1 ID",
				"teacher2 ID"
			],
			"students": [
				"student1 ID",
				"student2 ID"
			],
			"courseId": "ID of the created course",
			"open": "True or False"
	}
}
````

### Remove a course

`POST` /courses/remove

> Note: Only an administrator can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `courseId` | yes | The ID of the course that will be removed |

#### Response

200 OK
````json
{
	"err":0
}
````

### Update a course

`POST` /courses/update

> Note: Only an administrator can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `courseId` | yes | The ID of the course that will be updated |
| `name` | yes | The new name for the course |
| `imageId` | no | The new image ID for the course |

#### Response

200 OK
````json
{
	"err":0
}
````

### Get a course

`GET` /courses/get/:courseId

Get a course with the ID courseId. 

> Note: Only an administrator can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `courseId` | yes | The ID of the course |

#### Response

200 OK
````json
{
	"err":0,
	"course": { 
			"name": "name of the course",
			"teachers": [
				"teacher1 ID",
				"teacher2 ID"
			],
			"students": [
				"student1 ID",
				"student2 ID"
			],
			"courseId": "ID of the course",
			"open": "True or False"
	}
}
````

### Remove a teacher

`POST` /courses/teachers/remove

Remove a teacher from a course

> Note: Only an administrator can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `courseId` | yes | The ID of the course |
| `teacherId` | yes | The ID of the teacher to be removed |