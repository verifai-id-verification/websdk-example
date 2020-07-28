# Verifai web SDK

This is the Verifai webSDK example project.

It exists of two parts:

* Example Backend
* Example Frontend

## Running the example Backend

You can run the example backend by:

```bash
cd backend
# install the requirements
pip3 install -r requirements.txt
# run the webserver
python3 main.py
```

You can check if the server is running by going to:
http://0.0.0.0:8091/token

Here you should be greeted with some json.

## Running the frontend

For the frontend you need to serve the static files in the `frontend` folder:

We use `serve` for this: https://www.npmjs.com/package/serve .
But any other static file server like `apache` or `ngnix` will do.

Depending on your platform you can do:
```bash
npm install -g serve
```

Then to run:
```bash
cd frontend
serve .
```

`serve` uses port `5000` by default so when you go to: http://localhost:5000 you should be greeted by the Verifai webSDK

## Folder contents

### Backend
Contains the example backend. This example contains the three methods you should implement in your backend when communicating with the Verifai middleware.

There are 3 endpoints:

* **[ /token ]** Is used to get the Verifai one time use token, This token can be used to start a user session to go through the SDK.
* **[ /result ]** Is used to fetch the Verifai result from the Verifai temp storage. this endpoint should be called when the user session is finished i.e. in the `on_finished` method in the frontend.
* **[ /remove_session ]** After the result is collected you should remove the session from the Verifai temporal storage to make sure there is no unnecessary (personal) data floating around in the temporal storage.

These 3 endpoints are direct proxies to the middleware:

| Endpoint                                | Method | Datatype | Result |
|-----------------------------------------|--------|----------|--------|
| /v1/auth/token                          | POST   | JSON     | JSON   |
| /v1/session/{session_id}/verifai-result | GET    | -        | JSON   |
| /v1/session/{session_id}                | DELETE | -        | JSON   |

 **Q:** Why proxy and not call these endpoints directly from the frontend?

 **A:** Because you need the shared secret to authorize, if the secret is exposed on the frontend anyone can call these endpoints which would be a _major_ security breach.


### Frontend
This folder contains an example implementation for the frontend. The files `/frontend/index.html` and `/frontend/example.js` are thoroughly documented and should be self-explanatory.

## Known issues

This list contains some known issues. We are working hard on these and you don't need to report them. Reports on all other issues you may find are very welcome.

* The CSS is not very readable, documented, or modifiable yet.
* Documentation other than found in this folder.
* The error screen reset button does not always work.
* Some older browser and phones are not yet supported.
* SDK crashes when some buttons are fast repeatedly clicked.
* Sometimes the cropping does not work.
* Landscape mode on phones is not supported.
* Duration of a session or handover is too short.
* Session timeout does not display an error.
