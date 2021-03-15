from flask import Flask
from flask import jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, reqparse
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required,  get_jwt_identity)
from passlib.hash import pbkdf2_sha256 as sha256
import json
import sqlite3
from datetime import datetime
import flask_excel as excel
from flask_cors import CORS, cross_origin
from flask import request

from json import dumps
app = Flask(__name__)
jwt = JWTManager(app)
api = Api(app)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'some-secret-string'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'

db = SQLAlchemy(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/', methods = ['GET'])
def index():
    y = json.loads(request.data)
    print(y['site'])
    return jsonify({'message': 'Hello World!'})



###  creating table

class Weeklytrackerform(db.Model):
    __tablename__ = 'weeklytracker'

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    tower = db.Column(db.String(10), nullable=False)
    site = db.Column(db.String(50), nullable=False)
    tasknumber = db.Column(db.String(30), nullable=False)
    Details = db.Column(db.String(750), nullable=False)
    Receiveddate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    Activitydate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    PlannedResource = db.Column(db.String(25), nullable=False)
    Responsible = db.Column(db.String(25), nullable=False)
    Status = db.Column(db.String(15), nullable=False)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


parsers = reqparse.RequestParser()
parsers.add_argument('tower', help = 'This field cannot be blank', required=True)
parsers.add_argument('site', help = 'This field cannot be blank', required=True)
parsers.add_argument('tasknumber', help = 'This field cannot be blank', required=True)
parsers.add_argument('Details', help = 'This field cannot be blank', required=True)
parsers.add_argument('Receiveddate', help = 'This field cannot be blank', required=True)
parsers.add_argument('Activitydate', help = 'This field cannot be blank', required=True)
parsers.add_argument('PlannedResource', help = 'This field cannot be blank', required=True)
parsers.add_argument('Responsible', help = 'This field cannot be blank', required=True)
parsers.add_argument('Status', help = 'This field cannot be blank', required=True)

@app.route('/createform', methods=['POST'])
def create_form():
    data=json.loads(request.data)
    #datas = parsers.parse_args()
    print(data)
    return {'message':'Hi'}
    # new_form = Weeklytrackerform(tower = datas['tower'],site = datas['site'],tasknumber = datas['tasknumber'],
    # Details = datas['Details'],Receiveddate = datetime.strptime(datas['Receiveddate'], '%d-%m-%Y %H:%M'),
    # Activitydate = datetime.strptime(datas['Activitydate'], '%d-%m-%Y %H:%M'),PlannedResource = datas['PlannedResource'],
    # Responsible = datas['Responsible'],Status = datas['Status'])
    # try:
    #     new_form.save_to_db()
    #     return {'message': 'The New Form is created'}
    # except:
    #     return {'message': 'Something went wrong'}, 500


if __name__ == '__main__':
    app.run(debug=True)
