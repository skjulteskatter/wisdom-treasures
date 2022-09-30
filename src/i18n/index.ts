import { createI18n } from "vue-i18n";
import "isomorphic-fetch"

const VALIDLANGUAGES = ["en", "no"];

async function fetchTranslations(language: string) : Promise<{ [key: string]: string; }> {
    try {
        const translation =  await (await fetch(`/locales/${language}.json`)).json() as {
        [key: string]: string;
        }
        return translation;
    } catch (e) {
        console.log("Couldn't fetch translation: " + language + "\nReturn test message");
    }
    return {
        "test": "This is a test",
    };
}

async function getAllMessages() {
    const message : { [key: string]: {}} = {};
    for (const lang of VALIDLANGUAGES) {
        message[lang] = await fetchTranslations(lang)
    }
    return message;
}

const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    availableLocales: VALIDLANGUAGES,
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
    if (!VALIDLANGUAGES.includes(locale)) return false;
    i18n.global.locale = locale;
    return true;
}

export default i18n;