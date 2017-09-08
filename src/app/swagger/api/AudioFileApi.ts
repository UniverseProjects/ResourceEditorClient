/**
 * UPResourceEditor
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * Contact: ostangenberg@universeprojects.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { Http, Headers, URLSearchParams }                    from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType }                     from '@angular/http';

import { Observable }                                        from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models                                           from '../model/models';
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class AudioFileApi {

    protected basePath = 'https://www.universeprojects.com/api/v1';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();

    constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
    }

    /**
     * 
     * @summary Delete audio file for path
     * @param libraryId ID of the library
     * @param treePath Path to delete
     */
    public deleteAudioFile(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.deleteAudioFileWithHttpInfo(libraryId, treePath, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }

    /**
     * 
     * @summary Find audio files with filter
     * @param libraryId ID of the library
     * @param treePath Directory-path
     * @param tag 
     * @param limit limit amount of entities returned
     * @param cursor cursor to fetch a batch (for paging)
     */
    public findAudioFiles(libraryId: number, treePath: string, tag?: Array<string>, limit?: number, cursor?: string, extraHttpRequestParams?: any): Observable<models.InlineResponse2003> {
        return this.findAudioFilesWithHttpInfo(libraryId, treePath, tag, limit, cursor, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }

    /**
     * 
     * @summary Generates an upload-URL for the path
     * @param libraryId ID of the library
     * @param treePath directory path to upload to
     */
    public generateAudioFileUpload(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<models.InlineResponse2002> {
        return this.generateAudioFileUploadWithHttpInfo(libraryId, treePath, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }

    /**
     * 
     * @summary Load audio file for path
     * @param libraryId ID of the library
     * @param treePath Path to load
     */
    public loadAudioFile(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<models.AudioFile> {
        return this.loadAudioFileWithHttpInfo(libraryId, treePath, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }

    /**
     * 
     * @summary Update audio-file for path
     * @param libraryId ID of the library
     * @param treePath Path to update
     * @param body 
     */
    public updateAudioFile(libraryId: number, treePath: string, body: models.AudioFile, extraHttpRequestParams?: any): Observable<models.AudioFile> {
        return this.updateAudioFileWithHttpInfo(libraryId, treePath, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }


    /**
     * Delete audio file for path
     * 
     * @param libraryId ID of the library
     * @param treePath Path to delete
     */
    public deleteAudioFileWithHttpInfo(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/audioFile/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling deleteAudioFile.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling deleteAudioFile.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Delete,
            headers: headers,
            search: queryParameters,
            withCredentials:this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Find audio files with filter
     * 
     * @param libraryId ID of the library
     * @param treePath Directory-path
     * @param tag 
     * @param limit limit amount of entities returned
     * @param cursor cursor to fetch a batch (for paging)
     */
    public findAudioFilesWithHttpInfo(libraryId: number, treePath: string, tag?: Array<string>, limit?: number, cursor?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/audioFiles/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling findAudioFiles.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling findAudioFiles.');
        }
        if (tag) {
            tag.forEach((element) => {
                queryParameters.append('tag', <any>element);
            })
        }

        if (limit !== undefined) {
            queryParameters.set('limit', <any>limit);
        }

        if (cursor !== undefined) {
            queryParameters.set('cursor', <any>cursor);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters,
            withCredentials:this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Generates an upload-URL for the path
     * 
     * @param libraryId ID of the library
     * @param treePath directory path to upload to
     */
    public generateAudioFileUploadWithHttpInfo(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/generateAudioFileUpload/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling generateAudioFileUpload.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling generateAudioFileUpload.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters,
            withCredentials:this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Load audio file for path
     * 
     * @param libraryId ID of the library
     * @param treePath Path to load
     */
    public loadAudioFileWithHttpInfo(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/audioFile/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling loadAudioFile.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling loadAudioFile.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters,
            withCredentials:this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Update audio-file for path
     * 
     * @param libraryId ID of the library
     * @param treePath Path to update
     * @param body 
     */
    public updateAudioFileWithHttpInfo(libraryId: number, treePath: string, body: models.AudioFile, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/audioFile/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling updateAudioFile.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling updateAudioFile.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateAudioFile.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Put,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters,
            withCredentials:this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}