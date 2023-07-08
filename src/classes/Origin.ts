import type { Source } from "hiddentreasures-js";

export class Origin {
    id: string;
    name: string;
    image: string | null;
   
    constructor(source: Source) {
      this.id = source.id;
      this.image = source.image;
      this.name = source.name;
    }
}