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
 * @typedef RoboField
 * @prop {string} name
 * @prop {string} key
 * @prop {string} type
 * @prop {string[]} [enum]
 * @prop {boolean} [required]
 * @prop {boolean} [isArray]
 * @prop {boolean} [marked]
 * @prop {boolean} [hidden]
 * @prop {any} [default]
 * @prop {Record<string, any>} [props]
 * @prop {string} [ref]
 * @prop {RoboField[]} [subfields]
*/
export default class Robolt {
    /**
     * @param {AxiosInstance} axios A preconfigured axios instance
     * @param {string} prefix The prefix that was used when the routes of robogo were registered to express.js
     * @param {string} [serveStaticPath='static'] The path where the files are static hosted. Same as in the constructor of robogo
     */
    constructor(axios: AxiosInstance, prefix: string, serveStaticPath?: string);
    $axios: import("axios").AxiosInstance;
    Prefix: string;
    ServeStaticPath: string;
    /**
     * Sends a POST request to the '/create/:model' route of robogo with the given data.
     * @template {MongoDocument} T
     * @param {string} modelName Name of the model registered in robogo
     * @param {Omit<T, '_id'>} data Object matching the schema of the model
     * @returns {Promise<T>} The created document
     */
    Create<T extends MongoDocument>(modelName: string, data: Omit<T, "_id">): Promise<T>;
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
    Read<T_1 extends MongoDocument>(modelName: string, options?: {
        /**
         * Mongodb query
         */
        filter?: object;
        /**
         * Fields to include in results. Uses MongoDB projection.
         */
        projection?: Array<string>;
        /**
         * Mongodb sort - https://docs.mongodb.com/manual/reference/method/cursor.sort/index.html
         */
        sort?: object;
        /**
         * The number of documents to skip in the results set.
         */
        skip?: number;
        /**
         * The number of documents to include in the results set.
         */
        limit?: number;
    }): Promise<T_1[]>;
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
    Get<T_2 extends MongoDocument>(modelName: string, id: string, options?: {
        /**
         * Fields to include in results. Uses MongoDB projection.
         */
        projection?: Array<string>;
    }): Promise<T_2>;
    /**
     * Sends a PATCH request to the '/update/:model' route of robogo with the given data.
     * @template {MongoDocument} T
     * @param {string} modelName
     * @param {Partial<T> & MongoDocument} data
     * @returns {Promise<object>} The result of the MongoDB update operation
     */
    Update<T_3 extends MongoDocument>(modelName: string, data: Partial<T_3> & MongoDocument): Promise<object>;
    /**
     * Sends a DELETE request to the '/delete/:model/:id' route of robogo with the given document _id.
     * @param {string} modelName
     * @param {string} id
     * @returns {Promise}
     */
    Delete(modelName: string, id: string): Promise<any>;
    /**
     * Sends a POST request to the '/runner/:service/:function' route of robogo with the given data.
     * @param {string} serviceName
     * @param {string} functionName
     * @param {object} [params]
     * @returns {Promise}
     */
    RunService(serviceName: string, functionName: string, params?: object): Promise<any>;
    /**
     * Sends a GET request to the '/getter/:service/:function' route of robogo with the given data.
     * @param {string} serviceName
     * @param {string} functionName
     * @param {object} [params]
     * @returns {Promise}
     */
    GetService(serviceName: string, functionName: string, params?: object): Promise<any>;
    /**
     * Sends a POST (multipart/form-data) request to the '/fileupload' route of robogo with the given file.
     * @param {File} file
     * @param {(percent: number, event: any) => {}} [percentCallback]
     * @returns
     */
    UploadFile(file: File, percentCallback?: (percent: number, event: any) => {}): Promise<any>;
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
    GetFileURLs(file: RoboFile): {
        absolutePath: string;
        relativePath: string;
        absoluteThumbnailPath?: string;
        relativeThumbnailPath?: string;
    };
    /**
     * Downloads the file for a RoboFile document from robogo.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @param {(percent: number, event: any) => {}} [percentCallback]
     * @returns {Promise<File>}
     */
    GetFile(file: RoboFile | string, percentCallback?: (percent: number, event: any) => {}): Promise<File>;
    /**
     * Downloads the file for a RoboFile document from robogo and returns a local URL for it.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @param {(percent: number, event: any) => {}} [percentCallback]
     * @returns {Promise<string>}
     */
    GetFileURL(file: RoboFile | string, percentCallback?: (percent: number, event: any) => {}): Promise<string>;
    /**
     * Downloads the thumbnail file for a RoboFile document from robogo.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @param {(percent: number, event: any) => {}} [percentCallback]
     * @returns {Promise<File>}
     */
    GetThumbnail(file: RoboFile | string, percentCallback?: (percent: number, event: any) => {}): Promise<File>;
    /**
     * Downloads the thumbnail file for a RoboFile document from robogo and returns a local URL for it.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @param {(percent: number, event: any) => {}} [percentCallback]
     * @returns {Promise<string>}
     */
    GetThumbnailURL(file: RoboFile | string, percentCallback?: (percent: number, event: any) => {}): Promise<string>;
    /**
     * Sends a POST request to the '/fileclone/:id' route of robogo with the given file id.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @returns {Promise<File>}
     */
    CloneFile(file: RoboFile | string): Promise<File>;
    /**
     * Sends a DELETE request to the '/filedelete/:id' route of robogo with the given file id.
     * @param {RoboFile|string} file RoboFile instance object or its _id
     * @returns {Promise}
     */
    DeleteFile(file: RoboFile | string): Promise<any>;
    /**
     * Sends a GET request to the '/model' or the 'model/:model' route of robogo, depending on wether the modelName parameter was given.
     * @param {string|null} [modelName]
     * @returns {Promise<object|object[]>}
     */
    Model(modelName?: string | null): Promise<object | object[]>;
    /**
     * Sends a GET request to the '/schema/:model' route of robogo.
     * @param {string} modelName
     * @returns {Promise<RoboField[]>}
     */
    Schema(modelName: string): Promise<RoboField[]>;
    /**
     * Sends a GET request to the '/fields/:model' route of robogo.
     * @param {string} modelName
     * @param {number} [depth]
     * @returns {Promise<RoboField[]>}
     */
    Fields(modelName: string, depth?: number): Promise<RoboField[]>;
    /**
     * Sends a GET request to the '/count/:model' route of robogo.
     * @param {string} modelName
     * @param {object} filter
     * @returns {Promise<number>}
     */
    Count(modelName: string, filter: object): Promise<number>;
    /**
     * Returns the same result as the Schema method, but reintroduces circular references, that were stripped out by Robogo before sending the data to the frontend.
     * @param {string} modelName
     * @returns {Promise<object>}
     */
    RecycledSchema(modelName: string): Promise<object>;
    /**
     * Sends a GET request to the '/accesses/:modelName' route of robogo.
     * @param {string} modelName
     * @returns {Promise<Accesses>}
     */
    Accesses(modelName: string): Promise<Accesses>;
    /**
     * Sends a GET request to the '/accessGroups' route of robogo.
     * @returns {Promise<AccessGroups>}
     */
    AccessGroups(): Promise<AccessGroups>;
}
export class Accesses {
    constructor(accesses: any);
    model: any;
    fields: any;
    canReadModel(): any;
    canWriteModel(): any;
    canCreateModel(): any;
    canReadField(path: any): any;
    canWriteField(path: any): any;
}
export class AccessGroups {
    constructor(accessGroups: any);
    accessGroups: any;
    check(groups: any): void;
}
export type AxiosInstance = import('axios').AxiosInstance;
export type MongoDocument = {
    _id: string;
};
export type RoboFile = {
    _id: string;
    name: string;
    path: string;
    size: number;
    /**
     * MIME type
     */
    type?: string;
    extension: string;
    isImage: boolean;
    thumbnailPath?: string;
    uploadDate: Date;
};
export type RoboField = {
    name: string;
    key: string;
    type: string;
    enum?: string[];
    required?: boolean;
    isArray?: boolean;
    marked?: boolean;
    hidden?: boolean;
    default?: any;
    props?: Record<string, any>;
    ref?: string;
    subfields?: RoboField[];
};
//# sourceMappingURL=index.d.ts.map