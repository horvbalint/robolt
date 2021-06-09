# Robolt

> Robolt is a frontend helper class for projects using [Robogo](TODO) and [Axios](https://www.npmjs.com/package/axios). The aim is to provide an easy to use and flexible way to communicate with robogo.


## Table of contents

* [Getting started](#install)
* [Methods:](#methods)
  * [Create](#create)
  * [Read](#read)
  * [Update](#update)
  * [Delete](#delete)
  * [Service](#service)
  * [File](#file)
  * [Special](#special)


## Disclaimer
We take no responsibility for any demage done by this package.

If you find anything that isn't working or not up to the documentation create a pull request over on [github](https://github.com/horvbalint/robogo/issues).
Thank You in advance!

<a name="install"></a>
## Getting started

A very simple example:
```javascript
import Robolt from 'robolt'
import axios from 'axios'

// configure axios if needed (eg.: baseURL) before creating the Robolt instance

const robolt = new Robolt(axios, 'api')

// Robolt is ready to be used!
```

The constructor uses the following parameters:

| Parameter  | Type | Description | Default |
|:-|:-:|:-:|:-:|
|axios|Function|The axios function preconfigured|
|prefix|String|The prefix that was used when [the routes of robogo were registered to express.js](TODO/#install)|
|serveStaticPath|String|The path where the files are static hosted. Same as in the constructor of robogo|'static'|
|defaultFilter|Object|A [MongoDB filter](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) object. Every request's filter will be this object if no filter was provided|{}|

<a name="methods"></a>
## Methods
This section will describe the methods of robolt that are available to use. These are organized in seven categories: Create, Read, Update, Delete, Service, File and Special.

<a name="create"></a>
### Create methods
Every create method returns a Promise that is resolved with the result or rejected with an error.

#### Create
> Sends a POST request to the '/:model' route of robogo with the given data.

* Method: POST
* Resolves: Object (MongoDB document)

```javascript
this.$API.Create(modelName, documentObject)
.then( document =>  ...  )
.catch( error =>  ...  )
```
##### Params:
| key | type | description |
|:-|:-:|:-:|
| modelName | String | Name of the model registered in robogo|
| documentObject | Object | Object matching the schema of the model |


<br></br>
<a name="read"></a>
### Read methods
Every read method returns a Promise that is resolved with the result or rejected with an error.

#### Read
> Sends a GET request to the '/:model/find' route of robogo with the given data.

* Method: GET
* Resolves: Array<Objects (mongodb documents)>

```javascript
this.$API.Read(modelName[, optionsObject ])
.then( documents =>  ...  )
.catch( error =>  ...  )
```

##### optionsObject:
| key | type | description | example |
|:-|:-:|:-:|:-:|
| filter | Object | [Mongodb query](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) | {Chandler: {$in: friends}} |
| projection | Array\<String\> | Fields to include in results. Uses mongodb [projection](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.html). | ['username', 'friends'] |
| sort | Object | [Mongodb sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/index.html) | { age : 1 } |
| skip | Number | The number of documents to skip in the results set. | 10 |
| limit | Number | The number of documents to include in the results set. | 5 |

<br></br>
#### Get
> Sends a GET request to the '/:model/:id' route of robogo with the given data.

* Method: GET
* Resolves: Object (mongodb document)

```javascript
this.$API.Get(modelName, documentId[, optionsObject ])
.then( document =>  ...  )
.catch( error =>  ...  )
```

##### optionsObject:
| key | type | description | example |
|:-|:-:|:-:|:-:|
| projection | Array\<String\> | Fields to include in [projection](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.html). | ['username', 'friends'] |


<br></br>
<a name="update"></a>
### Update methods
Every update method returns a Promise that is resolved with the result or rejected with an error.

#### Update
> Sends a PATCH request to the '/:model' route of robogo with the given data.

* Method: PATCH
* Resolves: [WriteResults](https://docs.mongodb.com/manual/reference/method/db.collection.update/#std-label-writeresults-update)

```javascript
this.$API.Update(modelName, documentObject)
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### documentObject:
An object with an _id field containing the ObjectId of the document we want to update and the fields we want to change with their new values.


<br></br>
<a name="delete"></a>
### Delete methods
Every delete method returns a Promise that is resolved with the result or rejected with an error.

#### Delete
> Sends a DELETE request to the '/:model/:id' route of robogo with the given document _id.

* Method: DELETE
* Resolves: [WriteResults](https://docs.mongodb.com/manual/reference/method/db.collection.update/#std-label-writeresults-update)

```javascript
this.$API.Delete(modelName, documentId)
.then( result =>  ...  )
.catch( error =>  ...  )
```


<br></br>
<a name="service"></a>
### Service methods
Every service method returns a Promise that is resolved with the result or rejected with an error.

#### GetService
> Sends a GET request to the '/getter/:service/:function' route of robogo with the given data.

* Method: GET
* Resolves: Any

```javascript
this.$API.GetService(serviceName, functionName, params)
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| serviceName | String | Name of the service (.js file) registered in robogo|
| functionName | String | Name of the function inside the service |
| params | Any | The parameters that the service awaits |

<br></br>
#### RunService
> Sends a POST request to the '/runner/:service/:function' route of robogo with the given data.

* Method: POST
* Resolves: Any

```javascript
this.$API.RunService(serviceName, functionName, params)
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| serviceName | String | Name of the service (.js file) registered in robogo|
| functionName | String | Name of the function inside the service |
| params | Any | The parameters that the service awaits |


<br></br>
<a name="file"></a>
### File methods

#### UploadFile
> Sends a POST (multipart/form-data) request to the '/fileupload' route of robogo with the given file.

* Method: POST
* Resolves: Promise\<[RoboFile document](TODO/#files)\>

```javascript
this.$API.UploadFile(file)
.then( result =>  ...  )
.catch( error =>  ...  )
```

<br></br>
#### GetFileURLs
> Returns the file's absolute and relative URLs where it is static hosted by robogo. If a thumbnail was also created it also returns the thumbnail's URLs.

* Returns: {absolutePath, relativePath[, absoluteThumbnailPath, relativeThumbnailPath]}

```javascript
this.$API.GetFileURLs(file)
```
file: [RoboFile document](TODO/#files) to the file

<br></br>
#### GetFile
> Downloads the file for a [RoboFile document](TODO/#files) from robogo.

* Method: GET
* Returns: Promise\<File\>

```javascript
this.$API.GetFile(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](TODO/#files) of the file or its _id|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetFileURL
> Downloads the file for a [RoboFile document](TODO/#files) from robogo and returns a local URL.

* Method: GET
* Returns: Promise\<String\>

```javascript
this.$API.GetFileURL(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](TODO/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetThumbnail
> Downloads the thumbnail file for a [RoboFile document](TODO/#files) from robogo.

* Method: GET
* Returns: Promise\<File\>

```javascript
this.$API.GetThumbnail(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](TODO/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetThumbnailURL
> Downloads the thumbnail file for a [RoboFile document](TODO/#files) from robogo and returns a local URL.

* Method: GET
* Returns: Promise\<String\>

```javascript
this.$API.GetThumbnailURL(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](TODO/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### DeleteFile
> Sends a DELETE request to the '/filedelete/:id' route of robogo with the given file id.

* Method: DELETE
* Resolves: Promise\<Empty\>

```javascript
this.$API.DeleteFile(file)
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### File:
Either the whole [RoboFile document](TODO/#files) of the file or its _id value.


<br></br>
<a name="special"></a>
### Special methods
Every special method returns a Promise that is resolved with the result or rejected with an error.

<a name="schema"></a>
####  Schema
>Sends a GET request to the '/schema/:id' route of robogo.

* Method: GET
* Resolves into: Object

```javascript
this.$API.Schema(modelName)
.then( schema => ... )
.catch( error => ... )
```

<br></br>
#### TableHeaders
>Sends a GET request to the '/fields/:id' route of robogo.

* Methods: GET
* Resolves into: Array of Objects

```javascript
this.$API.TableHeaders(modelName)
.then( headers => ... )
.catch( error => ... )
```

<br></br>
#### Count
>Sends a GET request to the '/count/:model' route of robogo.

* Methods: GET
* Resolves into: Number

```javascript
this.$API.Count(modelName[, filter])
.then( count => ... )
.catch( error => ... )
```
##### filter:
[MongoDB filter](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) object


<br></br>
## Contributing
Every contribution is more then welcomed. If you have an idea or made some changes to the code, please open a pull request at the package's [github page](https://github.com/horvbalint/robogo/issues).
  

## Authors
* Horváth Bálint
* Zákány Balázs