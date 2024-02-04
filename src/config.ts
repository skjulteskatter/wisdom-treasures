const firebaseConfigProduction = {
    apiKey: "AIzaSyDtIzd8JT1DYcvLFUCD8Z4XiJYPG_usGcU",
    authDomain: "songtreasures.app",
    projectId: "songtreasures",
    storageBucket: "songtreasures.appspot.com",
    messagingSenderId: "721098499416",
    appId: "1:721098499416:web:d21b47b5afc7dbbb82f12d",
    measurementId: "G-SWDNE8V474"
};

const firebaseConfig = firebaseConfigProduction;

const basePath = 
    "https://songtreasures.azurewebsites.net/";

const config = {
    api: {
        basePath,
    },
    firebaseConfig,
};

export default config;
