# Images

Images are objects containing the imageId, the status of the image among other information.

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `id` | String | yes | server | A unique id for each image | 
| `filename` | String | yes | user | The name of the image |
| `status` | String Array | yes | user/server | The status of the image |
| `progress` | String Array | yes | user/server | The progress of download |
| `fat` | Object | yes | server | The fat partition of the image. It contains offset and sectors |
| `ext3` | Object | yes | server | The ext3 partition of the image. It contains offset and sector |

### List images

`GET` /images/list


#### Response

200 OK
````json
{
    "err": 0,
    "images": [
        {
            "fat": {
                "offset": "offset",
                "sectors": "sector"
            },
            "ext3": {
                "offset": "offset",
                "sectors": "sector"
            },
            "id": "id of image",
            "filename": "name-of-image.img",
            "status": "downloaded"
        },
        {
            "fat": {
                "offset": "offset",
                "sectors": "sector"
            },
            "ext3": {
                "offset": "offset",
                "sectors": "sector"
            },
            "id": "id of image",
            "filename": "name-of-image.img",
            "status": "downloaded"
		},
		....
    ]
}
````

### Setup an image

`GET` /images/setup/:id

The server sets up the image with the ID id.

#### Response 

200 OK
````json
{
	"err": 0
}
````

### Download an image

`POST` /images/download

> Note: Only an administrator can access this route

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `link` | yes | The link from where to download the image |

#### Response 

200 OK
````json
{
	"err": 0
}
````

### Delete an image

`GET` images/delete/:id

Deletes the image with the ID id

> Note: Only an administrator can access this route

#### Response 

200 OK
````json
{
	"err": 0
}
````

### Get the default image

`GET` /images/default

If there is no image on the server the image response is null.

#### Response 

200 OK
````json
{
	"err": 0,
	"image": {

		"fat": {
			"offset": "offset",
			"sectors": "sector"
		},
		"ext3": {
			"offset": "offset",
			"sectors": "sector"
		},
		"id": "id of image",
		"filename": "name-of-image.img",
		"status": "downloaded"
	}

}
````

### Set the default image

`POST` /images/default

> Note: Only an administrator can access this route

The image ID must be valid

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `id` | yes | The id of the image to be set to default |

#### Response 

200 OK
````json
{
	"err": 0
}
````