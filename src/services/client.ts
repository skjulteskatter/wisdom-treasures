import config from "@/config";
import { Client } from "hiddentreasures-js";
import { useSessionStore } from "@/stores/session";

export default new Client({
    basePath: config.api.basePath,
    apiVersion: "4.0",
    getToken: async () => await useSessionStore().userToken,
});
