import os
import uuid
import datetime
import jwt.api_jwt as jwt
from flask import Flask, render_template, request, session, redirect, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_login import LoginManager
from werkzeug.security import generate_password_hash, check_password_hash
from .decorators import decorators
from sqlalchemy import and_, or_
from sqlalchemy.orm import subqueryload

from .models import db, User, Friend, Post, Comment, Like
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.post_routes import post_routes
from .api.comment_routes import comment_routes
from .api.aws_routes import aws_routes
from .api.friend_routes import friend_routes
from .api.profile_routes import profile_routes
from .api.like_routes import like_routes
from .api.qa_routes import qa_routes

from .seeds import seed_commands
from .config import Config

app = Flask(__name__)
# Tell flask about our seed commands
app.cli.add_command(seed_commands)
app.config.from_object(Config)
db.init_app(app)
Migrate(app, db)
# Application Security
CORS(app)
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

# Create two constant. They direct to the app root folder and logo upload folder
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
POST_IMAGE_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static', 'post-images')
app.config['POST_IMAGE_UPLOAD_FOLDER'] = POST_IMAGE_UPLOAD_FOLDER


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


# #####################################friend related apis#####################################

@app.route('/friends/requests/received', methods=['GET'])
# @decorators.token_required
def read_received_friend_requests(user=None, token=None):
    """
    Read all received friend requests.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        # TODO change static user id
        friend_requests = User.query.join(Friend, Friend.user_id == User.id).filter(
            and_(Friend.accepted == False, User.id != 12, Friend.friend_id == 12)).all()
        return jsonify(
            {'friend_requests': [friend_request.to_dict() for friend_request in friend_requests], 'success': True,
             'message': 'Friend requests read successfully!'})
    except Exception as e:
        print(e)
        return jsonify(
            {'friend_requests': None, 'success': False,
             'message': 'Friend requests read failed!'})


@app.route('/friends/requests', methods=['PATCH'])
# @decorators.token_required
def update_friend_request(user=None, token=None):
    """
    Accept a friend request.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        friend_request = Friend.query.filter(
            or_(and_(Friend.user_id == data['user_id'], Friend.friend_id == data['friend_id']),
                and_(Friend.user_id == data['friend_id'], Friend.friend_id == data['user_id']))).first()

        # TODO change static user id
        # Check if current user is part of the friend request
        if friend_request.user_id != 12 and friend_request.friend_id != 12:
            return {'errors': [{"user": "You can't accept this friend request."}]}

        # Update the friend request
        friend_request.accepted = True

        db.session.commit()
        return jsonify({'friend_request': friend_request.to_dict(), 'success': True,
                        'message': 'Friend request updated successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'friend_request': None, 'success': False, 'message': 'Friend request update failed!'})


@app.route('/friends', methods=['GET'])
# @decorators.token_required
def read_friends(user=None, token=None):
    """
    Read all friends.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        # TODO change static user id
        friends = User.query.join(Friend, and_(Friend.accepted == True, or_(
            Friend.friend_id == User.id, Friend.user_id == User.id))).filter(User.id != 12).all()
        return jsonify(
            {'friends': [friend.to_dict() for friend in friends], 'success': True,
             'message': 'Friends read successfully!'})
    except Exception as e:
        print(e)
        return jsonify(
            {'friends': None, 'success': False,
             'message': 'Friends read failed!'})


@app.route('/friends', methods=['DELETE'])
# @decorators.token_required
def delete_friend(user=None, token=None):
    """
    Delete a friend or decline friend request.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        friend = Friend.query.filter(
            or_(and_(Friend.user_id == data['user_id'], Friend.friend_id == data['friend_id']),
                and_(Friend.user_id == data['friend_id'], Friend.friend_id == data['user_id']))).first()

        if not friend:
            return jsonify({'friend': None, 'success': False, 'message': 'Friend request not found!',
                            "errors": [{"friend": "Friend request not found."}]})
        # TODO change static user id
        if friend.user_id != 12 and friend.friend_id != 12:
            return {'errors': [{"friend": "You aren't a part of this friendship."}]}

        db.session.delete(friend)
        db.session.commit()
        return jsonify({'friend': friend.to_dict(), 'success': True, 'message': 'Friend deleted successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'friend': None, 'success': False, 'message': 'Friend delete failed!'})


@app.route('/friends/requests', methods=['POST'])
# @decorators.token_required
def create_friend_request(user=None, token=None):
    """
    Create a friend request.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        # TODO change static user id
        friend_request = Friend(
            user_id=12,
            friend_id=data['friend_id'],
            accepted=False,
        )
        # Get friend user
        friend = User.query.get(data['friend_id'])

        db.session.add(friend_request)
        db.session.commit()
        return jsonify(
            {'friend': friend.to_dict(), 'success': True,
             'message': 'Friend request created successfully!'})
    except Exception as e:
        print(e)
        return jsonify(
            {'friend': None, 'success': False,
             'message': 'Friend request creation failed!'})


@app.route('/friends/requests/sent', methods=['GET'])
# @decorators.token_required
def read_sent_requests(user=None, token=None):
    """
    Read all sent requests.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        # TODO change static user id
        friend_requests = User.query.join(Friend, Friend.friend_id == User.id).filter(
            and_(Friend.accepted == False, User.id != 12, Friend.user_id == 12)).all()
        return jsonify(
            {'friend_requests': [friend_request.to_dict() for friend_request in friend_requests], 'success': True,
             'message': 'Sent friend requests read successfully!'})
    except Exception as e:
        print(e)
        return jsonify(
            {'friend_requests': None, 'success': False,
             'message': 'Sent friend requests read failed!'})


# #####################################profile related apis#####################################
@app.route('/profile', methods=['PATCH'])
@decorators.token_required
def edit_profile(user=None, token=None):
    """
    Edit profile.
    """
    # TODO uncomment the below checking
    if user is None or token is None:
        return jsonify({'user': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        # user = User.query.get(12)
        user.bio = data['bio']
        user.born_from = data['born_from']

        if data['cover_pic']:
            user.cover_pic = data['cover_pic']
        if data['profile_pic']:
            user.profile_pic = data['profile_pic']
        user.lives_in = data['lives_in']

        db.session.commit()
        return jsonify({'user': user.to_dict(), 'success': True, 'message': 'Profile edited successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'user': None, 'success': False, 'message': 'Profile edit failed!'})


# #####################################likes related apis#####################################
@app.route('/likes', methods=['POST'])
# @decorators.token_required
def create_like(user=None, token=None):
    """
    Create a like.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        # TODO change user id
        # Create the like
        like = Like(
            user_id=12,
            post_id=data['post_id'],
            comment_id=data['comment_id'],
        )
        db.session.add(like)
        db.session.commit()
        return jsonify({'like': like.to_dict(), 'success': True, 'message': 'Like created successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'like': None, 'success': False, 'message': 'Like creation failed!'})


@app.route('/likes', methods=['GET'])
# @decorators.token_required
def read_likes(user=None, token=None):
    """
    Read likes for current user.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    print("read_likes")
    try:
        # TODO change static user id
        likes = Like.query.filter(Like.user_id == 12).all()
        print("likes: ", likes)
        return jsonify(
            {'likes': [like.to_dict() for like in likes], 'success': True, 'message': 'Likes read successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'likes': None, 'success': False, 'message': 'Likes read failed!'})


@app.route('/likes/<int:likeId>/', methods=['DELETE'])
# @decorators.token_required
def delete_like(user=None, token=None, likeId=None):
    """
    Delete a post.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        like = Like.query.get(likeId)
        if not like:
            return jsonify({'id': None, 'success': True, 'message': 'Likes read successfully!', "errors": ["Like not "
                                                                                                           "found."],
                            "code": 400})
        # TODO change static user id
        if like.user_id != 12:
            return jsonify({'id': None, 'success': True, 'message': 'Likes read successfully!', 'errors': ["You don't "
                                                                                                           "own this "
                                                                                                           "like."],
                            "code": 403})

        db.session.delete(like)
        db.session.commit()
        return jsonify({'id': likeId, 'success': True, 'message': 'Like deleted successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'id': None, 'success': False, 'message': 'Like delete failed!'})


# #####################################auth related apis#####################################
@app.route('/authenticate', methods=['POST'])
@decorators.token_required
def authenticate(user=None, token=None):
    """
    Authenticates a user.
    """
    print("/authenticate")
    print(user)
    if user is not None:
        return jsonify({'success': True, 'isAuthenticated': True, 'user': user.to_dict(), 'token': token,
                        'message': 'Authentication'
                                   ' successful!'})
    else:
        return jsonify(
            {'success': False, 'isAuthenticated': False, 'user': None, 'token': None, 'message': 'Authentication'
                                                                                                 ' failed!'})


@app.route('/logout')
# @decorators.token_required
def logout():
    """
    Logs a user out
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    return {'success': True, 'message': 'User logged out'}


@app.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    content = request.json
    user = User.query.filter(User.email == content['email']).first()
    # print(user.to_dict())

    if user is None:
        return {'errors': [], 'success': False, 'message': 'User does not exist!'}

    if check_password_hash(user.password, content['password']):
        token = jwt.encode({'email': user.email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=45)},
                           'secret', "HS256")
        return jsonify({'token': token, 'isAuthenticated': True, 'user': user.to_dict()})
    return {'errors': [], 'success': False, 'isAuthenticated': False}


@app.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    data = request.json
    # TODO add a column uuid to User model
    user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=data['password'],
        birthday=data['birthday'],
        gender=data['gender'],
        bio='Live, Laugh, Love',
        lives_in='Santa Barbara, California',
        born_from='Santa Clara, California',
        profile_pic="https://i.imgur.com/rORsHku.png",
        cover_pic='https://www.planetware.com/wpimages/2022/04/california-santa-barbara-top-attractions-things-to-do-intro-paragraph-beach.jpg'
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'success': True, 'message': 'User created successfully!'})


# #####################################posts related apis#####################################
@app.route('/posts', methods=['GET'])
@decorators.token_required
def read_posts(user=None, token=None):
    """
    Read posts.
    """
    # TODO uncomment the below checking
    if user is None or token is None:
        print("user not found!")
        return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})

    # TODO friends posts
    # posts = Post.query.select_from(User).join(Friend,
    #                                           or_(Friend.friend_id == User.id, Friend.user_id == User.id)).filter(
    #     and_(Friend.accepted == True,
    #          or_(Friend.user_id == user.id, Friend.friend_id == user.id))).all()

    # my_posts = Post.query.filter(Post.user_id == user.id).all()
    # TODO replace user id
    print(user)
    try:
        my_posts = Post.query.filter(Post.user_id == user.id).all()
        posts = []
        for p in my_posts:
            p_dict = p.to_dict()
            comments = []
            for c in p.comments:
                comments.append(c.to_dict())
            print(comments)
            p_dict['comments'] = comments
            posts.append(p_dict)
        return jsonify({'posts': posts, 'success': True, 'message': 'Posts read successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'posts': None, 'success': False, 'message': 'Posts read failed!'})


@app.route('/posts', methods=['POST'])
@decorators.token_required
def create_post(user=None, token=None):
    """
    Create a post.
    """
    # TODO uncomment the below checking
    if user is None or token is None:
        return jsonify({'post': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        post = Post(
            user_id=user.id,
            text=data['text'],
            image_link=data['image_link'],
            created_at=data['created_at'],
            edited_at=data['edited_at'],
        )
        db.session.add(post)
        db.session.commit()
        return jsonify({'post': post.to_dict(), 'success': True, 'message': 'Post created successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'post': None, 'success': False, 'message': 'Post creation failed!'})


@app.route('/posts/<int:postId>/', methods=['PATCH'])
# @decorators.token_required
def update_post(user=None, token=None, postId=None):
    """
    Update a post.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        post = None
        post = Post.query.get(postId)
        if post is None:
            return jsonify({'post': None, 'success': False, 'message': 'Post not found!'})

        # if post.user_id != user.id:
        if post.user_id != 12:
            return jsonify({'post': None, 'success': False, 'message': 'Post does not belong to you!'})

        post.text = data['text']
        post.image_link = data['image_link']
        post.edited_at = data['edited_at']
        db.session.commit()
        return jsonify({'post': post.to_dict(), 'success': True, 'message': 'Post updated successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'post': None, 'success': False, 'message': 'Post update failed!'})


@app.route('/posts/<int:postId>/', methods=['DELETE'])
# @decorators.token_required
def delete_post(user=None, token=None, postId=None):
    """
    Delete a post.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        post = None
        post = Post.query.get(postId)
        if post is None:
            return jsonify({'post': None, 'success': False, 'message': 'Post not found!'})

        # if post.user_id != user.id:
        if post.user_id != 12:
            return jsonify({'post': None, 'success': False, 'message': 'Post does not belong to you!'})

        db.session.delete(post)
        db.session.commit()
        return jsonify({'id': postId, 'success': True, 'message': 'Post deleted successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'id': None, 'success': False, 'message': 'Post delete failed!'})


# #####################################comments related apis#####################################

@app.route('/comments', methods=['POST'])
# @decorators.token_required
def create_comment(user=None, token=None):
    """
    Create a comment.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        # Create the comment
        comment = Comment(
            # user_id=current_user.id,
            user_id=12,
            text=data['text'],
            post_id=data['post_id'],
            created_at=data['created_at'],
            edited_at=data['edited_at'],
        )
        db.session.add(comment)
        db.session.commit()
        return jsonify({'comment': comment.to_dict(), 'success': True, 'message': 'Comment created successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'comment': None, 'success': False, 'message': 'Comment creation failed!'})


@app.route('/comments/<int:postId>/')
# @decorators.token_required
def read_comments(user=None, token=None, postId=None):
    """
    Read comments of a post.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        post_comments = Comment.query.filter(Comment.post_id == postId).all()
        return jsonify({'comments': [comment.to_dict() for comment in post_comments], 'success': True,
                        'message': 'Comment read successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'comments': None, 'success': False,
                        'message': 'Comment read failed!'})


@app.route('/comments/<int:commentId>/', methods=['PATCH'])
# @decorators.token_required
def update_comment(user=None, token=None, commentId=None):
    """
    Update a comment.
    """
    comment = None
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    data = request.json
    try:
        # Update the comment
        comment = Comment.query.get(commentId)
        if comment is None:
            return jsonify({'post': None, 'success': False, 'message': 'Comment not found!'})

        if comment.user_id != 12:
            return jsonify({'comment': None, 'success': False, 'message': 'Comment does not belong to you!'})

        comment.text = data['text'],
        comment.edited_at = data['edited_at'],

        db.session.commit()
        return jsonify({'comment': comment.to_dict(), 'success': True, 'message': 'Comment updated successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'comment': None, 'success': False, 'message': 'Comment update failed!'})


@app.route('/comments/<int:commentId>/', methods=['DELETE'])
# @decorators.token_required
def delete_comment(user=None, token=None, commentId=None):
    """
    Delete a comment.
    """
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    post_id = None
    try:
        comment = Comment.query.get(commentId)

        if not comment:
            return jsonify({'comment': None, 'success': False, 'message': 'Comment not found!'})

        if comment.user_id != 12:
            return jsonify({'comment': None, 'success': False, 'message': 'Comment does not belong to you!'})

        post_id = comment.post_id

        db.session.delete(comment)
        db.session.commit()

        return jsonify(
            {'id': commentId, 'post_id': post_id, 'success': True, 'message': 'Comment deleted successfully!'})
    except Exception as e:
        print(e)
        return jsonify({'id': None, 'post_id': None, 'success': False, 'message': 'Comment delete failed!'})


# #####################################other apis#####################################
@app.route('/users/<int:userId>/')
# @decorators.token_required
def user(user=None, token=None, userId=None):
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Authentication failed!'})
    try:
        user = User.query.get(userId)
        return jsonify({'user': user.to_dict(), 'success': True, 'message': 'Read user successful!'})
    except Exception as e:
        print(e)
        return jsonify({'user': None, 'success': False, 'message': 'Error when reading user!'})


@app.route('/users', methods=["GET"])
@decorators.token_required
def users(user=None, token=None):
    try:
        print("user.id: ", user.id)
        users = User.query.filter(User.id != user.id).all()
        print("len(users): ", len(users))
        friends = User.query.join(Friend, or_(Friend.friend_id == User.id,
                                              Friend.user_id == User.id)).filter(
            and_(User.id != user.id, or_(Friend.user_id == user.id, Friend.friend_id == user.id))).all()
        print("len(friends): ", len(friends))

        for f in friends:
            print("f.id: ", f.id)
        users = [user for user in users if user not in friends]

        # filter out friends
        filtered_users = [u for u in users if u not in friends]

        print("len(filtered_users): ", len(filtered_users))
        for f in filtered_users:
            print("filtered_user.id: ", f.id)

        # return jsonify({'users': None, 'success': False, 'message': 'Read users failed!'})
        return jsonify({'users': [u.to_dict() for u in filtered_users], 'success': True, 'message': 'Read users '
                                                                                                    'successful!'})
    except Exception as e:
        print(e)
        return jsonify({'users': None, 'success': False, 'message': 'Read users failed!'})


@app.route('/images', methods=["POST"])
# @decorators.token_required
def upload(user=None, token=None):
    # TODO uncomment the below checking
    # if user is None or token is None:
    #     return jsonify({'posts': None, 'success': False, 'message': 'Image upload failed!'})

    if "image" not in request.files:
        return jsonify({"url": "http://localhost:5000/", 'success': False, 'message': "Image upload failed!"})

    image = request.files['image']

    print("image.filename: ", image.filename)
    if not allowed_file(image.filename):
        return jsonify({"url": "http://localhost:5000/", 'success': False, 'message': "Image must be .pdf .jpg .jpeg "
                                                                                      ".png .gif"})
    # image.filename = get_unique_filename(image.filename)
    unique_filename = get_unique_filename(image.filename)
    image.filename = os.path.join(app.config['POST_IMAGE_UPLOAD_FOLDER'], unique_filename)
    image.save(image.filename)

    print("File uploaded successfully")
    return jsonify({"url": "http://localhost:5000/" + 'static/post-images' + "/" + unique_filename, 'success': True,
                    'message': "Image uploaded successfully!"})


def allowed_file(filename):
    return "." in filename and \
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"
