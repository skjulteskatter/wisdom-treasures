import { openDB, deleteDB } from 'idb';
import type { DBSchema, IDBPDatabase  } from 'idb';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import type { Origin } from '@/classes/Origin';
import { dbVersion as dbv } from '../../package.json'
import type { AudioClip } from '@/classes/AudioClip';
import { log } from '@/services/logger'
const dbPrefix : string = "WTDB"

//Clean up old databases async
log && console.log("Running on dbVersion: " + dbv);
const promise = indexedDB.databases();
promise.then((databases) => {
  for (const database of databases) {
    const name = (database.name ?? "");
    if (name.startsWith(dbPrefix) && name != dbPrefix + dbVersion().toString())
    {
      log && console.log("Deleting old database: " + name);
      deleteDB(name);
    }
  }
});

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
  'audioclips': {
    key: string;
    value: AudioClip;
  };
}

export const dbPromise : Promise<IDBPDatabase<WTDBSchema>> = openDB<WTDBSchema>(dbPrefix + dbVersion().toString(), dbVersion(), {
  upgrade(db : IDBPDatabase<WTDBSchema>) {
    db.createObjectStore('articles');
    db.createObjectStore('publications');
    db.createObjectStore('authors');
    db.createObjectStore('origins');
    db.createObjectStore('audioclips');
  }
});

export async function putArticles(articles: Article[]) {
    const storeName = 'articles';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const article of articles) {
        tx.store.put(article, article.id);
    }

    await Promise.all(promises);
}

function dbVersion(): number
{
  return dbv;
}

export async function putPublications(publications: Publication[]) {
    const storeName = 'publications';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const publication of publications) {
        tx.store.put(publication, publication.id);
    }

    await Promise.all(promises);
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
      log && console.log("Cleared cache for store: " + storeName);
  }, expirySeconds * 1000 * 1000)
}

export async function putAudioClips(audioClips: AudioClip[]) {
  const storeName = 'audioclips';
  const tx = (await dbPromise).transaction(storeName, 'readwrite');

  const promises: Promise<string>[] = []
  for (const audioClip of audioClips) {
      tx.store.put(audioClip, audioClip.id);
  }

  await Promise.all(promises);
}


export async function putAuthors(authors: Contributor[]) {
    const storeName = 'authors';
    const tx = (await dbPromise).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const author of authors) {
        tx.store.put(author, author.id);
    }

    await Promise.all(promises);
}

export async function clearCache() {
    for (const storeName of (await dbPromise).objectStoreNames) {
        (await dbPromise).clear(storeName);
    }
}

export async function clearStoreCache(storeName: "articles" | "publications" | "authors" | "origins" | "audioclips") {
    (await dbPromise).clear(storeName);
}