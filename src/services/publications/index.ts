import type { Publication } from "hiddentreasures-js";
import type { ILocaleDictionary } from "hiddentreasures-js/build/models/localeDictionary";
import articleService from "./articleService";
import publicationService from "./publicationService";

export {
    articleService,
    publicationService,
};


export async function getFakePublications(): Promise<Publication[]> {
    return [
        {
            collectionId: "aa7d92e3-c92f-41f8-87a1-333375125a1c",
            datePublished: "",
            title: "Tittle 1",
            key: {get(language = "en") {
                return "publicationName";
            },} as ILocaleDictionary,
            description: "",
            icon: undefined,
            image: undefined,
            id: "59edeb55-9d95-40f3-94d6-1f95c566d783",
            updatedAt: "",
        },
        {
            collectionId: "aa7d92e3-c92f-41f8-87a1-333375125a1c",
            datePublished: "",
            title: "Tittle 2",
            key: {get(language = "en") {
                return "publicationName";
            },} as ILocaleDictionary,
            description: "",
            icon: undefined,
            image: undefined,
            id: "2908183c-680a-4182-8f75-7cca67b92136",
            updatedAt: "",
        },
    ];
}
