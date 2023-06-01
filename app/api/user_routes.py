from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from sqlalchemy import and_, or_
from app.models import User
from app.models.friend import Friend

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.filter(User.id != current_user.id).all()
    friends = User.query.join(Friend, or_(Friend.friend_id == User.id,
                              Friend.user_id == User.id)).filter(and_(User.id != current_user.id, or_(Friend.user_id == current_user.id, Friend.friend_id == current_user.id))).all()

    # filter out friends
    users = [user for user in users if user not in friends]
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>/')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()
