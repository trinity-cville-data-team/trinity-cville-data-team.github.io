from flask import Flask, request
import re
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
grouped_members_dict = {}
for member in members_data.iterrows():
    lat = member[1][6]
    lng = member[1][7]
    members_list.append({
        'name': member[1][1],
        'lat':  lat,
        'lng': lng
    })
    hack_key = str(lat)+","+str(lng)
    grouped_members_dict[hack_key] = grouped_members_dict.get(hack_key, {'lat': lat, 'lng': lng})
    if 'name' in grouped_members_dict[hack_key]:
        grouped_members_dict[hack_key]['name'] += "<br />"+member[1][1]
    else:
        grouped_members_dict[hack_key]['name'] = member[1][1]
grouped_members_list = list(grouped_members_dict.values())

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

names_lowercase_to_uppercase = {x['name'].lower(): x['name'] for x in deacons_list+elders_list+members_list}
info_for_person = {x['name']: x for x in deacons_list+elders_list+members_list}

print "Found", len(members_list), "members,", len(deacons_list), "deacons, and", len(elders_list), "elders."

app = Flask(__name__)
app._static_folder = "."

@app.route("/members")
def members():
    return jsonify(grouped_members_list)

@app.route("/deacons")
def deacons():
    return jsonify(deacons_list)

@app.route("/elders")
def elders():
    return jsonify(elders_list)

def autocomplete_for(string):
    return [v for k, v in names_lowercase_to_uppercase.iteritems() if all([y in k for y in string.lower().split()])]

@app.route("/autocomplete")
def autocomplete():
    return jsonify(autocomplete_for(request.args.get("term")))

@app.route("/search")
def search():
    search_term = request.args.get("term")
    results = autocomplete_for(search_term)
    if len(results) > 0:
        return jsonify(info_for_person[results[0]])

@app.route("/parishes.kmz")
def parishes():
    return app.send_static_file("parishes.kmz")

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/my.js')
def javascript():
    return app.send_static_file('my.js')


@app.route('/my.css')
def css():
    return app.send_static_file('my.css')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
