import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase  } from 'idb';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import type { Origin } from '@/classes/Origin';

interface WTDBSchema extends DBSchema {
  'articles': {
    key: string;
    value: Article;
  };
  'publications': {
    key: string;
    value: Publication;
  };
  'authors': {
    key: string;
    value: Contributor;
  };
  'origins': {
    key: string;
    value: Origin;
  };
}

export const dbPromise : Promise<IDBPDatabase<WTDBSchema>> = openDB<WTDBSchema>("WTDB", 1, {
  upgrade(db : IDBPDatabase<WTDBSchema>) {
    db.createObjectStore('articles');
    db.createObjectStore('publications');
    db.createObjectStore('authors');
    db.createObjectStore('origins');
  },
});

export async function putArticles(articles: Article[], expirySeconds: number = 7200) {
    const storeName = 'articles';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const article of articles) {
        tx.store.put(article, article.id);
    }

    await Promise.all(promises);

    setTimeout(() => {
        clearStoreCache(storeName);
        console.log("Cleared cache for store: " + storeName);
    }, expirySeconds * 1000)
}

export async function putPublications(publications: Publication[], expirySeconds: number = 7200) {
    const storeName = 'publications';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const publication of publications) {
        tx.store.put(publication, publication.id);
    }

    await Promise.all(promises);

    setTimeout(() => {
        clearStoreCache(storeName);
        console.log("Cleared cache for store: " + storeName);
    }, expirySeconds * 1000)
}

export async function putOrigins(sources: Origin[], expirySeconds: number = 7200) {
  const storeName = 'origins';
  const tx = (await dbPromise).transaction(storeName, 'readwrite');

  const promises: Promise<string>[] = []
  for (const source of sources) {
      tx.store.put(source, source.id);
  }

  await Promise.all(promises);

  setTimeout(() => {
      clearStoreCache(storeName);
      console.log("Cleared cache for store: " + storeName);
  }, expirySeconds * 1000)
}

export async function putAuthors(authors: Contributor[], expirySeconds: number = 7200) {
    const storeName = 'authors';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const author of authors) {
      console.log("Author: ",author)
        tx.store.put(author, author.id);
    }

    await Promise.all(promises);

    setTimeout(() => {
        clearStoreCache(storeName);
        console.log("Cleared cache for store: " + storeName);
    }, expirySeconds * 1000)
}

export async function clearCache() {
    for (const storeName of (await dbPromise).objectStoreNames) {
        (await dbPromise).clear(storeName);
    }
}

export async function clearStoreCache(storeName: "articles" | "publications" | "authors" | "origins") {
    (await dbPromise).clear(storeName);
}