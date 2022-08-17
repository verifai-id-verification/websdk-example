# Verifai Web SDK example project

Example project for [Verifai's](https://www.verifai.com) Web SDK. Full documentation on how to use the Web SDK can be found [here](https://docs.verifai.com/sdk/web/).

## Setup

By default we assume you already have a back end which includes your [API key](https://docs.verifai.com/sdk/web/getting-started#prerequisites) and is used to make the actual requests to the Verifai API. However, this project also includes some Python code which can be used to mimic a back end. See the [Backend](#backend) section for more information.

The front end only requires you to install required packages by running `npm install` (or any equivalent).

### Configuration

Aside from the configuration you'll need for the Web SDK itself (see [Installation](https://docs.verifai.com/sdk/web/getting-started/#installation)) you'll also need to add a `config.json` with a few properties. An example of this file can be found as `config.json.example`.

#### `tokenUrl`
The URL to fetch an OTP token (e.g. `https://your.backend.url/api/token`).

#### `resultUrl`
The URL to fetch the result once the flow is complete (e.g. `https://your.backend.url/api/result`). Keep in mind that the `showResults` function in `getResult.js` adds the session ID at the end. Edit the code in that file if your URL is different. As mentioned in that same file this endpoint is purely for testing and demo purposes as your users should not be shown the results of the scan. If you're not interested in implementing this part you can just remove the function call to `getResult` in `index.js`.

> **Note**: There might be a use case where you want to test some other [configuration options](https://docs.verifai.com/sdk/web/customization/introduction#front-end-configuration). You can freely add any of the mentioned fields to the `config.json` file and they will be added to the Web SDK's configuration.

### Starting the app

* Run `npm start`
* Open your browser and go to `http://localhost:1234`

## Example back end

### Configuration with included back end
There are 3 endpoints:

* **[/token]** Is used to get the Verifai one time use token, This token can be used to start a user session to go through the SDK.
* **[/result]** Is used to fetch the Verifai result from the Verifai temp storage. this endpoint should be called when the user session is finished i.e. in the `on_finished` method in the frontend.
* **[/remove_session]** After the result is collected you should remove the session from the Verifai temporal storage to make sure there is no unnecessary (personal) data floating around in the temporal storage.

These 3 endpoints are direct proxies to the middleware:

| Endpoint                                | Method | Datatype | Result |
|-----------------------------------------|--------|----------|--------|
| /v1/auth/token                          | POST   | JSON     | JSON   |
| /v1/result/{session_id}/all             | GET    | -        | JSON   |
| /v1/session/{session_id}                | DELETE | -        | JSON   |

 **Q:** Why proxy and not call these endpoints directly from the frontend?

 **A:** Because you need the shared secret to authorize, if the secret is exposed on the frontend anyone can call these endpoints which would be a _major_ security breach.

### Running the example back end

```bash
cd backend
# Install the requirements
pip3 install -r requirements.txt
# Run the webserver
python3 main.py
```
