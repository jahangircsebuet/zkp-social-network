from flask import Blueprint, request
from app.models import Comment, db
from app.forms import CommentForm, EditCommentForm
from flask_login import current_user, login_required

comment_routes = Blueprint('comment', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@comment_routes.route('/', methods=['POST'])
@login_required
def create_comment():
    """
    Create a comment.
    """

    form = CommentForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Create the comment
        comment = Comment(
            user_id=current_user.id,
            text=form.data['text'],
            post_id=form.data['post_id'],
            created_at=form.data['created_at'],
            edited_at=form.data['edited_at'],
        )
        db.session.add(comment)
        db.session.commit()
        return comment.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@comment_routes.route('/<int:id>/')
@login_required
def read_comments(id):
    """
    Read comments of a post.
    """

    post_comments = Comment.query.filter(
        Comment.post_id == id).all()

    return {'comments': [comment.to_dict() for comment in post_comments]}


@comment_routes.route('/<int:id>/', methods=['PATCH'])
@login_required
def update_comment(id):
    """
    Update a comment.
    """

    form = EditCommentForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Update the comment
        comment = Comment.query.get(id)

        if comment.user_id != current_user.id:
            return {'errors': ["You don't own this comment."]}, 403

        comment.text = form.data['text'],
        comment.edited_at = form.data['edited_at'],

        db.session.commit()
        return comment.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@comment_routes.route('/<int:id>/', methods=['DELETE'])
@login_required
def delete_comment(id):
    """
    Delete a comment.
    """

    comment = Comment.query.get(id)

    if not comment:
        return {"errors": ["Comment not found."]}, 400
    if comment.user_id != current_user.id:
        return {'errors': ["You don't own this comment."]}, 403

    db.session.delete(comment)
    db.session.commit()
    return comment.to_dict()
