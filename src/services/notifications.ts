import { AuthErrorCodes as aec } from "@firebase/auth";
import { log } from '@/services/env'

export const AuthErrorCodesDict = new Map<string, string>([
    [aec.INVALID_PASSWORD,"Invalid password"],
    [aec.TOO_MANY_ATTEMPTS_TRY_LATER,"Too many requests. Try again in a couple of minutes"],
    [aec.EMAIL_EXISTS,"This email is already in use"],
    [aec.WEAK_PASSWORD,"Password is too weak"],
    [aec.INVALID_EMAIL,"Invalid Email"],
]);

export function notify(message: string, notificationType: "error" | "primary" | "secondary" = "primary"){

    switch (notificationType) {
        case "error":
            console.warn(message);
            break;
        case "primary":
            log && console.log(message);
            break;
        default:
            log && console.log(message);
            break;
    }
}