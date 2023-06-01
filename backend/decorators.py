from functools import wraps
from flask import session, redirect, request, jsonify
from models import User


def login_required(function):
    @wraps(function)
    def wrap(*args, **kwargs):
        print(session)
        if "user" in session:
            return function(*args, **kwargs)
        # return redirect("/login")
        return False

    return wrap


def token_required(function):
    @wraps(function)
    def wrap(*args, **kwargs):
        print(session)
        if request.headers.get("auth_token") and request.headers["auth_token"] != "":
            user = User.query.filter_by(auth_token=request.headers["auth_token"]).first()
            if user:
                return function(*args, **kwargs)

        return jsonify({"message": "Token invalid"})

    return wrap