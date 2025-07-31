# Copyright 2024 <Votre nom et code permanent>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, request
from flask import render_template
from flask import g
from flask import redirect
from flask import url_for
from .database import Database

app = Flask(__name__, static_url_path="", static_folder="static")


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        g._database = Database()
    return g._database


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.disconnect()


@app.route('/')
def form():
    # À remplacer par le contenu de votre choix.
    return render_template('form.html')

@app.route("/ajouter", methods=["GET", "POST"])
def ajouter():
    if request.method == "POST":
        print("before-insert")
        # récupérer les données du formulaire
        nom = request.form.get("nom")
        espece = request.form.get("espece")
        race = request.form.get("race")
        age = request.form.get("age")
        description = request.form.get("description")
        courriel = request.form.get("courriel")
        adresse = request.form.get("adresse")
        ville = request.form.get("ville")
        cp = request.form.get("cp")
        print("pre-insert")
        # insérer dans la base
        db = get_db()
        last_id = db.add_animal(nom, espece, race, age, description, courriel, adresse, ville, cp)
        print("reussi")
        # rediriger
        return redirect(url_for('form'))
    return render_template("form.html")
