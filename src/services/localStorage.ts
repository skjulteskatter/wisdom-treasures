export const history = {

    historyPrefix: 'history:',

    getAll(): Map<string, string> {
        const items : Map<string, string> = new Map<string, string>();
        for (const key in localStorage) {
            if (key.startsWith(this.historyPrefix)) {
                const item = localStorage.getItem(key);
                if (item == null) continue;
                items.set(key.replace(this.historyPrefix, ""), item);
            }
        }

        return items;
    },
    get(id: string): string | null {
        return localStorage.getItem(this.historyPrefix + id);
    },
    addOrReplace(id: string, date: number) {
        localStorage.setItem(this.historyPrefix + id, date.toString());
    },
    delete(id: string) {
        localStorage.removeItem(this.historyPrefix + id);
    },
    deleteAll(){
        const allItemKeys = this.getAll().keys();
        for (const key of allItemKeys) {
            this.delete(key);
        }
    }
};

export const mannaHistory = {

    mannaHistoryPrefix: 'mannaHistory:',

    getAll(): Map<string, string> {
        const items : Map<string, string> = new Map<string, string>();
        for (const key in localStorage) {
            if (key.startsWith(this.mannaHistoryPrefix)) {
                const item = localStorage.getItem(key);
                if (item == null) continue;
                items.set(key.replace(this.mannaHistoryPrefix, ""), item);
            }
        }

        return items;
    },
    get(id: string): string | null {
        return localStorage.getItem(this.mannaHistoryPrefix + id);
    },
    addOrReplace(id: string, date: number = Date.now()) {
        localStorage.setItem(this.mannaHistoryPrefix + id, date.toString());
    },
    delete(id: string) {
        localStorage.removeItem(this.mannaHistoryPrefix + id);
    },
    deleteAll(){
        const allItemKeys = this.getAll().keys();
        for (const key of allItemKeys) {
            this.delete(key);
        }
    }
};

export const favorites = {

    favoritePrefix: 'favorite:',

    getAll(): Map<string, string> {
        const items : Map<string, string> = new Map<string, string>();
        for (const key in localStorage) {
            if (key.startsWith(this.favoritePrefix)) {
                const item = localStorage.getItem(key);
                if (item == null) continue;
                items.set(key.replace(this.favoritePrefix, ""), item);
            }
        }

        return items;
    },
    get(id: string): string | null {
        return localStorage.getItem(this.favoritePrefix + id);
    },
    addOrReplace(id: string) {
        localStorage.setItem(this.favoritePrefix + id, Date.now().toString());
    },
    delete(id: string) {
        localStorage.removeItem(this.favoritePrefix + id);
    },
    deleteAll(){
        const allItemKeys = this.getAll().keys();
        for (const key of allItemKeys) {
            this.delete(key);
        }
    }
};

export const search = {

    maxSearchesRemebered: 5,
    searchPrefix: 'searchTerm:',

    getAll(): Map<string, string> {
        const items : Map<string, string> = new Map<string, string>();
        for (const key in localStorage) {
            if (key.startsWith(this.searchPrefix)) {
                const item = localStorage.getItem(key);
                if (item == null) continue;
                items.set(key.replace(this.searchPrefix, ""), item);
            }
        }

        return items;
    },
    get(id: string): string | null {
        return localStorage.getItem(this.searchPrefix + id);
    },
    addOrReplace(id: string, date: number) {
        localStorage.setItem(this.searchPrefix + id, date.toString());
        const all = this.getAll();
        if (all.size > this.maxSearchesRemebered){
            let lowest: [string, number] = ["", Date.now()];
            for (const [key, value] of all) {
                const numberValue : number = +(value);
                if (numberValue < lowest[1]){
                    lowest = [key, numberValue];
                }
            }
            localStorage.removeItem(this.searchPrefix + lowest[0]);
        }
    },
    delete(id: string) {
        localStorage.removeItem(this.searchPrefix + id);
    },
    deleteAll(){
        const allItemKeys = this.getAll().keys();
        for (const key of allItemKeys) {
            this.delete(key);
        }
    }
};

export const language = {

    languagePrefix: "language:",

    setOrReplace(language: string) {
        localStorage.setItem(this.languagePrefix, language);
    },
    get(){
        return localStorage.getItem(this.languagePrefix);
    }
};

export const lastUpdated = {

    prefix: "lastUpdated:",

    setOrReplace(lastUpdatedUTC: number, objectsName: "articles" | "authors" | "origins" | "publications" | "audioclips") {
        localStorage.setItem(`${objectsName}_${this.prefix}`, lastUpdatedUTC.toString());
    },
    get(objectsName: "articles" | "authors" | "origins" | "publications" | "audioclips"){
        return localStorage.getItem(`${objectsName}_${this.prefix}`);
    }
};

//This is just for the sake of beeing offline friendly
export const lastUserHasSubscription = {

    prefix: "lastUserHasSubscription:",

    setOrReplace(lastUserHasSubscription: boolean) {
        localStorage.setItem(this.prefix, lastUserHasSubscription ? "true" : "false");
    },
    get(): boolean{
        return localStorage.getItem(this.prefix) == "true";
    }
};