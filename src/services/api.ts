import type { IUser, ISettings, Article } from "hiddentreasures-js";
import http from "./http";
import type { HTUser } from "@/classes/HTUser";
import type { RedirectToCheckoutOptions } from "@stripe/stripe-js";
import type { IApiProduct } from "@/Interfaces/IApiProduct";
import type { SessionRequest, SetupResponse } from "songtreasures-api/checkout";

export const session = {
    async getCurrentUser() {
        return await http.get<HTUser>("api/Session");
    },
    saveUser(settings: ISettings) {
        return http.patch<HTUser>("api/Session", settings);
    },
    createUser(displayName: string) {
        return http.put("api/Session", { displayName });
    },
    uploadImage(fileName: string, base64Image: string) {
        return http.patch<{ image: string }>("api/Session/Image", { fileName, base64Image });
    },
    saveProfile(options: {
        gender?: string;
        birthDay?: string;
        address?: {
            addressLine: string;
            secondaryAddressLine: string;
            zipCode: number;
            city: string;
            country: string;
        };
    }, firstTimeRegistration = false) {
        return http.patch<IUser>("api/Session/Profile?firstTimeRegistration=" + firstTimeRegistration, options);
    },
    acceptPrivacyPolicy() {
        return http.get("api/Session/AcceptPolicies?privacyPolicy=true");
    },
    acceptTermsOfService() {
        return http.get("api/Session/AcceptPolicies?termsAndConditions=true");
    },
    verifyEmail() {
        return http.get("api/Session/VerifyEmail");
    },
    resetPassword(email: string) {
        return http.get("api/Session/ResetPassword/" + email, true);
    },
};

export const favorites = {

    get() {
        return http.get<string[]>("api/favorites/items");
    },
    add(ids: string[]) {
        return http.post<void, unknown>("api/favorites/items", ids);
    },
    delete(ids: string[]) {
        return http.delete<void>("api/favorites/items", ids);
    },
};

type ArticleInputBody = {
    itemIds: string[] //GUIDS
    limit: number,
    skip: number,
    orderBy: string,
    orderByDirection: string,
    lastUpdated: Date, //"2023-08-19T10:36:50.594Z",
    collectionIds: string[] //GUIDS
    parentIds: string[] //GUIDS
    withContent: boolean
}

export const articles = {
    get(language: string) {
        return http.get<string[]>(`api/Articles?language=${language}&X-Api-Version=4`);
    },
    post(language: string, updatedAt: Date, articleInputBody: ArticleInputBody){
        return http.post<Article>(`api/Articles?language=${language}&X-Api-Version=4`)
    }
}

export default {
    session
};

export const stripe = {
    setup() {
        return http.get<SetupResponse>("api/Store/Setup");
    },
    getProducts(){
        return http.get<IApiProduct[]>("api/Store/Products", undefined, true, "4.0");
    },
    getSession(sessionId: string) {
        return http.get<RedirectToCheckoutOptions>(`api/Store/Session/${sessionId}`);
    },
    getPortalSession() {
        return http.post("api/Store/Portal", {
            returnUrl: window.location.href,
        });
    },
    refreshSubscriptions() {
        return http.get("api/Store/Refresh");
    },
    async startSession(productIds: string[], type: "year" | "month") {
        const country = await http.getCountry().catch(() => {
            return undefined;
        });

        return await http.post<RedirectToCheckoutOptions, SessionRequest>("api/Store/Session", {
            productIds,
            cancelUrl: window.location.href,
            successUrl: window.location.origin + "/success",
            country,
            type,
        });
    },
};