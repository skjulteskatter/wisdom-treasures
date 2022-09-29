import { createI18n } from "vue-i18n";

const VALIDLANGUAGES = ["en", "no"];

const fetchTranslations = async (language: string) => (await (await fetch(`/locales/${language}.json`)).json()) as {
    [key: string]: string;
};

async function getAllMessages(){
    const message : { [key: string]: {} } = {};
    for (const lang of VALIDLANGUAGES) {
        message[lang] = await fetchTranslations(lang)
    }
    console.log(message);
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