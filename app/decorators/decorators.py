from functools import wraps
from flask import request, jsonify
import jwt.api_jwt as jwt
from app.models import User


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        user = None
        data = request.json
        print("decorator->token_required")
        print(data)
        if 'token' in request.headers:
            token = request.headers['token']
            print("token: ", token)

        if token is None:
            return f(None, token, *args, **kwargs)
            # return jsonify({'success': False, 'message': 'A valid token is missing!'})

        try:
            data = jwt.decode(token, "secret", algorithms=["HS256"])
            print("data: ", data)
            user = User.query.filter_by(email=data['email']).first()
            print("user.to_dict(): ", user.to_dict())
        except Exception as e:
            print("exception in jwt.decode")
            print(e)
            # return jsonify({'success': False, 'message': 'Token is invalid!'})
            return f(user, token, *args, **kwargs)
        return f(user, token, *args, **kwargs)

    return decorator
