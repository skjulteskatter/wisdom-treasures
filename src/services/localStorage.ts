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
};