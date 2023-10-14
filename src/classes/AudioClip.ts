export class AudioClip {
    id: string;
    updatedAt: string;
    publicationId: string;
    sourceId: string;
    authorId: string;
    date: string;
    audioFile: string;
    image: string;
    title: string;
    introduction: string;
   
    constructor(id: string, updatedAt: string, publicationId: string, sourceId: string, authorId: string, date: string, audioFile: string, image: string, title: string, introduction: string) {
        this.id = id;
        this.updatedAt = updatedAt;
        this.publicationId = publicationId;
        this.sourceId = sourceId;
        this.authorId = authorId;
        this.date = date;
        this.audioFile = audioFile;
        this.image = image;
        this.title = title;
        this.introduction = introduction;
    }
}