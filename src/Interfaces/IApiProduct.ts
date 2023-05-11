interface IPrice {
    id: string;
    value: number;
    name: string;
    type: "month" | "year";
    currency: string;
}

export interface IApiProduct {
    id: string;
    collectionIds: string[];
    prices: IPrice[];
    priority: number;
    updatedAt: string;
}