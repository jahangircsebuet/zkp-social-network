from flask import Blueprint, request
from sqlalchemy import and_, or_
from app.models import Post, Friend, User, db
from app.forms import PostForm, EditPostForm
from flask_login import current_user, login_required

post_routes = Blueprint('post', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@post_routes.route('/', methods=['POST'])
@login_required
def create_post():
    """
    Create a post.
    """

    form = PostForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Create the post
        post = Post(
            user_id=current_user.id,
            text=form.data['text'],
            image_link=form.data['image_link'],
            created_at=form.data['created_at'],
            edited_at=form.data['edited_at'],
        )
        print("current_user.id: ", current_user.id)
        print("form.data['text']: ", form.data['text'])
        db.session.add(post)
        db.session.commit()
        return post.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@post_routes.route('/')
@login_required
def read_posts():
    """
    Read posts.
    """

    posts = Post.query.select_from(User).join(Friend, or_(Friend.friend_id == User.id, Friend.user_id == User.id)).filter(
        and_(Friend.accepted == True, or_(Friend.user_id == current_user.id, Friend.friend_id == current_user.id))).all()

    my_posts = Post.query.filter(Post.user_id == current_user.id).all()

    return {'posts': [post.to_dict() for post in [*posts, *my_posts]]}


@ post_routes.route('/<int:id>/', methods=['PATCH'])
@ login_required
def update_post(id):
    """
    Update a post.
    """

    form = EditPostForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Update the post
        post = Post.query.get(id)

        if post.user_id != current_user.id:
            return {'errors': ["You don't own this post."]}, 403

        post.text = form.data['text']
        post.image_link = form.data['image_link']
        post.edited_at = form.data['edited_at']

        db.session.commit()
        return post.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@ post_routes.route('/<int:id>/', methods=['DELETE'])
@ login_required
def delete_post(id):
    """
    Delete a post.
    """

    post = Post.query.get(id)

    if not post:
        return {"errors": ["Post not found."]}, 400
    if post.user_id != current_user.id:
        return {'errors': ["You don't own this post."]}, 403

    db.session.delete(post)
    db.session.commit()
    return {"id": id}
