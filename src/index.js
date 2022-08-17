import WebSDK from '@verifai/websdk'

import getToken from './getToken'
import getResult from './getResult'
import * as configFile from '../config.json'

const config = {
  onSuccess: sessionId => {
    console.log(`Successfully completed flow for ${sessionId}`)

    getResult(sessionId)
  },
  onCanceled: sessionId => {
    console.log(`Canceled flow for ${sessionId}`)
  },
  ...configFile
}

async function startApp() {
  const token = await getToken()
  const rootElement = document.getElementById('verifai-mount')
  const webSDK = new WebSDK(config, rootElement)

  webSDK.setConfig({ token })
  webSDK.start()
}

startApp()
