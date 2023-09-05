/**
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */
/**
 * @typedef Document
 * @prop {string} _id
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
     * @param {string} modelName Name of the model registered in robogo
     * @param {object} data Object matching the schema of the model
     * @returns {Promise<Document>} The created document
     */
    Create(modelName: string, data: object): Promise<Document>;
    /**
     * @typedef ReadOptions
     * @prop {object} filter Mongodb query
     * @prop {Array<string>} [projection] Fields to include in results. Uses MongoDB projection.
     * @prop {object} [sort] Mongodb sort - https://docs.mongodb.com/manual/reference/method/cursor.sort/index.html
     * @prop {number} [skip] The number of documents to skip in the results set.
     * @prop {number} [limit] The number of documents to include in the results set.
     */
    /**
     * Sends a GET request to the '/read/:model' route of robogo with the given data.
     * @param {string} modelName
     * @param {ReadOptions} options
     * @returns {Promise<Array<Document>>}
     */
    Read(modelName: string, options?: {
        /**
         * Mongodb query
         */
        filter: object;
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
    }): Promise<Array<Document>>;
    /**
     * @typedef GetOptions
     * @prop {Array<string>} [projection] Fields to include in results. Uses MongoDB projection.
     */
    /**
     * Sends a GET request to the '/get/:model/:id' route of robogo with the given data.
     * @param {string} modelName
     * @param {string} id
     * @param {GetOptions} options
     * @returns {Promise<Document|null>}
     */
    Get(modelName: string, id: string, options?: {
        /**
         * Fields to include in results. Uses MongoDB projection.
         */
        projection?: Array<string>;
    }): Promise<Document | null>;
    /**
     * Sends a PATCH request to the '/update/:model' route of robogo with the given data.
     * @param {string} modelName
     * @param {Document} data
     * @returns {Promise<object>} The result of the MongoDB update operation
     */
    Update(modelName: string, data: Document): Promise<object>;
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
     * @param {object} params
     * @returns {Promise}
     */
    RunService(serviceName: string, functionName: string, params: object): Promise<any>;
    /**
     * Sends a GET request to the '/getter/:service/:function' route of robogo with the given data.
     * @param {string} serviceName
     * @param {string} functionName
     * @param {object} params
     * @returns {Promise}
     */
    GetService(serviceName: string, functionName: string, params: object): Promise<any>;
    /**
     * Sends a POST (multipart/form-data) request to the '/fileupload' route of robogo with the given file.
     * @param {File} file
     * @param {(percent: number, event: any) => {}} percentCallback
     * @returns
     */
    UploadFile(file: File, percentCallback: (percent: number, event: any) => {}): Promise<any>;
    /**
     * Returns the file's absolute and relative URLs where it is static hosted by robogo. If a thumbnail was also created it also returns the thumbnail's URLs.
     * @param {object} file RoboFile instance object
     * @returns {{
     *  absolutePath: string,
     *  relativePath: string,
     *  absoluteThumbnailPath?: string,
     *  relativeThumbnailPath?: string,
     * }}
     */
    GetFileURLs(file: object): {
        absolutePath: string;
        relativePath: string;
        absoluteThumbnailPath?: string;
        relativeThumbnailPath?: string;
    };
    /**
     * Downloads the file for a RoboFile document from robogo.
     * @param {object} file RoboFile instance object
     * @param {(percent: number, event: any) => {}} percentCallback
     * @returns {Promise<File>}
     */
    GetFile(file: object, percentCallback: (percent: number, event: any) => {}): Promise<File>;
    /**
     * Downloads the file for a RoboFile document from robogo and returns a local URL for it.
     * @param {object} file RoboFile instance object
     * @param {(percent: number, event: any) => {}} percentCallback
     * @returns {Promise<string>}
     */
    GetFileURL(file: object, percentCallback: (percent: number, event: any) => {}): Promise<string>;
    /**
     * Downloads the thumbnail file for a RoboFile document from robogo.
     * @param {object} file RoboFile instance object
     * @param {(percent: number, event: any) => {}} percentCallback
     * @returns {Promise<File>}
     */
    GetThumbnail(file: object, percentCallback: (percent: number, event: any) => {}): Promise<File>;
    /**
     * Downloads the thumbnail file for a RoboFile document from robogo and returns a local URL for it.
     * @param {object} file RoboFile instance object
     * @param {(percent: number, event: any) => {}} percentCallback
     * @returns {Promise<string>}
     */
    GetThumbnailURL(file: object, percentCallback: (percent: number, event: any) => {}): Promise<string>;
    /**
     * Sends a POST request to the '/fileclone/:id' route of robogo with the given file id.
     * @param {object|string} file RoboFile instance object or its _id
     * @returns {Promise<File>}
     */
    CloneFile(file: object | string): Promise<File>;
    /**
     * Sends a DELETE request to the '/filedelete/:id' route of robogo with the given file id.
     * @param {object|string} file RoboFile instance object or its _id
     * @returns {Promise}
     */
    DeleteFile(file: object | string): Promise<any>;
    /**
     * Sends a GET request to the '/model' or the 'model/:model' route of robogo, depending on wether the modelName parameter was given.
     * @param {string|null} [modelName]
     * @returns {Promise<object|object[]>}
     */
    Model(modelName?: string | null): Promise<object | object[]>;
    /**
     * Sends a GET request to the '/schema/:model' route of robogo.
     * @param {string} modelName
     * @returns {Promise<object>}
     */
    Schema(modelName: string): Promise<object>;
    /**
     * Sends a GET request to the '/fields/:model' route of robogo.
     * @param {string} modelName
     * @param {number} [depth]
     * @returns {Promise<object>}
     */
    Fields(modelName: string, depth?: number): Promise<object>;
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
export type AxiosInstance = import('axios').AxiosInstance;
export type Document = {
    _id: string;
};
declare class Accesses {
    constructor(accesses: any);
    model: any;
    fields: any;
    canReadModel(): any;
    canWriteModel(): any;
    canCreateModel(): any;
    canReadField(path: any): any;
    canWriteField(path: any): any;
}
declare class AccessGroups {
    constructor(accessGroups: any);
    accessGroups: any;
    check(groups: any): void;
}
export {};
//# sourceMappingURL=index.d.ts.map