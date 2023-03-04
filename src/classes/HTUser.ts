import { Settings, User } from "hiddentreasures-js";

export class HTUser extends User {
    settings: Settings = {
        languages: [],
        defaultLanguage: "en",
        defaultTransposition: "",
        defaultTheme: "light"
    };
    displayName: string = "";
}