from cs50 import SQL
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from utils import login_required, error


# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///sudokubrain.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response



# INDEX

@app.route("/")
def index():
    return render_template("index.html")



# LOGIN / LOGOUT

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return error("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return error("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["password"], request.form.get("password")):
            return error("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


#REGISTER ACCOUNT


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return error("User Name can't be blank!")
        if not password:
            return error("Password can't be blank!")
        if not confirmation:
            return error("Confirmation can't be blank!")
        if password != confirmation:
            return error("Passwords does not match!")
        if db.execute("SELECT * FROM users WHERE username = ?", username):
            return error("User Name already taken")

        hashed_password = generate_password_hash(password)

        new_user = db.execute("INSERT INTO users (username, password) VALUES(?, ?)", username, hashed_password)

        session["user_id"] = new_user

        return redirect("/")

    else:
        return render_template("register.html")



# EDIT / DELETE ACCOUNT

@app.route("/resetUsername", methods=["POST"])
@login_required
def resetUsername():
    newUsername = request.form.get("username")
    if not newUsername:
        return error("New Username can't be blank!")
    if db.execute("SELECT * FROM users WHERE username = ?", newUsername):
        return error("User Name already taken")

    db.execute("UPDATE users SET username = ? WHERE id = ?", newUsername, session["user_id"])

    return redirect("/")


@app.route("/resetPassword", methods=["POST"])
@login_required
def resetPassword():
    newPassword = request.form.get("password")
    confirmation = request.form.get("confirmation")
    if not newPassword:
        return error("Password can't be blank!")
    if not confirmation:
        return error("Confirmation can't be blank!")
    if newPassword != confirmation:
        return error("Passwords does not match!")

    newHashedPassword = generate_password_hash(newPassword)

    db.execute("UPDATE users SET password = ? WHERE id = ?", newHashedPassword, session["user_id"])

    return redirect("/")


@app.route("/deleteAccount", methods=["POST"])
@login_required
def delete():
    """Delete user"""
    if request.method == "POST":
        db.execute("DELETE FROM users WHERE id = ?", session["user_id"])
        session.clear()

        return redirect("/")


#PROFILE PAGE

@app.route("/profile")
@login_required
def profile():
    user = db.execute("SELECT * FROM users WHERE id = ?", session["user_id"])
    userName = user[0]["username"]
    userPoints = user[0]["points"]

    userRanking = db.execute("SELECT * FROM users ORDER BY points DESC")

    return render_template("profile.html", name=userName, points=userPoints, userRanking=userRanking)


#Ranking PAGE

@app.route("/ranking")
def ranking():
    usersRanking = db.execute("SELECT * FROM users ORDER BY points DESC LIMIT 10")

    return render_template("ranking.html", usersRanking=usersRanking)


#PlayTheGame

@app.route("/gamePlay")
def play():
    return render_template("gamePlay.html")


#If the game is Won
@app.route("/gameWon", methods=["POST"])
def won():
    if (session["user_id"]):
        db.execute("UPDATE users SET points = (points + 1) WHERE id = ?", session["user_id"])
    return redirect("ranking.html")
