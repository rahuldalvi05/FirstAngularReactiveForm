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
class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()
    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
            'username': x.username,
            'password': x.password
        }
        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}
    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}
    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)
    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)
parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)
class UserRegistration(Resource):
    def post(self):
        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
          return {'message': 'User {} already exists'. format(data['username'])}
        new_user = UserModel(
        username = data['username'],
        password = UserModel.generate_hash(data['password'])
        )
        try:
            new_user.save_to_db()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created'.format(data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = UserModel.find_by_username(data['username'])
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}

        if UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}


class UserLogoutAccess(Resource):
    def post(self):
        return {'message': 'User logout'}


class UserLogoutRefresh(Resource):
    def post(self):
        return {'message': 'User logout'}


class TokenRefresh(Resource):
    def post(self):
        return {'message': 'Token refresh'}


class AllUsers(Resource):
    def get(self):
        return UserModel.return_all()

    def delete(self):
        return UserModel.delete_all()


class SecretResource(Resource):
    @jwt_required
    def get(self):
        return
        {
            'answer': 42
        }

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

    def saving_to_db(self):
        db.session.add(self)
        db.session.commit()
    @classmethod
    def retun_data(cls):
        def to_jsons(y):
            return {
            'id' : y.id,
            'tower' : y.tower,
            'site' : y.site,
            'tasknumber' : y.tasknumber,
            'Details' : y.Details,
            'Receiveddate' : str(y.Receiveddate),
            'Activitydate' : str(y.Activitydate),
            'PlannedResource' : y.PlannedResource,
            'Responsible' : y.Responsible,
            'Status' : y.Status
            }
        return {'forms' : list(map(lambda y: to_jsons(y), Weeklytrackerform.query.all()))}
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
class Weeklyform(Resource):
    def post(self):
        datas = parsers.parse_args()
        new_form = Weeklytrackerform(tower = datas['tower'],site = datas['site'],tasknumber = datas['tasknumber'],
        Details = datas['Details'],Receiveddate = datetime.strptime(datas['Receiveddate'], '%d-%m-%Y %H:%M'),
        Activitydate = datetime.strptime(datas['Activitydate'], '%d-%m-%Y %H:%M'),PlannedResource = datas['PlannedResource'],
        Responsible = datas['Responsible'],Status = datas['Status'])
        try:
            new_form.saving_to_db()
            return {
            'message': 'The New Form is created'}
        except:
            return {'message': 'Something went wrong'}, 500

class Allforms(Resource):
    def get(self):
        return Weeklytrackerform.retun_data()
@app.route('/',methods=['GET'])
def index():
    print(request.data)
    return jsonify({'message': 'Hello, World'})

@app.route('/login/add/',methods=['POST'])
def index2():
    y = json.loads(request.data)
    print(y['site'])
    return jsonify({'message': 'Hello, World'})
    

@app.route('/add', methods=['POST'])
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



 
api.add_resource(UserRegistration, '/registration')
api.add_resource(UserLogin, '/login')
api.add_resource(UserLogoutAccess, '/logout/access')
api.add_resource(UserLogoutRefresh, '/logout/refresh')
api.add_resource(TokenRefresh, '/token/refresh')
api.add_resource(AllUsers, '/users')
api.add_resource(SecretResource, '/secret')
api.add_resource(Weeklyform, '/add1')
api.add_resource(Allforms, '/login/export')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
