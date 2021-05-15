from flask import Flask,render_template,request
from flask_mail import Mail,Message

app = Flask(__name__)


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = "rahulwmg767@gmail.com"
app.config['MAIL_PASSWORD'] = "Omkar@123"
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


@app.route('/')
def index():
    msg = Message('Hello', sender = 'rahulwmg767@gmail.com', recipients = ['gaikwad.r.omkar@gmail.com'])
    msg.body = "hello guyys"
    mail.send(msg)
    return "Sent"
if __name__=="__main__":
    app.run(debug=True)
