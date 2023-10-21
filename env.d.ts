/// <reference types="vite/client" />

declare interface ImportMeta {
    readonly env: {
      // Environment variables defined in .env
      readonly VITE_APP_SCRIPTS_SUGGESTION_LINK: string;
      readonly VITE_APP_LOGGING: string;
    };
  }
  
