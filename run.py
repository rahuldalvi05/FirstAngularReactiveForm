from flask import Flask, request, jsonify, make_response, Response, send_file,render_template
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
from sqlalchemy import update
import json
import pandas as pd
import csv
from flask_mail import Mail,Message
# creates Flask object
app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = "rahulwmg767@gmail.com"
app.config['MAIL_PASSWORD'] = "Test@1234"
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

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
    data = request.data
    data = json.loads(data)
    #gets username email and Password
    username, email = data.get('username'), data.get('email')
    password = data.get('password')
    isActive = data.get('isActive')
    if isActive == "true":
        isActive = 1
    elif isActive == None:
        isActive = 0
    #checking if the user is already existing
    user = User.query.filter_by(username=username).first()
    em = User.query.filter_by(email=email).first()
    if not user and not em:
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

        return jsonify({'message':'User Registered Successfully!','status':1})
    else:
        return jsonify({'message':'User already exist. Please Log in.','status':0})

#decorator for verifying the JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        #jwt is passed in the request header
        if 'X-Access-Token' in request.headers:
            token = request.headers['X-Access-Token']
        #return 401 if token is not passed
        if not token:
            return jsonify({'message':'Token is missing!'})
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            current_user = User.query.filter_by(id=payload['id']).first()
        except:
            return jsonify({'message':'Token is invalid !!'})
        return f(*args, **kwargs)
    return decorated


#for login
@app.route('/login', methods=['POST'])
def Userlogin():
    auth = request.data
    auth = json.loads(auth)
    if not auth or not auth.get('username') or not auth.get('password'):
        return make_response('Username and password should not be blank!', 401)
    user = User.query.filter_by(username = auth.get('username')).first()

    if not user:
        return jsonify({'message':'User does not exist please login'})
    if check_password_hash(user.password, auth.get('password')):
        #generate the jwt token
        token = jwt.encode({
        'id': user.id,
        'exp' : datetime.utcnow() + timedelta(minutes= 120)
        }, "secret",algorithm="HS256")
        return jsonify({'message':'Login Successful!', 'token':token, 'status':1})
    return jsonify({'message':'User Name or Password is wrong!','status':0})

#get tower data
@app.route('/tower')
@token_required
def gettower():
    addtowernames = Tower.query.all()
    toweroutput = []
    for tower in addtowernames:
        toweroutput.append({"towername":tower.towername})
    return jsonify(toweroutput)


#get Status data
@app.route('/status')
@token_required
def getstatus():
    statuss = Status.query.all()
    statusoutput = []
    for status in statuss:
        statusoutput.append({"statusname":status.statusname})
    return jsonify(statusoutput)


#get resource Name
@app.route('/resource')
@token_required
def getresourcename():
    resources = User.query.all()
    resourceoutput = []
    for resource in resources:
        resourceoutput.append({"resourcename":resource.username})
    return jsonify(resourceoutput)


#get responsible Name
@app.route('/responsible')
@token_required
def getrsponsiblename():
    respo = User.query.all()
    respon = []
    for responsibles in respo:
        respon.append({"responname":responsibles.username})
    return jsonify(respon)


# add form data
@app.route('/createform', methods=['POST'])
@token_required
def addform():
    datas = request.data
    datas = json.loads(datas)
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
    weeklyfrom = Weeklytracker(
    public_id = public_id,
    tower = tower,
    site = site,
    tasknumber =tasknumber,
    Details = Details,
    Receiveddate = datetime.strptime(Receiveddate, '%Y-%m-%dT%H:%M'),
    Activitydate = datetime.strptime(Activitydate,'%Y-%m-%dT%H:%M'),
    Resource = Resource,
    Responsible = Responsible,
    status = status
    )
    #insert Weeklyform
    try:
        db.session.add(weeklyfrom)
        db.session.commit()
        user = User.query.filter_by(username=Resource).first()
        email1 = user.email
        user1 = User.query.filter_by(username=Responsible).first()
        email2 = user1.email
        msg = Message('Weekly Activity Tracker :'+Activitydate[:10], sender = 'rahulwmg767@gmail.com', recipients = [email1])
        msg.body = "Hello "+Resource+","+"\n"+"Please refer below details for upcoming weekend Activity."+"\n"+"Task Number: " + tasknumber + "\n" + "Planned resource: " + Resource + "\n" + "Activity Date: " + Activitydate[:10] + "\n" + "Tower: "+tower+"\n"+"Site name: "+site+"\n"+"Task status at form submission: "+status
        mail.send(msg)
        msg = Message('Weekly Activity Tracker :'+Activitydate[:10], sender = 'rahulwmg767@gmail.com', recipients = [email2])
        msg.body = "Hello "+Responsible+","+"\n"+"Please refer below details for upcoming weekend Activity."+"\n"+"Task Number: " + tasknumber + "\n" + "Planned resource: " + Resource + "\n" + "Activity Date: " + Activitydate[:10] + "\n" + "Tower: "+tower+"\n"+"Site name: "+site+"\n"+"Task status at form submission: "+status
        mail.send(msg)
        return jsonify({'message':'Form Added Successfully!'})
    except:
        return jsonify({'message':'Error while Adding Form'})

#export form data
@app.route('/getdata')
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
    return jsonify(weekform)


@app.route('/getdata1')
@token_required
def getformdata1():
    id = None
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        id = payload['id']
    weeks = Weeklytracker.query.filter_by(public_id=id).all()
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
    return jsonify(weekform)
@app.route('/download')
def exportdata():
    weeks = Weeklytracker.query.all()
    weekform = []
    for week in weeks:
        s = str(week.Receiveddate)
        t = str(week.Activitydate)
        Received_date,Received_time = s.split(' ')
        Activity_date,Activity_time = t.split(' ')
        weekform.append({
        'Received_date' : Received_date,
        'Received_time' : Received_time,
        'Activity_date' : Activity_date,
        'Activity_time' : Activity_time,
        'id' : week.id,
        'public_id' : week.public_id,
        'tower' : week.tower,
        'site' : week.site,
        'tasknumber' : week.tasknumber,
        'Details' : week.Details,
        'Resource' : week.Resource,
        'Responsible' : week.Responsible,
        'status' : week.status
        })
    return jsonify(weekform)
#update form Data
@app.route('/update', methods=['POST'])
@token_required
def updatedata():
    adding = request.data
    adding = json.loads(adding)
    id = adding.get('id')
    this_form = Weeklytracker.query.filter_by(id=id).first()
    tower = adding.get('tower')
    public_id = adding.get('public_id')
    site = adding.get('site')
    tasknumber = adding.get('tasknumber')
    Details = adding.get('Details')
    Receiveddate = str(adding.get('Receiveddate'))
    if Receiveddate == 'None':
        Receiveddate = str(datetime.now())
        Receiveddate = Receiveddate.replace(" ","")
        Receiveddate = Receiveddate[:10] + 'T' + Receiveddate[10:15]
    Activitydate = str(adding.get('Activitydate'))
    if Activitydate == 'None':
        Activitydate = str(datetime.now())
        Activitydate = Activitydate.replace(" ","")
        Activitydate = Activitydate[:10] + 'T' + Activitydate[10:15]
    Resource = adding.get('Resource')
    Responsible = adding.get('Responsible')
    status = adding.get('status')
    this_form.public_id = public_id
    this_form.tower = tower
    this_form.site = site
    this_form.tasknumber = tasknumber
    this_form.Details = Details
    this_form.Receiveddate = datetime.strptime(Receiveddate,'%Y-%m-%dT%H:%M')
    this_form.Activitydate = datetime.strptime(Activitydate,'%Y-%m-%dT%H:%M')
    this_form.Resource = Resource
    this_form.Responsible = Responsible
    this_form.status = status
    db.session.commit()
    return jsonify({'message':'form updated Successfully!'})
#delete form Data
@app.route('/delete', methods=['POST'])
@token_required
def deletedata():
    deletes = request.data
    deletes = json.loads(deletes)
    id = deletes
    delete_data = Weeklytracker.query.filter_by(id=id).first()
    db.session.delete(delete_data)
    db.session.commit()
    return jsonify({'message':'Data Deleted!'})

@app.route('/')
def index():
    return jsonify({'message':'App build Successful'})

if __name__=="__main__":
    app.run(debug=True)
