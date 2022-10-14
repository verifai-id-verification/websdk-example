import { resultUrl } from '../config.json'

// This function starts the result app.
// In production you want to save the result to your own database and probably not show it to your user.
// The result app was only built for testing purposes.
function showResult(resultData) {
  const config = {
    result: resultData,
    element: document.querySelector('.content')
  }

  // The verifaiResultApp object was injected by the `result.js` script
  const resultApp = new verifaiResultApp.default()

  resultApp.init(config)
}

export default async function getResult(sessionId) {
  const response = await fetch(`${resultUrl}/${sessionId}/all`)
  const result = await response.json()

  showResult(result)
}
