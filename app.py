from flask import Flask,render_template,request
from flask_mail import Mail,Message

app = Flask(__name__)


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = "rahul5dalvi99@gmail.com"
app.config['MAIL_PASSWORD'] = "Rahulrd@05"
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


@app.route('/')
def index():
    msg = Message('Hello', sender = 'rahul5dalvi99@gmail.com', recipients = ['rahuldavi1999@gmail.com'])
    msg.body = "hello guyys"
    mail.send(msg)
    return "Sent"
if __name__=="__main__":
    app.run(debug=True)
