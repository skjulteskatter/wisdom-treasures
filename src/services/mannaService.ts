import http from "./http"
import config from "../config";
import type { Manna } from "@/classes/manna";

export async function getManna(language: string) : Promise<Manna> {
    language = "no";
    const manna : Manna = await http.apifetch(
        `${config.mannaPath}?language=${language}`,
        Object.assign(
            {
                method: "GET",
                headers: {
                    "Accept": "*/*",
                },
            },
        ),
        false,
        true,
        "4.0"
    ) as Manna;

    return manna;
}

export function getContent(manna: Manna): string {
    return manna.html.match(/(?<=<span\s*class=('|")verse_content('|")>)(.*?)(?=<\/span>)/g)?.[0] ?? "";
}

export function  getCopyRight(manna: Manna): string {
    const wholeCopyright = manna.html.match(/(?<=<div\s*class=('|")copyright('|")>)(.*?)(?=<\/div>)/g)?.[0] ?? "";
    //const copyRightWithoutLink = wholeCopyright.replace(getCopyRightLink(manna), "").trim();
    return wholeCopyright;
}

function getCopyRightLink(manna: Manna): string {
    return manna.html.match(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi)?.[0] ?? "";
}

function getCopyRightShortLink(manna: Manna): string {
    return manna.html.match(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b/gi)?.[0] ?? "";
}

export function getCopyRightWithShortLinkHTML(manna: Manna): string {
    let copyRight = getCopyRight(manna);
    const copyRightLink = getCopyRightLink(manna);
    const copyRightShortLink = getCopyRightShortLink(manna);
    copyRight = copyRight.replace(copyRightLink, `<a class="text-primary hover:text-[color:var(--color-text)] cursor-pointer" href="${copyRightLink}">${copyRightShortLink}</a>`);
    return copyRight;
}