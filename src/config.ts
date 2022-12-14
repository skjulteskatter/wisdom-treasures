const firebaseConfigDevelopment = {
    apiKey: "AIzaSyBUW_Heeg1VUp84EFOtItjLy6HjosUKGg8",
    authDomain: "songtreasures-development.firebaseapp.com",
    projectId: "songtreasures-development",
    storageBucket: "songtreasures-development.appspot.com",
    messagingSenderId: "208120429940",
    appId: "1:208120429940:web:62c2a510128a829de90021"
  };

const firebaseConfigProduction = {    
    apiKey: "AIzaSyDTZsQJxCT3w7cIQzYJ6T3YxNLIF-2LEpk",
    authDomain: "songtreasures.app",
    projectId: "songtreasures",
    storageBucket: "songtreasures.appspot.com",
    messagingSenderId: "721098499416",
    appId: "1:721098499416:web:fc3d22660728b82e82f12d",
    measurementId: "G-YWMEW6TKB8",
  };

const firebaseConfig = 
    //firebaseConfigDevelopment; //Use this for development database
    firebaseConfigProduction; //Use this for production database

const basePath = 
    "https://api.songtreasures.app/"; //Use this for online server
    //"https://localhost:44301/"; //Use this for local server

const config = {
    api: {
        basePath,
    },
    firebaseConfig,
};

export default config;
