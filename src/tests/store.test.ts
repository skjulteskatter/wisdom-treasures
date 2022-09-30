import { useSessionStore } from '../stores/session'
import { describe, expect, it, beforeAll, beforeEach} from 'vitest';
import i18n from '@/i18n';
import { createPinia, setActivePinia } from 'pinia';

describe("#Change Locale", async () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })
    
    it("Changes the locale to a english", async () => {
        const store = useSessionStore();
        await store.setLocale("en");
        expect(store.locale).toBe("en");
        expect(i18n.global.locale).toBe("en");
    });

    it("Changes the locale to a norwegian", async () => {
        const store = useSessionStore();
        await store.setLocale("no");
        expect(store.locale).toBe("no");
        expect(i18n.global.locale).toBe("no");
    });

    it("Changes the locale to a not a language", async () => {
        const store = useSessionStore();
        const locale = store.locale;
        const fakeLanguage = "#&%";
        await store.setLocale(fakeLanguage);
        expect(store.locale).toBe(locale);
        expect(i18n.global.locale).toBe(locale);
        expect(store.locale).not.toBe(fakeLanguage)
    });

})