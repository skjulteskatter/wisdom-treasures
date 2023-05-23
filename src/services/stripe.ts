import { stripe as api } from "@/services/api";
import  { loadStripe, type Stripe } from "@stripe/stripe-js";

export default class StripeService {
    private service: Stripe | null = null;
    private key;

    constructor(key: string) {
        this.key = key;
    }

    public async checkout(productIds: string[], type: "year" | "month") {
        this.service = await loadStripe(this.key);

        const session = await api.startSession(productIds, type);

        await this.service?.redirectToCheckout(session).catch(err => {
            if (err) throw err;
        });
    }

    public async portal() : Promise<string> {
        return (await api.getPortalSession() as {url: string}).url;
    }

    public refreshSubscriptions(): Promise<any> {
        return api.refreshSubscriptions();
    }
}
