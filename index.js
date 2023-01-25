export default class __API {
  constructor(axios, prefix, serveStaticPath = 'static', defaultFilter = {}) {
    this.$axios = axios
    this.Prefix = prefix
    this.ServeStaticPath = serveStaticPath
    this.DefaultFilter = defaultFilter
  }

  Create(modelName, data) {
    return this.$axios.$post(`/${this.Prefix}/create/${modelName}`, data)
  }

  Read(modelName, options = {}) {
    return this.$axios.$get(`/${this.Prefix}/read/${modelName}`, {
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
    return this.$axios.$get(`/${this.Prefix}/get/${modelName}/${id}`, {
      params: {
        projection: options.projection,
      }
    })
  }

  Search(modelName, options = {}) {
    return this.$axios.$get(`/${this.Prefix}/search/${modelName}`, {
      params: {
        filter: options.filter || this.DefaultFilter,
        projection: options.projection,
        threshold: options.threshold,
        keys: options.keys,
        depth: options.depth,
        term: options.term,
      }
    })
  }

  Update(modelName, data) {
    return this.$axios.$patch(`/${this.Prefix}/update/${modelName}`, data)
  }

  Delete(modelName, id) {
    return this.$axios.$delete(`/${this.Prefix}/delete/${modelName}/${id}`)
  }

  RunService(serviceName, functionName, params) {
    return this.$axios.$post(`/${this.Prefix}/runner/${serviceName}/${functionName}`, params)
  }

  GetService(serviceName, functionName, params) {
    return this.$axios.$get(`/${this.Prefix}/getter/${serviceName}/${functionName}`, {
      params: params,
    })
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

  GetFile(file, percentCallback) {
    let path = typeof file == 'string' ? file : file.path
    let config = {responseType: 'blob'}
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

  GetFileURL(file, percentCallback) {
    return new Promise((resolve, reject) => {
      this.GetFile(file, percentCallback)
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

  GetThumbnailURL(file, percentCallback) {
    return new Promise((resolve, reject) => {
      this.GetThumbnail(file, percentCallback)
        .then( res => resolve(URL.createObjectURL(res)) )
        .catch( err => reject(err) )
    })
  }

  DeleteFile(file) {
    let id = typeof file == 'string' ? file : file._id

    return this.$axios.$delete(`/${this.Prefix}/filedelete/${id}`)
  }

  Model(modelName = null) {
    if(!modelName)
      return this.$axios.$get(`/${this.Prefix}/model`)
    else
      return this.$axios.$get(`/${this.Prefix}/model/${modelName}`)
  }

  Schema(modelName) {
    return this.$axios.$get(`/${this.Prefix}/schema/${modelName}`)
  }

  Fields(modelName, depth) {
    return this.$axios.$get(`/${this.Prefix}/fields/${modelName}`, {
      params: {
        depth
      }
    })
  }

  Count(modelName, filter = this.DefaultFilter) {
    return new Promise((resolve, reject) => {
      this.$axios.$get(`${this.Prefix}/count/${modelName}`, {
        params: {filter},
      })
      .then( res => resolve(Number(res)) )
      .catch( err => reject(err) )
    })
  }

  SearchKeys(modelName, depth) {
    return this.$axios.$get(`${this.Prefix}/searchkeys/${modelName}`, {
      params: {depth},
    })
  }

  RecycledSchema(modelName) {
    return this.Schema(modelName)
      .then( fields => {
        recycleSchemaField({subfields: fields})
        return fields
      })
  }

  Accesses(modelName) {
    return this.$axios.$get(`${this.Prefix}/accesses/${modelName}`)
      .then( accesses => new Accesses(accesses) )
  }

  AccessGroups() {
    return this.$axios.$get(`${this.Prefix}/accessesGroups`)
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
    if(!Array.isArray(groups)) groups = [group]

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
