import config from "../config";
import { auth } from "./auth";
import { log } from '@/services/env'

export type Result<T> = {
    result: T;
    success: boolean;
    error: string;
    lastUpdated: string;
}

class ResultError extends Error {
    status: number;
    value: string;
  
    constructor(status: number, value: string) {
        super(value);
        this.name = 'ResultError';
        this.status = status;
        this.value = value;
    }
}

class Http {
    public async getCountry(): Promise<string> {
        let entry = localStorage.getItem("country");

        if (!entry && entry?.length != 2) {
            entry = await this.get<string>("api/Session/Country");
            localStorage.setItem("country", entry);
        }

        return entry;
    }

    public validateResponse(response: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else if (response.status === 401) {
                // auth.startLogin();
                // resolve(null);
                reject({status: response.status, value: "Unauthorized"});
            } else {
                // error.response = response;
                response.text().then(t =>  {
                    reject({status: response.status, value: t});
                });
            }
        });
    }

    public async parseJson(response: Response, json = true) {
        if (json) {
            const result = await response.text();
            try {
                return JSON.parse(result);
            }
            catch {
                return result;
            }
        }
        return await response.arrayBuffer();
    }

    /**
     * API GET request
     *
     * @param  {String} path
     * @return {Promise}
     */
    public async get<T>(path: string, bypassAuth?: boolean, json? :boolean, apiVersion?: string, noCors: boolean = false): Promise<T> {
        try {
            const result = await this.apifetch(
                path,
                {
                    method: "GET",
                    headers: {
                    },
                    mode: noCors ? "no-cors" : "cors"
                }, 
                bypassAuth,
                json,
                apiVersion,
            ) as Result<T> | T;

            return apiVersion?.includes("4") ? result as T : (result as Result<T>).result;
        } catch (e) {
            if (noCors && e instanceof ResultError) return undefined as T;
            throw e;
        }
    }

    public async getWithResult<T>(path: string): Promise<Result<T>> {
        const result = await this.apifetch(
            path,
            {
                method: "GET",
            },
            false,
        ) as Result<T>;

        return result;
    }

    /**
     * API POST request
     *
     * @param  {String} path
     * @param  {Object} content
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async post<T, Y = unknown>(
        path: string,
        content?: Y,
        options?: object,
        bypassAuth? :boolean, 
        json? :boolean, 
        apiVersion?: string,

    ): Promise<T> {

        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "POST",
                    body: content ? JSON.stringify(content) : undefined,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                options || {},
            ),
            bypassAuth,
            json,
            apiVersion,
        ) as Result<T> | T;

        return apiVersion?.includes("4") ? result as T : (result as Result<T>).result;
    }

    /**
     * API PATCH request
     *
     * @param  {String} path
     * @param  {Object} content
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async patch<T>(
        path: string,
        content: unknown,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            {
                method: "PATCH",
                body: JSON.stringify(content),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        ) as Result<T>;
        return result.result;
    }

    /**
     * API DELETE request
     *
     * @param  {String} path
     * @param  {Object} query (optional)
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async ["delete"]<T>(
        path: string,
        content?: unknown,
        options?: object,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "DELETE",
                    body: content ? JSON.stringify(content) : undefined,
                    headers: content ? {
                        "Content-Type": "application/json",
                    } : undefined,
                },
                options || {},
            ),
        ) as Result<T>;

        return result.result;
    }

    /**
     * API PUT request
     *
     * @param  {String} path
     * @param  {Object} content
     * @return {Promise}
     */
    public async put<T, Y = T>(
        path: string,
        content: Y,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "PUT",
                    body: JSON.stringify(content),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            ),
        ) as Result<T>;
        return result.result;
    }

    private _token: string | null = null;

    public setToken(value: string) {
        this._token = value;
    }

    public async uploadAndDownload(path: string, content: string) {
        path = `${config.api.basePath}${path}`;
        const token : string = this._token ?? (await auth.currentUser?.getIdToken() ?? "");
        if (!token) throw new Error("No Authorization token available " + path);

        const headers = {
            "Authorization": `Bearer ${token}`,
            "X-Api-Version": "3.0",
            "Content-Type": "application/json",
        };

        try {
            const result = await fetch(path, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    content,
                }),
            });
            return result;
        }
        catch (e) {
            const error = e as ResultError;
            log && console.log(error.value);
        }
    }

    public async apifetch(path: string, options: RequestInit, bypassAuth = false, json = true, apiVersion = "3.0") {
        path = path.startsWith("http") ? path : `${config.api.basePath}${path}`;
        const token : string = bypassAuth ? "" : this._token ?? (await auth.currentUser?.getIdToken() ?? "");
        if (!token && !bypassAuth) throw new Error("No Authorization token available " + path);

        const headers = Object.assign({
            "Authorization": `Bearer ${token}`,
            "X-Api-Version": apiVersion,
        }, options.headers);

        const o = Object.assign(
            options, {headers});
        try {
            const result = await fetch(path, o)
                .then(this.validateResponse)
                .then((r) => this.parseJson(r, json));
            return result;
        }
        catch (e) {
            const error = e as ResultError;
            log && console.log(error.value);
            throw e;
        }
    }
}

const http = new Http();
export default http;
