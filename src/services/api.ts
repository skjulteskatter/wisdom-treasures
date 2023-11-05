import type { IUser, ISettings, Article, Publication, Contributor, Subscription } from "hiddentreasures-js";
import http from "./http";
import type { HTUser } from "@/classes/HTUser";
import type { RedirectToCheckoutOptions } from "@stripe/stripe-js";
import type { IApiProduct } from "@/Interfaces/IApiProduct";
import type { SessionRequest, SetupResponse } from "songtreasures-api/checkout";
import { WISDOM_WORDS_ID } from "@/stores/session";
import type { Origin } from "@/classes/Origin";
import type { AudioClip } from "@/classes/AudioClip";

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
        email = encodeURIComponent(email);
        return http.get("api/Session/ResetPassword/" + email, true, undefined, undefined, true);
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

type InputBody = {
    itemIds: string[]
    limit?: number,
    skip: number,
    orderBy: string,
    lastUpdated: string,
    collectionIds: string[] 
    withContent: boolean
}

export const articles = {
    post(language: string, updatedAt: Date, skip: number, limit?: number): Promise<Article[]> {

        return http.post<Article[]>(`api/Articles?language=${language}&updatedAt=${updatedAt.toISOString()}`, 
            {
                lastUpdated: updatedAt.toISOString(),
                collectionIds: [WISDOM_WORDS_ID],
                withContent: true,
                skip: skip,
                limit: limit,
                orderBy: "id"
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
    },
    postOneRandom(): Promise<Article[]> {

        return http.post<Article[]>(`api/Articles`, 
            {
                collectionIds: [WISDOM_WORDS_ID],
                limit: 1
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
    }
}

export const audioClips = {
    post(language: string, updatedAt: Date, skip: number, limit?: number): Promise<AudioClip[]> {

        return http.post<AudioClip[]>(`api/AudioClip?language=${language}&updatedAt=${updatedAt.toISOString()}`, 
            {
                lastUpdated: updatedAt.toISOString(),
                collectionIds: [WISDOM_WORDS_ID],
                withContent: true,
                skip: skip,
                limit: limit,
                orderBy: "id"
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
    }
}

export const publications = {
    post(language: string, updatedAt: Date, skip: number, limit?: number): Promise<Publication[]> {

        return http.post<Publication[]>(`api/Publications?language=${language}&updatedAt=${updatedAt.toISOString()}`, 
            {
                lastUpdated: updatedAt.toISOString(),
                collectionIds: [WISDOM_WORDS_ID],
                withContent: true,
                skip: skip,
                limit: limit,
                orderBy: "id"
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
    }
}

export const origins = {
    post(language: string, updatedAt: Date, skip: number, limit?: number): Promise<Origin[]> {

        return http.post<Origin[]>(`api/Sources?language=${language}&updatedAt=${updatedAt.toISOString()}`, 
            {
                lastUpdated: updatedAt.toISOString(),
                skip: skip,
                limit: limit,
                orderBy: "id"
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
    }
}

export const authors = {
    post(language: string, updatedAt: Date, skip: number, ids: string[], limit?: number): Promise<Contributor[]> {

        return http.post<Contributor[]>(`api/Contributors?language=${language}&updatedAt=${updatedAt.toISOString()}`, 
            {
                itemIds: ids,
                lastUpdated: updatedAt.toISOString(),
                skip: skip,
                limit: limit,
                orderBy: "id"
            } as InputBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            false,
            true,
            "4"
        )
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
    getSubscriptions(): Promise<Subscription[]>
    {
        return http.get<Subscription[]>(`api/Session/Subscriptions`, false, true, "4.0");
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