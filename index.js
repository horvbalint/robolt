export default class __API {
  constructor(axios, prefix, serveStaticPath = 'static', defaultFilter = {}) {
    this.$axios = axios
    this.Prefix = prefix
    this.ServeStaticPath = serveStaticPath
    this.DefaultFilter = defaultFilter
  }

  Create(modelName, data, axiosConfig = {}) {
    return this.$axios.$post(`/${this.Prefix}/create/${modelName}`, data, axiosConfig)
  }

  Read(modelName, options = {}, axiosConfig = {params: {}}) {
    return this.$axios.$get(`/${this.Prefix}/read/${modelName}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        filter: options.filter || this.DefaultFilter,
        projection: options.projection,
        sort: options.sort || {},
        skip: options.skip,
        limit: options.limit,
      },
    })
  }

  Get(modelName, id, options = {}, axiosConfig = {params: {}}) {
    return this.$axios.$get(`/${this.Prefix}/get/${modelName}/${id}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        projection: options.projection,
      }
    })
  }

  Search(modelName, options = {}, axiosConfig = {params: {}}) {
    return this.$axios.$get(`/${this.Prefix}/search/${modelName}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        filter: options.filter || this.DefaultFilter,
        projection: options.projection,
        threshold: options.threshold,
        keys: options.keys,
        depth: options.depth,
        term: options.term,
      }
    })
  }

  Update(modelName, data, axiosConfig = {}) {
    return this.$axios.$patch(`/${this.Prefix}/update/${modelName}`, data, axiosConfig)
  }

  Delete(modelName, id, axiosConfig = {params: {}}) {
    return this.$axios.$delete(`/${this.Prefix}/delete/${modelName}/${id}`, axiosConfig)
  }

  RunService(serviceName, functionName, params, axiosConfig = {}) {
    return this.$axios.$post(`/${this.Prefix}/runner/${serviceName}/${functionName}`, params, axiosConfig)
  }

  GetService(serviceName, functionName, params, axiosConfig = {params: {}}) {
    return this.$axios.$get(`/${this.Prefix}/getter/${serviceName}/${functionName}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        ...params,
      },
    })
  }

  UploadFile(file, percentCallback, axiosConfig = {headers: {}}) {
    let config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data',
      },
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

  GetFile(file, percentCallback, axiosConfig = {}) {
    let path = typeof file == 'string' ? file : file.path
    let config = {
      ...axiosConfig,
      responseType: 'blob'
    }

    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    return this.$axios.$get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)
      .then( blob => {
        let name = file.name // if only the id was given (so file is a string), this will be undefined, but we can't do better

        return new File([blob], name)
      })
  }

  GetFileURL(file, percentCallback, axiosConfig) {
    return new Promise((resolve, reject) => {
      this.GetFile(file, percentCallback, axiosConfig)
        .then( res => resolve(URL.createObjectURL(res)) )
        .catch( err => reject(err) )
    })
  }

  GetThumbnail(file, percentCallback, axiosConfig = {}) {
    let path = typeof file == 'string' ? file : file.thumbnailPath
    let config = {
      ...axiosConfig,
      responseType: 'blob',
    }

    if(percentCallback)
      config.onDownloadProgress = event => {
        let percentage = Math.round((event.loaded * 100) / event.total)
        percentCallback(percentage, event)
      }

    return this.$axios.$get(`/${this.Prefix}/${this.ServeStaticPath}/${path}`, config)
  }

  GetThumbnailURL(file, percentCallback, axiosConfig) {
    return new Promise((resolve, reject) => {
      this.GetThumbnail(file, percentCallback, axiosConfig)
        .then( res => resolve(URL.createObjectURL(res)) )
        .catch( err => reject(err) )
    })
  }

  CloneFile(file, axiosConfig = {}) {
    let id = typeof file == 'string' ? file : file._id
 
    return this.$axios.$post(`/${this.Prefix}/fileclone/${id}`, axiosConfig)
  }

  DeleteFile(file, axiosConfig = {}) {
    let id = typeof file == 'string' ? file : file._id

    return this.$axios.$delete(`/${this.Prefix}/filedelete/${id}`, axiosConfig)
  }

  Model(modelName = null, axiosConfig = {}) {
    if(!modelName)
      return this.$axios.$get(`/${this.Prefix}/model`, axiosConfig)
    else
      return this.$axios.$get(`/${this.Prefix}/model/${modelName}`, axiosConfig)
  }

  Schema(modelName, axiosConfig = {}) {
    return this.$axios.$get(`/${this.Prefix}/schema/${modelName}`, axiosConfig)
  }

  Fields(modelName, depth, axiosConfig = {params: {}}) {
    return this.$axios.$get(`/${this.Prefix}/fields/${modelName}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        depth
      }
    })
  }

  Count(modelName, filter = this.DefaultFilter, axiosConfig = {params: {}}) {
    return new Promise((resolve, reject) => {
      this.$axios.$get(`${this.Prefix}/count/${modelName}`, {
        ...axiosConfig,
        params: {
          ...axiosConfig.params,
          filter,
        },
      })
      .then( res => resolve(Number(res)) )
      .catch( err => reject(err) )
    })
  }

  SearchKeys(modelName, depth, axiosConfig = {params: {}}) {
    return this.$axios.$get(`${this.Prefix}/searchkeys/${modelName}`, {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        depth
      },
    })
  }

  RecycledSchema(modelName, axiosConfig) {
    return this.Schema(modelName, axiosConfig)
      .then( fields => {
        recycleSchemaField({subfields: fields})
        return fields
      })
  }

  Accesses(modelName, axiosConfig = {}) {
    return this.$axios.$get(`${this.Prefix}/accesses/${modelName}`, axiosConfig)
      .then( accesses => new Accesses(accesses) )
  }

  AccessGroups(axiosConfig = {}) {
    return this.$axios.$get(`${this.Prefix}/accessesGroups`, axiosConfig)
      .then( accesses => new AccessGroups(accesses) )
  }
}

class Accesses {
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

class AccessGroups {
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
