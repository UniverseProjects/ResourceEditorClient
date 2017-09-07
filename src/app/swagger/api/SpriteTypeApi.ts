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
export class SpriteTypeApi {

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
     * @summary Copies an animated sprite-type to a new path/directory
     * @param libraryId ID of the library
     * @param treePath Path to H5l
     * @param from 
     * @param to This will be interpreted as a new file-name or a directory if ít ends in a /
     */
    public copyAnimatedSpriteType(libraryId: number, treePath: string, from?: string, to?: string, extraHttpRequestParams?: any): Observable<string> {
        return this.copyAnimatedSpriteTypeWithHttpInfo(libraryId, treePath, from, to, extraHttpRequestParams)
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
     * @summary Copies a sprite-type to a new path/directory
     * @param libraryId ID of the library
     * @param treePath Path to H5l
     * @param from 
     * @param to This will be interpreted as a new file-name or a directory if ít ends in a /
     */
    public copySpriteType(libraryId: number, treePath: string, from?: string, to?: string, extraHttpRequestParams?: any): Observable<string> {
        return this.copySpriteTypeWithHttpInfo(libraryId, treePath, from, to, extraHttpRequestParams)
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
     * @summary Create SpriteType for path
     * @param libraryId ID of the library
     * @param treePath Path to create the spriteType at
     * @param body 
     */
    public createSpriteType(libraryId: number, treePath: string, body: models.SpriteType, extraHttpRequestParams?: any): Observable<models.SpriteType> {
        return this.createSpriteTypeWithHttpInfo(libraryId, treePath, body, extraHttpRequestParams)
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
     * @summary Delete SpriteType for id
     * @param libraryId ID of the library
     * @param treePath Image path to load
     */
    public deleteSpriteType(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.deleteSpriteTypeWithHttpInfo(libraryId, treePath, extraHttpRequestParams)
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
     * @summary Find spriteType with filter
     * @param libraryId ID of the library
     * @param treePath directory-path
     * @param tag 
     * @param limit limit amount of entities returned
     * @param cursor cursor to fetch a batch (for paging)
     */
    public findSpriteType(libraryId: number, treePath: string, tag?: Array<string>, limit?: number, cursor?: string, extraHttpRequestParams?: any): Observable<models.InlineResponse2004> {
        return this.findSpriteTypeWithHttpInfo(libraryId, treePath, tag, limit, cursor, extraHttpRequestParams)
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
     * @summary Load SpriteType for path
     * @param libraryId ID of the library
     * @param treePath Path to load
     */
    public loadSpriteType(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<models.SpriteType> {
        return this.loadSpriteTypeWithHttpInfo(libraryId, treePath, extraHttpRequestParams)
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
     * @summary Update SpriteType for path. Currently only uses the tags
     * @param libraryId ID of the library
     * @param treePath Path to update
     * @param body 
     */
    public updateSpriteType(libraryId: number, treePath: string, body: models.SpriteType, extraHttpRequestParams?: any): Observable<models.SpriteType> {
        return this.updateSpriteTypeWithHttpInfo(libraryId, treePath, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json() || {};
                }
            });
    }


    /**
     * Copies an animated sprite-type to a new path/directory
     * 
     * @param libraryId ID of the library
     * @param treePath Path to H5l
     * @param from 
     * @param to This will be interpreted as a new file-name or a directory if ít ends in a /
     */
    public copyAnimatedSpriteTypeWithHttpInfo(libraryId: number, treePath: string, from?: string, to?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/copyAnimatedSpriteType'
                    .replace('${' + 'libraryId' + '}', String(libraryId));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling copyAnimatedSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling copyAnimatedSpriteType.');
        }
        if (treePath !== undefined) {
            queryParameters.set('treePath', <any>treePath);
        }

        if (from !== undefined) {
            queryParameters.set('from', <any>from);
        }

        if (to !== undefined) {
            queryParameters.set('to', <any>to);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
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
     * Copies a sprite-type to a new path/directory
     * 
     * @param libraryId ID of the library
     * @param treePath Path to H5l
     * @param from 
     * @param to This will be interpreted as a new file-name or a directory if ít ends in a /
     */
    public copySpriteTypeWithHttpInfo(libraryId: number, treePath: string, from?: string, to?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/copySpriteType'
                    .replace('${' + 'libraryId' + '}', String(libraryId));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling copySpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling copySpriteType.');
        }
        if (treePath !== undefined) {
            queryParameters.set('treePath', <any>treePath);
        }

        if (from !== undefined) {
            queryParameters.set('from', <any>from);
        }

        if (to !== undefined) {
            queryParameters.set('to', <any>to);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
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
     * Create SpriteType for path
     * 
     * @param libraryId ID of the library
     * @param treePath Path to create the spriteType at
     * @param body 
     */
    public createSpriteTypeWithHttpInfo(libraryId: number, treePath: string, body: models.SpriteType, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/spriteType/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling createSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling createSpriteType.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createSpriteType.');
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
            method: RequestMethod.Post,
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

    /**
     * Delete SpriteType for id
     * 
     * @param libraryId ID of the library
     * @param treePath Image path to load
     */
    public deleteSpriteTypeWithHttpInfo(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/spriteType/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling deleteSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling deleteSpriteType.');
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
     * Find spriteType with filter
     * 
     * @param libraryId ID of the library
     * @param treePath directory-path
     * @param tag 
     * @param limit limit amount of entities returned
     * @param cursor cursor to fetch a batch (for paging)
     */
    public findSpriteTypeWithHttpInfo(libraryId: number, treePath: string, tag?: Array<string>, limit?: number, cursor?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/spriteTypes/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling findSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling findSpriteType.');
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
     * Load SpriteType for path
     * 
     * @param libraryId ID of the library
     * @param treePath Path to load
     */
    public loadSpriteTypeWithHttpInfo(libraryId: number, treePath: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/spriteType/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling loadSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling loadSpriteType.');
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
     * Update SpriteType for path. Currently only uses the tags
     * 
     * @param libraryId ID of the library
     * @param treePath Path to update
     * @param body 
     */
    public updateSpriteTypeWithHttpInfo(libraryId: number, treePath: string, body: models.SpriteType, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + '/library/${libraryId}/spriteType/${treePath}'
                    .replace('${' + 'libraryId' + '}', String(libraryId))
                    .replace('${' + 'treePath' + '}', String(treePath));

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'libraryId' is not null or undefined
        if (libraryId === null || libraryId === undefined) {
            throw new Error('Required parameter libraryId was null or undefined when calling updateSpriteType.');
        }
        // verify required parameter 'treePath' is not null or undefined
        if (treePath === null || treePath === undefined) {
            throw new Error('Required parameter treePath was null or undefined when calling updateSpriteType.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateSpriteType.');
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
