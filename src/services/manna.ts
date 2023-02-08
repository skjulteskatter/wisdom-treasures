import http from "./http"
import config from "../config";

export interface MannaResponse {
    Bible: string,
    url: string,
    book: string,
    refrence: string,
    html: string
}

export async function getManna() : Promise<MannaResponse> {
    let response : string = await http.apifetch(
        config.mannaPath,
        Object.assign(
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "apikey": config.mannaApiKey,
                    "Access-Control-Request-Method": "GET",
                },
            },
        ),
    );

    response = response.replace(/<.*>/g,"").trim();
    const r : MannaResponse = JSON.parse(response);
    return r;
}

export function getContent(r: MannaResponse): string {
    return r.html.match(/(?<=<span\s*class=('|")verse_content('|")>)(.*?)(?=<\/span>)/g)?.[0] ?? "";
}

export function getCopyRight(r: MannaResponse): string {
    return r.html.match(/(?<=<div\s*class=('|")copyright('|")>)(.*?)(?=<\/div>)/g)?.[0] ?? "";
}