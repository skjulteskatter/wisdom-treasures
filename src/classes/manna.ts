export class Manna {
    bible: string;
    url: string;
    book: string;
    reference: string;
    html: string;

   
    constructor(bible: string, url: string, book: string, reference: string, html: string) {
        this.bible = bible;
        this.url = url;
        this.book = book;
        this.reference = reference;
        this.html = html;
    }
}