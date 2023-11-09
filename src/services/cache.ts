import { openDB, deleteDB } from 'idb';
import type { DBSchema, IDBPDatabase  } from 'idb';
import type { Article, Contributor, Publication } from 'hiddentreasures-js';
import type { Origin } from '@/classes/Origin';
import { dbVersion as dbv } from '../../package.json'
import type { AudioClip } from '@/classes/AudioClip';
import { log } from '@/services/env'
import { validLanguages } from '@/i18n'
const dbPrefix : string = "WTDB"

CleanUpOutdatedCache();

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

export const dbPromises: { [key: string]: Promise<IDBPDatabase<WTDBSchema>> } = {};

Array.from(validLanguages.keys()).forEach(lang => {
  dbPromises[lang] = openDB<WTDBSchema>(dbName(lang), dbVersion(), {
    upgrade(db: IDBPDatabase<WTDBSchema>) {
      db.createObjectStore('articles');
      db.createObjectStore('publications');
      db.createObjectStore('authors');
      db.createObjectStore('origins');
      db.createObjectStore('audioclips');
    }
  });
});

function CleanUpOutdatedCache() {
  log && console.log("Running on dbVersion: " + dbv);
  const promise = indexedDB.databases();
  promise.then((databases) => {
    for (const database of databases) {
      const name = (database.name ?? "");
      if (name.startsWith(dbPrefix) && !allDbNames().includes(name)) {
        log && console.log("Deleting old database: " + name);
        deleteDB(name);
      }
    }
  });
}

export async function putArticles(articles: Article[], lang: string) {
    const storeName = 'articles';
    const tx = (await dbPromises[lang]).transaction(storeName, 'readwrite');

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

function dbName(lang: string): string
{
  return `${dbPrefix}${dbVersion().toString()}_${lang}`
}

function allDbNames() : string[]
{
  const arr : string [] = [];
  for (const lang of validLanguages.keys()){
    arr.push(dbName(lang));
  }
  return arr;
}

export async function putPublications(publications: Publication[], lang: string) {
    const storeName = 'publications';
    const tx = (await dbPromises[lang]).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const publication of publications) {
        tx.store.put(publication, publication.id);
    }

    await Promise.all(promises);
}

export async function putOrigins(sources: Origin[], lang: string) {
  const storeName = 'origins';
  const tx = (await dbPromises[lang]).transaction(storeName, 'readwrite');

  const promises: Promise<string>[] = []
  for (const source of sources) {
      tx.store.put(source, source.id);
  }

  await Promise.all(promises);
}

export async function putAudioClips(audioClips: AudioClip[], lang: string) {
  const storeName = 'audioclips';
  const tx = (await dbPromises[lang]).transaction(storeName, 'readwrite');

  const promises: Promise<string>[] = []
  for (const audioClip of audioClips) {
      tx.store.put(audioClip, audioClip.id);
  }

  await Promise.all(promises);
}


export async function putAuthors(authors: Contributor[], lang: string) {
    const storeName = 'authors';
    const tx = (await dbPromises[lang]).transaction(storeName, 'readwrite');

    const promises: Promise<string>[] = []
    for (const author of authors) {
        tx.store.put(author, author.id);
    }

    await Promise.all(promises);
}

export async function clearCache() {
  for (const lang in validLanguages.keys()){
    for (const storeName of (await dbPromises[lang]).objectStoreNames) {
        (await dbPromises[lang]).clear(storeName);
    }
  }
}

export async function clearStoreCache(storeName: "articles" | "publications" | "authors" | "origins" | "audioclips") {
  for (const lang in validLanguages.keys()){
    (await dbPromises[lang]).clear(storeName);
  }
}
