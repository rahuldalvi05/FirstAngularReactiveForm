from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid # for public id
from  werkzeug.security import generate_password_hash, check_password_hash
# imports for PyJWT authentication
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_restful import Resource, reqparse
from flask_restful import Api
from flask_cors import CORS, cross_origin
import pandas as pd
# creates Flask object
app = Flask(__name__)
api = Api(app)
CORS(app)
# configuration
# NEVER HARDCODE YOUR CONFIGURATION IN YOUR CODE
# INSTEAD CREATE A .env FILE AND STORE IN IT
#app.config['SECRET_KEY'] = 'your secret key'
# database name
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# creates SQLALCHEMY object
db = SQLAlchemy(app)

# Database ORMs
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(80))


# Database name tower
class Tower(db.Model):
    towerid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    towername = db.Column(db.String(50), unique=True)


#Database name Status
class Status(db.Model):
    statusid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    statusname = db.Column(db.String(50), unique=True)


#Database name Resource
class Resources(db.Model):
    __tablename__ = 'resource'
    resourceid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resourceName = db.Column(db.String(50), unique=True)
    resourceEmail = db.Column(db.String(70), unique=True)
    resourcePassword = db.Column(db.String(80))
    resourceIsActive = db.Column(db.Integer)
    resourceIsSupportResource = db.Column(db.Integer)


# Database name Responsible
class Responsible(db.Model):
    __tablename__ = 'responsible'
    responsibleid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    responsibleName = db.Column(db.String(50), unique=True)
    responsibleEmail = db.Column(db.String(70), unique=True)
    responsiblePassword = db.Column(db.String(80))
    responsibleIsActive = db.Column(db.Integer)
    responsibleIsSupportResponsible = db.Column(db.Integer)



#create a Database for Weeklytrackerform
class weeklytracker(db.Model):
    __tablename__ = 'weeklytrack'
    user = db.relationship(User)
    tower = db.relationship(Tower)
    status = db.relationship(Status)
    resource = db.relationship(Resources)
    responsible = db.relationship(Responsible)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), db.ForeignKey('user.public_id'))
    tower = db.Column(db.String(50), db.ForeignKey('tower.towername'))
    site = db.Column(db.String(50))
    tasknumber = db.Column(db.String(30))
    Details = db.Column(db.String(750))
    Receiveddate = db.Column(db.DateTime, default=datetime.utcnow)
    Activitydate = db.Column(db.DateTime, default=datetime.utcnow)
    Resource = db.Column(db.String(50), db.ForeignKey('resource.resourceName'))
    Responsible = db.Column(db.String(20),db.ForeignKey('responsible.responsibleName'))
    Status = db.Column(db.String(50), db.ForeignKey('status.statusname'))

#decorator for verifying the JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        #jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        #return 401 if token is not passed
        if not token:
            return make_response(jsonify({'message':'Token is missing!'}), 401)
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=payload['public_id']).first()
            flag = payload['public_id']
        except:
            return jsonify({'message' : 'Token is invalid !!'}), 401
        return f(*args, **kwargs)
    return decorated
#signup route
class UserRegistration(Resource):
    def post(self):
        data = request.form

        #gets username email and password
        username, email = data.get('username'), data.get('email')
        password = data.get('password')

        #checking for existing User
        user = User.query.filter_by(username=username).first()
        if not user:
            user = User(
            public_id = str(uuid.uuid4()),
            username = username,
            email = email,
            password = generate_password_hash(password)
            )
            #insert User
            db.session.add(user)
            db.session.commit()

            return make_response(jsonify({'message': 'Succesfully registered !'}))
        else:
            return make_response(jsonify({'message': 'User already exist. Please Log in.'}))

#loginroute
class Userlogin(Resource):
    def post(self):
        # creates a dictionary of form data
        auth = request.form

        if not auth or not auth.get('username') or not auth.get('password'):
            #returns an error that username or / and password is missing
            return make_response(jsonify({'message': 'Username and password should not be blank!'}), 401)
        user = User.query.filter_by(username = auth.get('username')).first()

        if not user:
            return make_response(jsonify({'message': 'User does not exist!'}), 401)
        if check_password_hash(user.password, auth.get('password')):
            #generate the jwt token
            token = jwt.encode({
            'public_id': user.public_id,
            'exp' : datetime.utcnow() + timedelta(minutes = 60)
            }, "secret",algorithm="HS256")
            return make_response(jsonify({'token' : token}), 201)
        return make_response(jsonify({'message': 'Password is wrong!'}), 403)
#getalluser
class getalluser(Resource):
    @token_required
    def get(self):
        users = User.query.all()
        #converting the query objects
        #to list of jsons
        print(users)
        output = []
        for user in users:
            output.append({
            'username': user.username,
            'email': user.email,
            })
        print(output)
        return make_response(jsonify({'users': output}))

#get the tower name in the form
class gettower(Resource):
    @token_required
    def get(self):
        addtowernames = Tower.query.all()
        print(addtowernames)
        toweroutput = []
        for tower in addtowernames:
            toweroutput.append({
            'towername':tower.towername,
            })
        return jsonify({'towers': toweroutput})

#get wether the status is pending or complted
class getstatus(Resource):
    @token_required
    def get(self):
        statuss = Status.query.all()
        statusoutput = []
        for status in statuss:
            statusoutput.append({
            'statusname': status.statusname,
            })
        return jsonify({'Status':statusoutput})


#get all resource persons name in the form
class getResources(Resource):
    @token_required
    def get(self):
        Resourcess = Resources.query.all()
        resourceoutput = []
        for resource in Resourcess:
            resourceoutput.append({
            'Name': resource.resourceName,
            })
        return jsonify({'Name': resourceoutput})

#get all responsible persons name in the form
class getResponsible(Resource):
    @token_required
    def get(self):
        Responsibless = Responsible.query.all()
        responsibleoutput = []
        for responsible in Responsibless:
            responsibleoutput.append({
            'RepName': responsible.responsibleName
            })
        return jsonify({'RepName':responsibleoutput})

#add weeklytracker forms
class Weeklytrackerform(Resource):
    @token_required
    def post(self):
        datas = request.form
        tower = datas.get('tower')
        site = datas.get('site')
        tasknumber = datas.get('tasknumber')
        Details = datas.get('Details')
        Receiveddate = datas.get('Receiveddate')
        Activitydate = str(datas.get('Activitydate'))
        Resource = datas.get('Resource')
        Responsible = datas.get('Responsible')
        Status = datas.get('Status')
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=payload['public_id']).first()
            flag = payload['public_id']
        weeklyfrom = weeklytracker(
        public_id = flag,
        tower = tower,
        site = site,
        tasknumber =tasknumber,
        Details = Details,
        Receiveddate = datetime.strptime(Receiveddate, '%d-%m-%Y %H:%M'),
        Activitydate = datetime.strptime(Activitydate,'%d-%m-%Y %H:%M'),
        Resource = Resource,
        Responsible = Responsible,
        Status = Status
        )
        #insert Weeklyform
        #print(Userlogin.flag)
        try:
            db.session.add(weeklyfrom)
            db.session.commit()
            return jsonify({'message':'Form Added Successfully'})
        except:
            return jsonify({'message':'Error'}), 401

class getformdata(Resource):
    def get(self):
        weeks = weeklytracker.query.all()
        weekform = []
        for week in weeks:
            weekform.append({
            'id' : week.id,
            'public_id' : week.public_id,
            'tower' : week.tower,
            'site' : week.site,
            'tasknumber' : week.tasknumber,
            'Details' : week.Details,
            'Receiveddate' : str(week.Receiveddate),
            'Activitydate' : str(week.Activitydate),
            'Resource' : week.Resource,
            'Responsible' : week.Responsible,
            'Status' : week.Status,
            })
        print(type(weekform))
        df = pd.DataFrame(weekform)
        df.to_csv('formdata.csv', index=False)
        return jsonify({'formdata': weekform})
@app.route('/')
def index():
    return make_response(jsonify({'message':'App Build Successful!'}))

api.add_resource(UserRegistration, '/signup')
api.add_resource(Userlogin, '/login')
api.add_resource(getalluser,'/userlist')
api.add_resource(gettower,'/tower')
api.add_resource(getstatus, '/status')
api.add_resource(getResources, '/resource')
api.add_resource(getResponsible, '/responsible')
api.add_resource(Weeklytrackerform, '/createform')
api.add_resource(getformdata, '/formdata')
if __name__=="__main__":
    app.run(debug=True)
