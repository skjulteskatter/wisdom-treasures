export const firebaseConfig = {
    apiKey: "AIzaSyBUW_Heeg1VUp84EFOtItjLy6HjosUKGg8",
    authDomain: "songtreasures-development.firebaseapp.com",
    projectId: "songtreasures-development",
    storageBucket: "songtreasures-development.appspot.com",
    messagingSenderId: "208120429940",
    appId: "1:208120429940:web:62c2a510128a829de90021"
  };

const basePath = "https://api.songtreasures.app/"; //USe this for online server
//const basePath = "https://localhost:44301/"; //Use this for local server

const config = {
    api: {
        basePath,
    },
    firebaseConfig,
};

export default config;
