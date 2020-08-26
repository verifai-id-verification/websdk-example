# Verifai Example Backend
#
# This is an example for a clients backend.
# The general idea is that this is a proxy to the Verifai Middleware.
#
# Here you should store the VERIFAI_INTERNAL_TOKEN.
# The token is a shared secret between your own backend and the Verifai middleware.
#
#############################################################
# DO NOT store the VERIFAI_INTERNAL_TOKEN in your frontend, #
# this will expose your users data to the outside.          #
#############################################################
#
#
# This example is build with:
#    * [python 3] https://www.python.org/ (language)
#    * [flask]    https://flask.palletsprojects.com/en/1.1.x/ (web-server)
#    * [requests] https://requests.readthedocs.io/en/master/ (HTTP lib)
#
# You can run this example for testing and demo purposes.
# For production you should implement it yourself in your own web-application.

import json
import requests
from flask import Flask, jsonify
from flask_cors import CORS

# Settings for the example backend
HOST = '0.0.0.0'
PORT = '8091'
DEBUG = True

# The shared secret with the Verifai middleware
VERIFAI_INTERNAL_TOKEN = 'your_middelware_internal_token'
# Url to the Verifai middleware
MIDDLEWARE_BASE_URL = 'https://url.to.your.middleware'
# Middleware version
MIDDLEWARE_VERION = 1
# Middleware url
MIDDLEWARE_URL = f'{MIDDLEWARE_BASE_URL}/v{MIDDLEWARE_VERION}'

# Authorization header
HEADERS = {'Authorization': 'Bearer ' + VERIFAI_INTERNAL_TOKEN}
# The url for the handover
# In this example it is in the /handover/ folder.
HANDOVER_BASE_URL = 'http://localhost:5000/handover/#/handover?s='


# Create a flask app
app = Flask(__name__)

# Add Cors to the app
CORS(app)


# Endpoint to get the Verifai One time use token
# ---------------------------------------------------
# Before you can start the Verifai websdk flow you need to get the one time use token.
# Here the one time use token is requested from the middleware,
# and returned to the frontend.
# The websdk uses this url to communicate directly with the middleware.

@app.route('/token')
def get_token():
    endpoint = f'{MIDDLEWARE_URL}/auth/token'
    data = {
        "document_type_whitelist": json.dumps([  # You can include document types
            "P",  # Passport
            "I",  # ID-card
            "D",  # Drivers license
            "R",  # Refugee travel document
            # "RP",  # Residence permit
            # "V",  # Visa (not fully supported yet)
        ]),
        # The url to where Verifai should point during a handover.
        # There should be a served Verifai SDK at this location connected to the same middleware as the initial SDK.
        # In the example it points to where the example frontend is served.
        "handover_base_url": HANDOVER_BASE_URL

        # "country_choices_blacklist": json.dumps(["DE", "IT"]),  # You can exclude countries
        # "country_choices_whitelist": json.dumps(["NL"])  # Or exclusively include countries
        # countries are denoted by their 2 letter country code:
        # https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
    }
    response = requests.post(endpoint, data, headers=HEADERS)
    content = json.loads(response.content)
    verifai_token = content['token']

    return jsonify({
        "verifai_token": verifai_token,
    }), 200


# Endpoint to get the Verifai Result after the session has ended
# -----------------------------------------------------------------
# When the Verifai flows are finished, a session_id is returned in the `on_finished` callback in the frontend.
# With this session_id you are able to fetch the Verifai result from the Verifai Middleware.
# The result object holds all the information extracted during the flow.
# https://verifai.dev/#result-processing gives an idea of what fields you can expect.
# Note the url links to the result object for the Mobile SDK, there might be some minor differences.

@app.route('/result/<string:session_id>')
def get_result(session_id):
    endpoint = f'{MIDDLEWARE_URL}/session/{session_id}/verifai-result'
    response = requests.get(endpoint, headers=HEADERS)
    content = json.loads(response.content)
    return jsonify(content), 200


# Endpoint to remove the session from the Verifai temp memory after the session has ended.
# -----------------------------------------------------------------------------------------
# After the Verifai flow has finished you should remove the session from the Verifai temp storage.
# This is done with the session id returned by the `on_finished` callback in the frontend.
# When a session is deleted all related objects are also deleted from the Verifai storage.
# You should be double sure the data is stored on your own system before calling this.
# If this method is not called the data is automatically removed after 1 week.
# The duration of the data persistence might change with newer releases.

@app.route('/session/<string:session_id>', methods=['DELETE'])
def remove_session(session_id):
    endpoint = f'{MIDDLEWARE_URL}/session/{session_id}'
    response = requests.delete(endpoint, headers=HEADERS)
    content = json.loads(response.content)
    return jsonify(content), 200


# starts the flask web-server
if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
