export default class __API {
  constructor(axios, prefix, serveStaticPath = 'static', defaultFilter = {}) {
    this.$axios = axios
    this.Prefix = prefix
    this.ServeStaticPath = serveStaticPath
    this.DefaultFilter = defaultFilter
  }

  Count(modelName, filter = this.DefaultFilter) {
    return new Promise((resolve, reject) => {
      this.$axios.$get(`${this.Prefix}/count/${modelName}`, {
        params: {filter},
      })
      .then( res => resolve(res.count) )
      .catch( err => reject(err) )
    })
  }

  GetService(serviceName, functionName, params) {
    return this.$axios.$get(`/${this.Prefix}/getter/${serviceName.toLowerCase()}/${functionName}`, {
      params: params,
    })
  }

  RunService(serviceName, functionName, params) {
    return this.$axios.$post(`/${this.Prefix}/runner/${serviceName.toLowerCase()}/${functionName}`, params)
  }

  Schema(modelName) {
    return this.$axios.$get(`/${this.Prefix}/schema/${modelName}`)
  }

  SchemaKeys(modelName, depth) {
    return this.$axios.$post(`/${this.Prefix}/schemakeys/${modelName}`, {
      depth: depth,
    })
  }

  Read(modelName, options = {}) {
    return this.$axios.$get(`/${this.Prefix}/${modelName}/find`, {
      params: {
        filter: options.filter || this.DefaultFilter,
        projection: options.projection,
        sort: options.sort || {},
        skip: options.skip,
        limit: options.limit,
      }
    })
  }

  Get(modelName, id, options = {}) {
    return this.$axios.$get(`/${this.Prefix}/${modelName}/${id}`, {
      params: {
        projection: options.projection,
      }
    })
  }

  Create(modelName, data) {
    return this.$axios.$post(`/${this.Prefix}/${modelName}`, data)
  }

  UploadFile(file, percentCallback) {
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

    return this.$axios.$post(`/${this.Prefix}/fileupload`, formData, config)
  }

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

  GetFileURL(file, percentCallback) {
    return new Promise((resolve, reject) => {
      this.GetFile(file, percentCallback)
        .then( res => resolve(URL.createObjectURL(res)) )
        .catch( err => reject(err) )
    })
  }

  GetFile(file, percentCallback) {
    let path = typeof file == 'string' ? file : file.path
    let config = {responseType: 'blob'}
    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    return this.$axios.$get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)
  }

  GetThumbnailURL(file, percentCallback) {
    return new Promise((resolve, reject) => {
      this.GetThumbnail(file, percentCallback)
        .then( res => resolve(URL.createObjectURL(res)) ) 
        .catch( err => reject(err) )
    })
  }

  GetThumbnail(file, percentCallback) {
    let path = typeof file == 'string' ? file : file.thumbnailPath
    let config = {responseType: 'blob'}
    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    return this.$axios.$get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)
  }

  DeleteFile(file) {
    let id = typeof file == 'string' ? file : file._id

    return this.$axios.$delete(`/${this.Prefix}/filedelete/${id}`)
  }

  Update(modelName, data) {
    return this.$axios.$patch(`/${this.Prefix}/${modelName}`, data)
  }

  Delete(modelName, id) {
    return this.$axios.$delete(`/${this.Prefix}/${modelName}/${id}`)
  }

  TableHeaders(modelName) {
    return this.$axios.$get(`/${this.Prefix}/tableheaders/${modelName}`)
  }
}
