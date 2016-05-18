from flask import Flask, request
from json import dumps as jsonify
import sys
import pandas as pd
members_file = sys.argv[1]
deacons_file = sys.argv[2]
elders_file = sys.argv[3]

members_data = pd.read_csv(members_file)
elders_data = pd.read_csv(elders_file)
deacons_data = pd.read_csv(deacons_file)

members_list = []
for member in members_data.iterrows():
    members_list.append({
        'name': member[1][1],
        'lat':  member[1][6],
        'lng': member[1][7]
    })

elders_list = []
for elder in elders_data.iterrows():
    elders_list.append({
        'name': elder[1][1],
        'parish': elder[1][3],
        'lat':  elder[1][5],
        'lng': elder[1][6]
    })

deacons_list = []
for deacon in deacons_data.iterrows():
    deacons_list.append({
        'name': deacon[1][1],
        'parish': deacon[1][3],
        'lat':  deacon[1][5],
        'lng': deacon[1][6]
    })


app = Flask(__name__)

@app.route("/members")
def members():
    return jsonify(members_list)

@app.route("/deacons")
def deacons():
    return jsonify(deacons_list)

@app.route("/elders")
def elders():
    return jsonify(elders_list)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/my.js')
def javascript():
    return app.send_static_file('my.js')


@app.route('/my.css')
def css():
    return app.send_static_file('my.css')
