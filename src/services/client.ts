import config from "@/config";
import { Client } from "hiddentreasures-js";
import { getBearerToken } from "./auth";

export default new Client({
    basePath: config.api.basePath,
    apiVersion: "4.0",
    getToken: async () => await getBearerToken() as string,
});
