#flask --app server run --debug
from flask import Flask, render_template


app = Flask(__name__)
app.secret_key = "Samifriends"



#@app.route("/contact.html")
#def contact():
      
#    return render_template("contact.html")

@app.route("/",methods=['GET','POST'])
def index():    
    return render_template("index.html",)


if __name__ == '__main__':
    app.run(debug=True)