import http from "./http"
import config from "../config";
import type { Manna } from "@/classes/manna";
import TestManna from "./TestManna";

export async function getManna(language: string) : Promise<Manna> {
    let response : string = await http.apifetch(
        `${config.mannaPath}?language=${language}`,
        Object.assign(
            {
                method: "GET",
                headers: {
                    "Accept": "*/*",
                },
            },
        ),
        true,
        true,
        "4.0"
    );

    response = response.trim();
    const result : Manna = JSON.parse(response);
    return result;
}

export async function getTestManna(language: string) : Promise<Manna> {
    await delay(1500);
    const arr : Manna[] = TestManna;
    let rand = Math.random();
    rand = Math.round(rand * (arr.length-1));
    return arr[rand];
}

//Remove this
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function getContent(manna: Manna): string {
    return manna.html.match(/(?<=<span\s*class=('|")verse_content('|")>)(.*?)(?=<\/span>)/g)?.[0] ?? "";
}

export function  getCopyRight(manna: Manna): string {
    const wholeCopyright = manna.html.match(/(?<=<div\s*class=('|")copyright('|")>)(.*?)(?=<\/div>)/g)?.[0] ?? "";
    const copyRightWithoutLink = wholeCopyright.replace(getCopyRightLink(manna), "").trim();
    return copyRightWithoutLink;
}

export function getCopyRightLink(manna: Manna): string {
    return manna.html.match(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi)?.[0] ?? "";
}

export function getCopyRightShortLink(manna: Manna): string {
    return manna.html.match(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b/gi)?.[0] ?? "";
}

export function getCopyRightWithShortLink(manna: Manna): string {
    return getCopyRight(manna).replace(getCopyRightLink(manna), getCopyRightShortLink(manna));
}