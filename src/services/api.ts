import type { IUser, ISettings } from "hiddentreasures-js";
import http from "./http";
import type { HTUser } from "@/classes/HTUser";

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

export default {
    session
};