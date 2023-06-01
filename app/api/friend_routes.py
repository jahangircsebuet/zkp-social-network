from flask import Blueprint, request
from app.models import Friend, User, db
from app.forms import FriendForm
from flask_login import current_user, login_required
from sqlalchemy import and_, or_


friend_routes = Blueprint('friend', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@friend_routes.route('/', methods=['POST'])
@login_required
def create_friend_request():
    """
    Create a friend request.
    """

    form = FriendForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Create the friend request
        friend_request = Friend(
            user_id=current_user.id,
            friend_id=form.data['friend_id'],
            accepted=False,
        )

        # Get friend user
        friend = User.query.get(form.data['friend_id'])

        db.session.add(friend_request)
        db.session.commit()
        return friend.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@friend_routes.route('/')
@login_required
def read_friends():
    """
    Read all friends.
    """
    friends = User.query.join(Friend, and_(Friend.accepted == True, or_(
        Friend.friend_id == User.id, Friend.user_id == User.id))).filter(User.id != current_user.id).all()

    return {'friends': [friend.to_dict() for friend in friends]}


@friend_routes.route('/requests/')
@login_required
def read_friend_requests():
    """
    Read all friend requests.
    """
    friend_requests = User.query.join(Friend, Friend.user_id == User.id).filter(
        and_(Friend.accepted == False, User.id != current_user.id, Friend.friend_id == current_user.id)).all()

    return {'friend_requests': [friend_request.to_dict() for friend_request in friend_requests]}


@friend_routes.route('/requests/sent/')
@login_required
def read_sent_requests():
    """
    Read all sent requests.
    """
    friend_requests = User.query.join(Friend, Friend.friend_id == User.id).filter(
        and_(Friend.accepted == False, User.id != current_user.id, Friend.user_id == current_user.id)).all()

    return {'friend_requests': [friend_request.to_dict() for friend_request in friend_requests]}


@friend_routes.route('/', methods=['PATCH'])
@login_required
def update_friend():
    """
    Accept a friend request.
    """

    form = FriendForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        friend_request = Friend.query.filter(
            or_(and_(Friend.user_id == form.data['user_id'], Friend.friend_id == form.data['friend_id']), and_(Friend.user_id == form.data['friend_id'], Friend.friend_id == form.data['user_id']))).first()

        # Check if current user is part of the friend request
        if friend_request.user_id != current_user.id and friend_request.friend_id != current_user.id:
            return {'errors': [{"user": "You can't accept this friend request."}]}

        # Update the friend request
        friend_request.accepted = True

        db.session.commit()
        return friend_request.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@friend_routes.route('/', methods=['DELETE'])
@login_required
def delete_friend():
    """
    Delete a friend or decline friend request.
    """

    form = FriendForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        friend = Friend.query.filter(
            or_(and_(Friend.user_id == form.data['user_id'], Friend.friend_id == form.data['friend_id']), and_(Friend.user_id == form.data['friend_id'], Friend.friend_id == form.data['user_id']))).first()

        if not friend:
            return {"errors": [{"friend": "Friend request not found."}]}
        if friend.user_id != current_user.id and friend.friend_id != current_user.id:
            return {'errors': [{"friend": "You aren't a part of this friendship."}]}

        db.session.delete(friend)
        db.session.commit()
        return friend.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
