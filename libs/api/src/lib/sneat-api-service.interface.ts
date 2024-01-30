import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IHttpRequestOptions {
	headers?: HttpHeaders | Record<string, string | string[]>;
	observe?: 'body';
	params?: HttpParams | Record<string, string | string[]>;
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
}

// const SneatApiService = new InjectionToken('ISneatApiService');

export interface ISneatApiResponse<T> {
	// TODO: Either use or delete
	data: T;
}

export interface ISneatApiService {
	post<I, O>(
		endpoint: string,
		body: I,
		options?: IHttpRequestOptions,
	): Observable<O>;

	put<I, O>(
		endpoint: string,
		body: I,
		options?: IHttpRequestOptions,
	): Observable<O>;

	get<T>(
		endpoint: string,
		params?: HttpParams,
		options?: IHttpRequestOptions,
	): Observable<T>;

	getAsAnonymous<T>(
		endpoint: string,
		params?: HttpParams,
		options?: IHttpRequestOptions,
	): Observable<T>;
}
