# robolt

> Robolt is a frontend helper class for projects using [Robogo](https://www.npmjs.com/package/robogo) and [Axios](https://www.npmjs.com/package/axios). The aim is to provide an easy to use and flexible way to communicate with robogo.


## Table of contents

* [Getting started](#installSection)
* [Methods:](#methodsSection)
  * [Create](#createMethods)
  * [Read](#readMethods)
  * [Update](#updateMethods)
  * [Delete](#deleteMethods)
  * [Service](#serviceMethods)
  * [File](#fileMethods)
  * [Special](#specialMethods)


## Disclaimer
We take no responsibility for any demage done by this package.

If you find anything that isn't working or not up to the documentation, please open issue or a pull request over on [github](https://github.com/horvbalint/robolt/issues).

Thank You in advance!

<a name="installSection"></a>
## Getting started

A very simple example:
```javascript
import Robolt from 'robolt'
import axios from 'axios'

// configure axios here if needed (eg.: baseURL) before creating the robolt instance

const robolt = new Robolt(axios, 'api')

// robolt is ready to be used!
```

The constructor uses the following parameters:

| Parameter  | Type | Description | Default |
|:-|:-:|:-:|:-:|
|axios|Function|The axios function preconfigured|
|prefix|String|The prefix that was used when [the routes of robogo were registered to express.js](https://www.npmjs.com/package/robogo/#install)|
|serveStaticPath|String|The path where the files are static hosted. Same as in the constructor of robogo|'static'|
|defaultFilter|Object|A [MongoDB filter](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) object. Every request's filter will be this object if no filter was provided|{}|

<a name="methodsSection"></a>
## Methods
This section will describe the methods of robolt that are available to use. These are organized in seven categories: Create, Read, Update, Delete, Service, File and Special.

<a name="createMethods"></a>
### Create methods
Every create method returns a Promise that is resolved with the result or rejected with an error.

#### Create
> Sends a POST request to the '/create/:model' route of robogo with the given data.

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
<a name="readMethods"></a>
### Read methods
Every read method returns a Promise that is resolved with the result or rejected with an error.

#### Read
> Sends a GET request to the '/read/:model' route of robogo with the given data.

* Method: GET
* Resolves: Array<Object (MongoDB document)>

```javascript
this.$API.Read(modelName[, optionsObject ])
.then( documents =>  ...  )
.catch( error =>  ...  )
```

##### optionsObject:
| key | type | description | example |
|:-|:-:|:-:|:-:|
| filter | Object | [Mongodb query](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) | {Chandler: {$in: friends}} |
| projection | Array\<String\> | Fields to include in results. Uses MongoDB [projection](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.html). | ['username', 'friends'] |
| sort | Object | [Mongodb sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/index.html) | { age : 1 } |
| skip | Number | The number of documents to skip in the results set. | 10 |
| limit | Number | The number of documents to include in the results set. | 5 |

<br></br>
#### Get
> Sends a GET request to the '/get/:model/:id' route of robogo with the given data.

* Method: GET
* Resolves: Object (MongoDB document)

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
#### Search
> Sends a GET request to the '/search/:model' route of robogo with the given data.

* Method: GET
* Resolves: Array<Object (MongoDB document)>

```javascript
this.$API.Search(modelName[, optionsObject ])
.then( documents =>  ...  )
.catch( error =>  ...  )
```

##### optionsObject:
| key | type | description | example |
|:-|:-:|:-:|:-:|
| filter | Object | [Mongodb query](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.htmls) | {Chandler: {$in: friends}} |
| projection | Array\<String\> | Fields to include in results. Uses MongoDB [projection](https://docs.mongodb.com/manual/reference/method/db.collection.find/index.html). | ['username', 'friends'] |
| threshold | Number | [Fuse.js](https://www.npmjs.com/package/fuse.js) threshold, defaults to 0.4 | 0.6 |
| keys | Array\<String\> | Keys of the document that are searched in. If no keys are provided all keys of the document will be used. | ['username'] |
| depth | Number | If no keys are provided, we can limit the depth of the keys to be picked from the schema, defaults to Infinity | 2 |
| term | String | Search term that is searched for | 'search term' |


<br></br>
<a name="updateMethods"></a>
### Update methods
Every update method returns a Promise that is resolved with the result or rejected with an error.

#### Update
> Sends a PATCH request to the '/update/:model' route of robogo with the given data.

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
<a name="deleteMethods"></a>
### Delete methods
Every delete method returns a Promise that is resolved with the result or rejected with an error.

#### Delete
> Sends a DELETE request to the '/delete/:model/:id' route of robogo with the given document _id.

* Method: DELETE
* Resolves: [WriteResults](https://docs.mongodb.com/manual/reference/method/db.collection.update/#std-label-writeresults-update)

```javascript
this.$API.Delete(modelName, documentId)
.then( result =>  ...  )
.catch( error =>  ...  )
```


<br></br>
<a name="serviceMethods"></a>
### Service methods
Every service method returns a Promise that is resolved with the result or rejected with an error.

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
<a name="fileMethods"></a>
### File methods

#### UploadFile
> Sends a POST (multipart/form-data) request to the '/fileupload' route of robogo with the given file.

* Method: POST
* Returns: Promise\<[RoboFile document](https://www.npmjs.com/package/robogo/#files)\>

```javascript
this.$API.UploadFile(file[, percentCallback])
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | File | File instance, eg.: from a file input |
| percentCallback | Function | Callback that will be called multiple times, while the file is uploading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetFileURLs
> Returns the file's absolute and relative URLs where it is static hosted by robogo. If a thumbnail was also created it also returns the thumbnail's URLs.

* Returns: {absolutePath, relativePath[, absoluteThumbnailPath, relativeThumbnailPath]}

```javascript
this.$API.GetFileURLs(file)
```
##### file:
[RoboFile document](https://www.npmjs.com/package/robogo/#files) to the file

<br></br>
#### GetFile
> Downloads the file for a [RoboFile document](https://www.npmjs.com/package/robogo/#files) from robogo.

* Method: GET
* Returns: Promise\<File\>

```javascript
this.$API.GetFile(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](https://www.npmjs.com/package/robogo/#files) of the file or its _id|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetFileURL
> Downloads the file for a [RoboFile document](https://www.npmjs.com/package/robogo/#files) from robogo and returns a local URL for it.

* Method: GET
* Returns: Promise\<String\>

```javascript
this.$API.GetFileURL(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](https://www.npmjs.com/package/robogo/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetThumbnail
> Downloads the thumbnail file for a [RoboFile document](https://www.npmjs.com/package/robogo/#files) from robogo.

* Method: GET
* Returns: Promise\<File\>

```javascript
this.$API.GetThumbnail(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](https://www.npmjs.com/package/robogo/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### GetThumbnailURL
> Downloads the thumbnail file for a [RoboFile document](https://www.npmjs.com/package/robogo/#files) from robogo and returns a local URL for it.

* Method: GET
* Returns: Promise\<String\>

```javascript
this.$API.GetThumbnailURL(file[, percentCallback])
```

##### Params:
| key | type | description |
|:-|:-:|:-:|
| file | String/Object | Either the whole [RoboFile document](https://www.npmjs.com/package/robogo/#files) of the file or its _id value|
| percentCallback | Function | Callback that will be called multiple times, while the file is downloading. Its parameter is a number between 0 and 100 |

<br></br>
#### DeleteFile
> Sends a DELETE request to the '/filedelete/:id' route of robogo with the given file id.

* Method: DELETE
* Returns: Promise\<Empty\>

```javascript
this.$API.DeleteFile(file)
.then( result =>  ...  )
.catch( error =>  ...  )
```

##### File:
Either the whole [RoboFile document](https://www.npmjs.com/package/robogo/#files) of the file or its _id.


<br></br>
<a name="specialMethods"></a>
### Special methods
Every special method returns a Promise that is resolved with the result or rejected with an error.

<a name="schema"></a>
####  Schema
>Sends a GET request to the '/schema/:model' route of robogo.

* Method: GET
* Resolves into: Object

```javascript
this.$API.Schema(modelName)
.then( schema => ... )
.catch( error => ... )
```

<br></br>
#### Fields
>Sends a GET request to the '/fields/:model' route of robogo.

* Methods: GET
* Resolves into: Array of Objects

```javascript
this.$API.Fields(modelName)
.then( fields => ... )
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
#### SearchKeys
> Sends a GET request to the '/searchkeys/:model' route of robogo.

* Methods: GET
* Resolves into: Array\<String\>

```javascript
this.$API.SearchKeys(modelName[, depth])
.then( keys => ... )
.catch( error => ... )
```
##### depth:
Number, that limits the depth of the keys to be picked from the model's schema


<br></br>
## Contributing
Every contribution is more then welcomed. If you have an idea or made some changes to the code, please open an issue or a pull request at the package's [github page](https://github.com/horvbalint/robolt/issues).
  

## Authors
* Horváth Bálint
* Zákány Balázs