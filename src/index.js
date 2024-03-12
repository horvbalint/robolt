// @ts-check

/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

/**
 * @typedef MongoDocument
 * @prop {string} _id
 */

/**
 * @typedef RoboFile
 * @prop {string} _id
 * @prop {string} name
 * @prop {string} path
 * @prop {number} size
 * @prop {string} [type] MIME type
 * @prop {string} extension
 * @prop {boolean} isImage
 * @prop {string} [thumbnailPath]
 * @prop {Date} uploadDate
*/

/**
 * @template {Record<string, unknown>} [T = Record<string, unknown>]
 * @typedef RoboField
 * @prop {string} name
 * @prop {keyof T} key
 * @prop {string} type
 * @prop {string[]} [enum]
 * @prop {boolean} [required]
 * @prop {boolean} [isArray]
 * @prop {boolean} [marked]
 * @prop {boolean} [hidden]
 * @prop {any} [default]
 * @prop {Record<string, any>} [props]
 * @prop {string} [ref]
 * @prop {RoboField<Extract<T[keyof T], Record<string, unknown>> | Record<string, unknown>>[]} [subfields]
*/

export default class Robolt {
  /**
   * @param {AxiosInstance} axios A preconfigured axios instance
   * @param {string} prefix The prefix that was used when the routes of robogo were registered to express.js
   * @param {string} [serveStaticPath='static'] The path where the files are static hosted. Same as in the constructor of robogo
   */
  constructor(axios, prefix, serveStaticPath = 'static') {
    this.$axios = axios
    this.Prefix = prefix
    this.ServeStaticPath = serveStaticPath
  }

  /**
   * Sends a POST request to the '/create/:model' route of robogo with the given data.
   * @template {MongoDocument} T
   * @param {string} modelName Name of the model registered in robogo
   * @param {Omit<T, '_id'>} data Object matching the schema of the model
   * @returns {Promise<T>} The created document
   */
  async Create(modelName, data) {
    const response = await this.$axios.post(`/${this.Prefix}/create/${modelName}`, data)
    return response.data
  }

  /**
   * @typedef ReadOptions
   * @prop {object} [filter] Mongodb query
   * @prop {Array<string>} [projection] Fields to include in results. Uses MongoDB projection.
   * @prop {object} [sort] Mongodb sort - https://docs.mongodb.com/manual/reference/method/cursor.sort/index.html
   * @prop {number} [skip] The number of documents to skip in the results set.
   * @prop {number} [limit] The number of documents to include in the results set.
   */
  /**
   * Sends a GET request to the '/read/:model' route of robogo with the given data.
   * @template {MongoDocument} T
   * @param {string} modelName 
   * @param {ReadOptions} options 
   * @returns {Promise<Array<T>>}
   */
  async Read(modelName, options = {filter: {}}) {
    const response = await this.$axios.get(`/${this.Prefix}/read/${modelName}`, {
      params: {
        filter: JSON.stringify(options.filter),
        projection: options.projection,
        sort: JSON.stringify(options.sort || {}),
        skip: options.skip,
        limit: options.limit,
      }
    })
    
    return response.data
  }

  /**
   * @typedef GetOptions
   * @prop {Array<string>} [projection] Fields to include in results. Uses MongoDB projection.
   */
  /**
   * Sends a GET request to the '/get/:model/:id' route of robogo with the given data.
   * @template {MongoDocument} T
   * @param {string} modelName 
   * @param {string} id 
   * @param {GetOptions} options 
   * @returns {Promise<T|null>}
   */
  async Get(modelName, id, options = {}) {
    const response = await this.$axios.get(`/${this.Prefix}/get/${modelName}/${id}`, {
      params: {
        projection: options.projection,
      }
    })

    return response.data
  }

  /**
   * Sends a PATCH request to the '/update/:model' route of robogo with the given data.
   * @template {MongoDocument} T
   * @param {string} modelName 
   * @param {Partial<T> & MongoDocument} data 
   * @returns {Promise<object>} The result of the MongoDB update operation
   */
  async Update(modelName, data) {
    const response = await this.$axios.patch(`/${this.Prefix}/update/${modelName}`, data)
    return response.data
  }

  /**
   * Sends a DELETE request to the '/delete/:model/:id' route of robogo with the given document _id.
   * @param {string} modelName 
   * @param {string} id 
   * @returns {Promise}
   */
  async Delete(modelName, id) {
    const response = await this.$axios.delete(`/${this.Prefix}/delete/${modelName}/${id}`)
    return response.data
  }

  /**
   * Sends a POST request to the '/runner/:service/:function' route of robogo with the given data.
   * @param {string} serviceName 
   * @param {string} functionName 
   * @param {object} [params] 
   * @returns {Promise}
   */
  async RunService(serviceName, functionName, params) {
    const response = await this.$axios.post(`/${this.Prefix}/runner/${serviceName}/${functionName}`, params)
    return response.data
  }

  /**
   * Sends a GET request to the '/getter/:service/:function' route of robogo with the given data.
   * @param {string} serviceName 
   * @param {string} functionName 
   * @param {object} [params] 
   * @returns {Promise}
   */
  async GetService(serviceName, functionName, params) {
    const response = await this.$axios.get(`/${this.Prefix}/getter/${serviceName}/${functionName}`, {
      params: params,
    })
    return response.data
  }

  /**
   * Sends a POST (multipart/form-data) request to the '/fileupload' route of robogo with the given file.
   * @param {File} file 
   * @param {(percent: number, event: any) => void} [percentCallback] 
   * @returns 
   */
  async UploadFile(file, percentCallback) {
    let config = {
      headers: {'Content-Type': 'multipart/form-data'},
    }
    if(percentCallback)
      config.onUploadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    let formData = new FormData()
    formData.append('file', file)

    const response = await this.$axios.post(`/${this.Prefix}/fileupload`, formData, config)
    return response.data
  }

  /**
   * Returns the file's absolute and relative URLs where it is static hosted by robogo. If a thumbnail was also created it also returns the thumbnail's URLs.
   * @param {RoboFile} file RoboFile instance object
   * @returns {{
   *  absolutePath: string,
   *  relativePath: string,
   *  absoluteThumbnailPath?: string,
   *  relativeThumbnailPath?: string,
   * }}
   */
  GetFileURLs(file) {
    let urls = {
      absolutePath: `${this.$axios.defaults.baseURL}/${this.Prefix}/${this.ServeStaticPath}/${file.path}`,
      relativePath: `/${this.Prefix}/${this.ServeStaticPath}/${file.path}`,
    }

    if(file.thumbnailPath) {
      urls.absoluteThumbnailPath = `${this.$axios.defaults.baseURL}/${this.Prefix}/${this.ServeStaticPath}/${file.thumbnailPath}`
      urls.relativeThumbnailPath = `/${this.Prefix}/${this.ServeStaticPath}/${file.thumbnailPath}`
    }

    return urls
  }

  /**
   * Downloads the file for a RoboFile document from robogo.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @param {(percent: number, event: any) => void} [percentCallback] 
   * @returns {Promise<File>}
   */
  async GetFile(file, percentCallback) {
    let path = typeof file == 'string' ? file : file.path

    let config = {responseType: 'blob'}
    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    // @ts-ignore - for some reason the responseType 'blob' is not recognized as a valid ResponseType
    const response = await this.$axios.get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)

    let name = typeof file == 'string' ? 'unkown' : file.name
    return new File([response.data], name)
  }

  /**
   * Downloads the file for a RoboFile document from robogo and returns a local URL for it.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @param {(percent: number, event: any) => void} [percentCallback] 
   * @returns {Promise<string>}
   */
  async GetFileURL(file, percentCallback) {
    const res = await this.GetFile(file, percentCallback)
    return URL.createObjectURL(res)
  }

  /**
   * Downloads the thumbnail file for a RoboFile document from robogo.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @param {(percent: number, event: any) => void} [percentCallback] 
   * @returns {Promise<File>}
   */
  async GetThumbnail(file, percentCallback) {
    let path = typeof file == 'string' ? file : file.thumbnailPath
    let config = {responseType: 'blob'}
    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    // @ts-ignore - for some reason the responseType 'blob' is not recognized as a valid ResponseType
    const response = await this.$axios.get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)
    return response.data
  }

  /**
   * Downloads the thumbnail file for a RoboFile document from robogo and returns a local URL for it.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @param {(percent: number, event: any) => void} [percentCallback] 
   * @returns {Promise<string>}
   */
  async GetThumbnailURL(file, percentCallback) {
    const res = await this.GetThumbnail(file, percentCallback)
    return URL.createObjectURL(res)
  }

  /**
   * Sends a POST request to the '/fileclone/:id' route of robogo with the given file id.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @returns {Promise<File>}
   */
  async CloneFile(file) {
    let id = typeof file == 'string' ? file : file._id
 
    const response = await this.$axios.post(`/${this.Prefix}/fileclone/${id}`)
    return response.data
  }

  /**
   * Sends a DELETE request to the '/filedelete/:id' route of robogo with the given file id.
   * @param {RoboFile|string} file RoboFile instance object or its _id
   * @returns {Promise}
   */
  async DeleteFile(file) {
    let id = typeof file == 'string' ? file : file._id

    const response = await this.$axios.delete(`/${this.Prefix}/filedelete/${id}`)
    return response.data
  }

  /**
   * Sends a GET request to the '/model' or the 'model/:model' route of robogo, depending on wether the modelName parameter was given.
   * @param {string|null} [modelName] 
   * @returns {Promise<object|object[]>}
   */
  async Model(modelName = null) {
    if(!modelName)
      return (await this.$axios.get(`/${this.Prefix}/model`)).data
    else
      return (await this.$axios.get(`/${this.Prefix}/model/${modelName}`)).data
  }

  /**
   * Sends a GET request to the '/schema/:model' route of robogo.
   * @template {object} T
   * @param {string} modelName 
   * @returns {Promise<RoboField<T>[]>}
   */
  async Schema(modelName) {
    const response = await this.$axios.get(`/${this.Prefix}/schema/${modelName}`)
    return response.data
  }

  /**
   * Sends a GET request to the '/fields/:model' route of robogo.
   * @template {object} T
   * @param {string} modelName 
   * @param {number} [depth] 
   * @returns {Promise<RoboField<T>[]>}
   */
  async Fields(modelName, depth) {
    const response = await this.$axios.get(`/${this.Prefix}/fields/${modelName}`, {
      params: {
        depth
      }
    })

    return response.data
  }

  /**
   * Sends a GET request to the '/count/:model' route of robogo.
   * @param {string} modelName 
   * @param {object} filter 
   * @returns {Promise<number>}
   */
  async Count(modelName, filter) {
    const response = await this.$axios.get(`${this.Prefix}/count/${modelName}`, {
      params: {
        filter: JSON.stringify(filter)
      },
    })

    return response.data
  }

  /**
   * Returns the same result as the Schema method, but reintroduces circular references, that were stripped out by Robogo before sending the data to the frontend.
   * @param {string} modelName 
   * @returns {Promise<object>}
   */
  async RecycledSchema(modelName) {
    const fields = await this.Schema(modelName)
    recycleSchemaField({subfields: fields})
    return fields
  }

  /**
   * Sends a GET request to the '/accesses/:modelName' route of robogo.
   * @param {string} modelName 
   * @returns {Promise<Accesses>}
   */
  async Accesses(modelName) {
    const response = await this.$axios.get(`${this.Prefix}/accesses/${modelName}`)
    return new Accesses(response.data)
  }

  /**
   * Sends a GET request to the '/accessGroups' route of robogo.
   * @returns {Promise<AccessGroups>}
   */
  async AccessGroups() {
    const response = await this.$axios.get(`${this.Prefix}/accessesGroups`)
    return new AccessGroups(response.data)
  }
}

export class Accesses {
  constructor(accesses) {
    this.model = accesses.model
    this.fields = accesses.fields

    Object.freeze(this.model)
    Object.freeze(this.fields)
  }

  canReadModel() {
    return this.model.read
  }

  canWriteModel() {
    return this.model.write
  }

  canCreateModel() {
    return this.model.writeAllRequired
  }

  canReadField(path) {
    if(!this.fields[path]) return false

    return this.fields[path].read || false
  }

  canWriteField(path) {
    if(!this.fields[path]) return false
    
    return this.fields[path].write || false
  }
}

export class AccessGroups {
  constructor(accessGroups) {
    this.accessGroups = accessGroups
  }

  check(groups) {
    if(!Array.isArray(groups)) groups = [groups]

    for(let group of groups) {
      if(!this.accessGroups.includes(group)) {
        console.warn(`Unkown access group: ${group}`)
      }
    }
  }
}

/**
 * @param {object} field 
 * @param {object} processedRefs 
 * @returns
 */
function recycleSchemaField(field, processedRefs = {}) {
  if(field.ref) {
    if(!processedRefs[field.ref])
      processedRefs[field.ref] = field.subfields
    else {
      field.subfields = processedRefs[field.ref]
      return
    }
  }

  if(field.subfields) {
    for(let f of field.subfields)
      recycleSchemaField(f, processedRefs)
  }
}
