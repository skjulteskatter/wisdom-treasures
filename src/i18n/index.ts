import { createI18n } from "vue-i18n";
import "isomorphic-fetch"

export const validLanguages = new Map<string, string>([
    ["no", "Norsk"],
    ["en", "English"]
]);

export const fallbackLocale = "no";

export function getValidLanguageKeys(): string[]{
    return Array.from(validLanguages.keys());
}

async function fetchTranslations(language: string) : Promise<{ [key: string]: string; }> {
    try {
        const translation =  await (await fetch(`public/locales/${language}.json`)).json() as {
        [key: string]: string;
        }
        return translation;
    } catch (e) {
        console.log("Couldn't fetch translation: " + language + "\nReturn test message");
        return {
            "test": "This is a test (for vitest)",
        };
    }

}

async function getAllMessages() {
    const message : { [key: string]: {}} = {};
    for (const lang of getValidLanguageKeys()) {
        message[lang] = await fetchTranslations(lang)
    }
    return message;
}

const i18n = createI18n({
    locale: fallbackLocale,
    fallbackLocale: fallbackLocale,
    availableLocales: getValidLanguageKeys(),
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages: await getAllMessages(),
});

/**
 * Only use this method from the session store action "setLocale"
 * @param locale the language. Eg "no" or "en" (must be lowercase)
 * @returns 
 */
export async function setLocaleFromSessionStore(locale: string): Promise<boolean> {
    if (!getValidLanguageKeys().includes(locale)) return false;
    i18n.global.locale = locale;
    return true;
}

export default i18n;