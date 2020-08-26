const BACKEND_VERSION = 1
const BACKEND_BASE_URL = 'https://staging.middleware.websdk.verifai.io' //The url to the Verifai middleware
//todo ophalen backend klant
window.onload = function () {
    // Start Verifai
    startVerifai();
}

function startVerifai(){
    const config = { // Config for the Verifai websdk
        backendUrl: BACKEND_BASE_URL + '/v' + BACKEND_VERSION + '/', // The url to the Verifai Middleware
        element: document.getElementById('verifai-mount'), // The mount point
        locale: 'en', // language
        assetsUrl: '../public/assets', // Where Verifai can find its assets
    }
    // The Verifai object was injected by the verifai.js script
    const verifai = new Verifai.VerifaiApp() // creates a new Verifai object
    verifai.init(config) // should show and run on init
}
