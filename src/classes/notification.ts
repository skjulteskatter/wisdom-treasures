export class Notification {
    message: string;
    type: "default" | "error";
    onDisplay: Boolean;
    id: string;
   
    constructor(message: string, type: "default" | "error" = "default", onDisplay: Boolean = true) {
      this.message = message;
      this.type = type;
      this.onDisplay = onDisplay;
      this.id = crypto.randomUUID();

      setTimeout(() => {
        this.onDisplay = false;
      }, 7000);
    }
}