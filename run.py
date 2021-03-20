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
from sqlalchemy import update
# creates Flask object
app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# creates SQLALCHEMY object
db = SQLAlchemy(app)

#Database for users
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(80))
    isActive = db.Column(db.Integer)
class Tower(db.Model):
    __tablename__ = 'tower'
    towerid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    towername = db.Column(db.String(50), unique=True)

class Status(db.Model):
    __tablename__ = 'status'
    statusid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    statusname = db.Column(db.String(50), unique=True)

class Weeklytracker(db.Model):
    __tablename__ = 'weeklytracker'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), db.ForeignKey('user.id'))
    tower = db.Column(db.String(50), db.ForeignKey('tower.towername'))
    site = db.Column(db.String(50))
    tasknumber = db.Column(db.String(30))
    Details = db.Column(db.String(750))
    Receiveddate = db.Column(db.DateTime, default=datetime.utcnow)
    Activitydate = db.Column(db.DateTime, default=datetime.utcnow)
    Resource = db.Column(db.String(50), db.ForeignKey('user.username'))
    Responsible = db.Column(db.String(20),db.ForeignKey('user.username'))
    status = db.Column(db.String(50), db.ForeignKey('status.statusname'))
    formid = db.relationship("User", foreign_keys=[public_id])
    resource_name = db.relationship("User", foreign_keys=[Resource])
    responsible_name = db.relationship("User", foreign_keys=[Responsible])
    towers = db.relationship(Tower)
    statuss = db.relationship(Status)
#signup route
@app.route('/createuser', methods=['POST'])
def UserRegistration():
    data = request.form

    #gets username email and Password
    username, email = data.get('username'), data.get('email')
    password = data.get('password')
    isActive = data.get('isActive')

    #checking if the user is already existing
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(
        id = str(uuid.uuid4()),
        username = username,
        email = email,
        password = generate_password_hash(password),
        isActive = isActive
        )
        #insert User
        db.session.add(user)
        db.session.commit()

        return make_response('Successfully registered!')
    else:
        return make_response('User already exist. Please Log in.')

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
            return make_response('Token is missing!', 401)
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            current_user = User.query.filter_by(id=payload['id']).first()
        except:
            return make_response('Token is invalid !!')
        return f(*args, **kwargs)
    return decorated


#for login
@app.route('/login', methods=['POST'])
def Userlogin():
    auth = request.form

    if not auth or not auth.get('username') or not auth.get('password'):
        return make_response('Username and password should not be blank!', 401)
    user = User.query.filter_by(username = auth.get('username')).first()

    if not user:
        return make_response('User does not exist!', 401)
    if check_password_hash(user.password, auth.get('password')):
        #generate the jwt token
        token = jwt.encode({
        'id': user.id,
        'exp' : datetime.utcnow() + timedelta(minutes= 30)
        }, "secret",algorithm="HS256")
        return make_response(token)
    return make_response('Password is wrong!', 403)

#get tower data
@app.route('/tower')
@token_required
def gettower():
    addtowernames = Tower.query.all()
    toweroutput = []
    for tower in addtowernames:
        toweroutput.append(tower.towername)
    print(toweroutput)
    return make_response('Done')


#get Status data
@app.route('/status')
@token_required
def getstatus():
    statuss = Status.query.all()
    statusoutput = []
    for status in statuss:
        statusoutput.append(status.statusname)
    print(statusoutput)
    return make_response('Done')


#get resource Name
@app.route('/resource')
@token_required
def getresourcename():
    resources = User.query.all()
    resourceoutput = []
    for resource in resources:
        resourceoutput.append(resource.username)
    print(resourceoutput)
    return make_response('Done')


#get responsible Name
@app.route('/responsible')
@token_required
def getrsponsiblename():
    respo = User.query.all()
    respon = []
    for responsibles in respo:
        respon.append(responsibles.username)
    print(respon)
    return make_response('Done')


# add form data
@app.route('/createform', methods=['POST'])
@token_required
def addform():
    datas = request.form
    public_id = datas.get('public_id')
    tower = datas.get('tower')
    site = datas.get('site')
    tasknumber = datas.get('tasknumber')
    Details = datas.get('Details')
    Receiveddate = datas.get('Receiveddate')
    Activitydate = datas.get('Activitydate')
    Resource = datas.get('Resource')
    Responsible = datas.get('Responsible')
    status = datas.get('status')
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        current_user = User.query.filter_by(id=payload['id']).first()
        flag = payload['id']
    weeklyform = Weeklytracker(
    public_id = flag,
    tower = tower,
    site = site,
    tasknumber =tasknumber,
    Details = Details,
    Receiveddate = datetime.strptime(Receiveddate, '%d-%m-%Y %H:%M'),
    Activitydate = datetime.strptime(Activitydate,'%d-%m-%Y %H:%M'),
    Resource = Resource,
    Responsible = Responsible,
    status = status
    )
    try:
        db.session.add(weeklyform)
        db.session.commit()
        return make_response('Form Added Successfully')
    except:
        return make_response('Error', 401)

#export form data
@app.route('/exportdata')
@token_required
def getformdata():
    weeks = Weeklytracker.query.all()
    weekform = []
    for week in weeks:
        weekform.append({
        'id' : week.id,
        'public_id' : week.public_id,
        'tower' : week.tower,
        'site' : week.site,
        'tasknumber' : week.tasknumber,
        'Details' : week.Details,
        'Resource' : week.Resource,
        'Responsible' : week.Responsible,
        'status' : week.status,
        'Receiveddate' : str(week.Receiveddate),
        'Activitydate' : str(week.Activitydate),
        })
    df = pd.DataFrame(weekform)
    df['Receiveddate'] = df['Receiveddate'].apply(lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M:%S'))
    df['Received_date'] = [d.date() for d in df['Receiveddate']]
    df['Received_time'] = [d.time() for d in df['Receiveddate']]
    df['Activitydate'] = df['Activitydate'].apply(lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M:%S'))
    df['Activity_date'] = [d.date() for d in df['Activitydate']]
    df['Activity_time'] = [d.time() for d in df['Activitydate']]
    df.pop("Receiveddate")
    df.pop("Activitydate")
    df.to_csv('formdata.csv', index=False)
    return make_response('Exported Form Data into csv')


#update form Data
@app.route('/update', methods=['POST'])
@token_required
def updatedata():
    adding = request.form
    id = adding.get('id')
    this_form = Weeklytracker.query.filter_by(id=id).first()
    tower = adding.get('tower')
    site = adding.get('site')
    Details = adding.get('Details')
    Receiveddate = str(adding.get('Receiveddate'))
    Activitydate = str(adding.get('Activitydate'))
    Resource = adding.get('Resource')
    Responsible = adding.get('Responsible')
    status = adding.get('status')
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        current_user = User.query.filter_by(id=payload['id']).first()
        flag = payload['id']
    this_form.public_id = flag
    this_form.tower = tower
    this_form.site = site
    this_form.Details = Details
    this_form.Receiveddate = datetime.strptime(Receiveddate, '%d-%m-%Y %H:%M')
    this_form.Activitydate = datetime.strptime(Activitydate,'%d-%m-%Y %H:%M')
    this_form.Resource = Resource
    this_form.Responsible = Responsible
    this_form.status = status
    db.session.commit()
    return make_response('Done')


#delete form Data
@app.route('/delete', methods=['POST'])
@token_required
def deletedata():
    deletes = request.form
    id = deletes.get('id')
    delete_data = Weeklytracker.query.filter_by(id=id).first()
    db.session.delete(delete_data)
    db.session.commit()
    return make_response('Data Deleted!')

@app.route('/')
def index():
    return make_response('App Build Successful!')

if __name__=="__main__":
    app.run(debug=True)
