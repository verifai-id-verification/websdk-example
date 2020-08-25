const BACKEND_URL = 'http://localhost:8091/' //The url to your backend (see backend folder for the example)
const MIDDLEWARE_VERSION = 1 //Verifai middleware version
const MIDDLEWARE_BASE_URL = 'https://url.to.your.middleware' //The url to the Verifai middleware

window.onload = function () {
    // Get one time use token from your backend
    fetch(BACKEND_URL + 'token')
        // Parse the json
        .then(response => response.json())
        // Initialize Verifai
        .then(responseData => startVerifai(responseData))
        // If something goes wrong, show the error
        .catch(error => console.error(error))
}

function startVerifai(responseData){
    const token = responseData['verifai_token']
    const config = { // Config for the Verifai websdk
        token: token, // The one time use token
        backendUrl: MIDDLEWARE_VERSION + '/v' + MIDDLEWARE_BASE_URL + '/', // The url to the Verifai Middleware
        element: document.getElementById('verifai-mount'), // The mount point
        locale: 'en', // language
        assetsUrl: 'public/assets', // Where Verifai can find its assets
        restore: false, // If we should reinit the session after a page refresh
        onSuccess: onFinish // call back,
    }
    // The Verifai object was injected by the verifai.js script
    const verifai = new Verifai.VerifaiApp() // creates a new Verifai object
    verifai.init(config) // should show and run on init
}

function onFinish(sessionId) {
    // Get result from your backend
    fetch(BACKEND_URL + 'result/' + sessionId)
        // Check response status and parse the json
        .then(response => response.json())
        // Initialize result app and show result
        .then(responseData => showResult(responseData))
        // If something goes wrong, show the error
        .catch(error => console.error(error))
        // In any case, try to remove the session data
        .then(() => delete_session(sessionId))
        // If something goes wrong, show the error
        .catch(error => console.error(error))
}

function delete_session(sessionId) {
    // Calls the endpoint in your backend
    return fetch(BACKEND_URL + 'session/' + sessionId, {method: "DELETE"})
}

// This function starts the result app.
// In production you want to save the result to your own database and probably not show it to your user.
// The result app was only built for testing purposes.
function showResult(responseData){
    const config = {
        result: responseData,
        element: document.getElementById('verifai-result')
    }
    // The verifaiResultApp object was injected by the `result.js` script
    const resultApp = new verifaiResultApp.default() // create the app
    resultApp.init(config) // should show on init
}