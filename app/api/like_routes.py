from flask import Blueprint, request
from sqlalchemy import and_, or_
from app.models import Like, User, db
from flask_login import current_user, login_required

like_routes = Blueprint('like', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@like_routes.route('/', methods=['POST'])
@login_required
def create_like():
    """
    Create a like.
    """

    data = request.get_json()

    # Create the like
    like = Like(
        user_id=current_user.id,
        post_id=data['post_id'],
        comment_id=data['comment_id'],
    )

    db.session.add(like)
    db.session.commit()

    return like.to_dict()


@like_routes.route('/')
@login_required
def read_likes():
    """
    Read likes for current user.
    """

    likes = Like.query.filter(Like.user_id == current_user.id)

    return {'likes': [like.to_dict() for like in likes]}


@ like_routes.route('/<int:id>/', methods=['DELETE'])
@ login_required
def delete_like(id):
    """
    Delete a post.
    """

    like = Like.query.get(id)

    if not like:
        return {"errors": ["Like not found."]}, 400
    if like.user_id != current_user.id:
        return {'errors': ["You don't own this like."]}, 403

    db.session.delete(like)
    db.session.commit()

    return {"id": id}
