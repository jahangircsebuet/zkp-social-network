import json
from flask import request, jsonify, redirect, session
from hashlib import sha256
from flask_cors import CORS

from models import User, Post
from decorators import login_required, token_required

# local files
# from models import User
from flask import Flask
from settings import db, SQLALCHEMY_DATABASE_URI, SECRET_KEY
from flask_migrate import Migrate
import uuid


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.secret_key = SECRET_KEY
db.init_app(app)
Migrate(app, db)
CORS(app)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}: {error}')
    return errorMessages


def allowed_file(filename):
    return "." in filename and \
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


@app.route("/init", methods=["GET"])
def init():
    # before calling /init api, run below commands in terminal
    # flask db init
    # flask db migrate
    # flask db upgrade
    admin = User.query.filter_by(email="admin@gmail.com").first()
    if admin is None:
        admin = User(email="admin@gmail.com", password="admin")
        db.session.add(admin)
        db.session.commit()
    return jsonify({"message": "Admin created!"})


@app.route("/logout/", methods=["GET"])
@login_required
def logout():
    session.pop("user", None)
    return redirect("/")


@app.route("/api/authenticate", methods=["POST"])
def api_authenticate():
    print("/api/authenticate")
    data = json.loads(request.data)

    def data_validator(data):
        auth_token = data.get("token") or ""
        return locals()
    valid_data = data_validator(data)
    print(valid_data)

    user = User.query.filter_by(auth_token=valid_data["auth_token"]).first()

    if user:
        print(user)
        return jsonify({"user": user.serialize(), "isAuthenticated": True, "token": valid_data["auth_token"]})

    return jsonify({"user": None, "isAuthenticated": False, "token": None})


@app.route("/api/login", methods=["POST"])
def api_login():
    print("/api/login")
    data = json.loads(request.data)
    print("request data")
    print(data)

    def data_validator(data):
        email = data.get("email") or ""
        password = data.get("password") or ""
        return locals()
    valid_data = data_validator(data)
    print("valid_data", valid_data)

    user = User.query.filter_by(email=valid_data["email"]).first()

    print("user")
    print(user)

    if user:
        print(user)
        if user.password == sha256(str(valid_data["password"]).encode()).hexdigest():

            return jsonify({"user": user.serialize(), "isAuthenticated": True, "token": user.obtain_auth_token()})

    return jsonify({"user": None, "isAuthenticated": False, "token": None})


@app.route("/api/logout", methods=["GET"])
@token_required
def api_logout():
    user = User.query.filter_by(auth_token=request.headers["auth_token"]).first()
    user.clear_auth_token()
    return jsonify({"message": "Logged out"})


@app.route("/api/signup", methods=["POST"])
def sign_up():
    """
    Creates a new user and logs them in
    """
    # form['csrf_token'].data = request.cookies['csrf_token']

    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    print("/api/signup")
    data = json.loads(request.data)
    def data_validator(data):
        # check if data is blank/empty
        # TODO check other validation rules or use this "validation_errors_to_error_messages" using flask_login
        firstName = data.get("firstName") or ""
        lastName = data.get("lastName") or ""
        email = data.get("email") or ""
        reEmail = data.get("reEmail") or ""
        password = data.get("password") or ""
        confirmPassword = data.get("confirmPassword") or ""
        birthday = data.get("birthday") or ""
        return locals()

    valid_data = data_validator(data)
    print("valid_data", valid_data)
    # TODO check if user already exists

    user = User(
        first_name=valid_data['firstName'],
        last_name=valid_data['lastName'],
        email=valid_data['email'],
        password=valid_data['password'],
        birthday=valid_data['birthday'],
        bio="",
        lives_in="",
        born_from="",
        profile_pic="",
        cover_pic="",
        auth_token=""
    )
    db.session.add(user)
    db.session.commit()
    # TODO add is_active column, send activation email

    user = User.query.filter_by(email=valid_data["email"]).first()
    print(user)
    print(user.id)

    return jsonify({"user": user.serialize(), "isAuthenticated": True, "token": user.obtain_auth_token()})


@app.route("/api/posts", methods=["POST"])
def create_post():
    """
    Creates a new post
    """
    # form['csrf_token'].data = request.cookies['csrf_token']

    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    print("/api/posts")
    data = json.loads(request.data)

    def data_validator(data):
        # check if data is blank/empty
        # TODO check other validation rules or use this "validation_errors_to_error_messages" using flask_login
        text = data.get("text") or ""
        image_link = data.get("image_link") or ""
        created_at = data.get("created_at") or ""
        edited_at = data.get("edited_at") or ""
        return locals()

    valid_data = data_validator(data)
    print("valid_data", valid_data)
    # TODO check if user already exists

    # TODO read token from header
    token = request.headers['token']
    print("token: ", token)
    # TODO query User table to get user of the token (filter User by auth_token)
    user = User.query.filter_by(auth_token=token).first()
    print(user)
    print(user.id)

    post = Post(
        user_id=user.id,
        text=valid_data['text'],
        image_link=valid_data['image_link'],
        created_at=valid_data['created_at'],
        edited_at=valid_data['edited_at'],
    )
    db.session.add(post)
    db.session.commit()
    # TODO add is_active column, send activation email

    return jsonify({"posts": post.to_dict()})


@app.route("/api/posts", methods=["GET"])
def read_post():
    """
    Get posts
    """
    # form['csrf_token'].data = request.cookies['csrf_token']

    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    print("GET /api/posts")
    # data = json.loads(request.data)

    # TODO check if user already exists

    # TODO read token from header
    token = request.headers['token']
    print("token: ", token)

    user = User.query.filter_by(auth_token=token).first()
    print(user)
    print(user.id)

    # TODO friends posts
    # posts = Post.query.select_from(User).join(Friend,
    #                                           or_(Friend.friend_id == User.id, Friend.user_id == User.id)).filter(
    #     and_(Friend.accepted == True,
    #          or_(Friend.user_id == current_user.id, Friend.friend_id == current_user.id))).all()

    # own posts
    my_posts = Post.query.filter(Post.user_id == user.id).all()

    print("my_posts.len: ", len(my_posts))

    # return {'posts': [post.to_dict() for post in my_posts]}
    return {'posts': [post.to_dict() for post in my_posts]}


@app.route('/api/images', methods=["POST"])
def post_image_upload():

    token = request.headers['token']
    print("token: ", token)

    user = User.query.filter_by(auth_token=token).first()
    print(user)
    print(user.id)

    if "image" not in request.files:
        return {"url": ""}

    if user:
        if "image" not in request.files:
            return {"url": ""}

        image = request.files['image']

        # print(image)

        if not allowed_file(image.filename):
            return {"errors": "Image must be .pdf .jpg .jpeg .png .gif"}

        image.filename = get_unique_filename(image.filename)
        image.save("static/uploads/" + image.filename)
        print("File uploaded successfully")
        # upload = upload_file_to_s3(image)

        # if "url" not in upload:
        #     return {"errors": upload}, 400

        print("image.filename: ", image.filename)
        upload = {
            "url": "http://localhost:5000/static/uploads/" + image.filename
        }
        return upload
    else:
        return {"errors": "User not found"}


@app.route('/api/posts/<int:id>/', methods=['DELETE'])
def delete_post(id):
    """
    Delete a post.
    """
    token = request.headers['token']
    print("token: ", token)

    user = User.query.filter_by(auth_token=token).first()
    print(user)
    print(user.id)

    post = Post.query.get(id)

    if not post:
        return {"errors": ["Post not found."]}, 400
    if post.user_id != user.id:
        return {'errors': ["You don't own this post."]}, 403

    db.session.delete(post)
    db.session.commit()
    return {"id": id}


@app.route('/api/profile', methods=['PATCH'])
# @login_required
def edit_profile():
    """
    Edit profile.
    """

    token = request.headers['token']
    print("token: ", token)

    user = User.query.filter_by(auth_token=token).first()
    print(user)
    print(user.id)

    data = json.loads(request.data)

    def data_validator(data):
        # check if data is blank/empty
        # TODO check other validation rules or use this "validation_errors_to_error_messages" using flask_login
        bio = data.get("bio") or ""
        born_from = data.get("born_from") or ""
        cover_pic = data.get("cover_pic") or ""
        profile_pic = data.get("profile_pic") or ""
        lives_in = data.get("lives_in") or ""
        return locals()

    valid_data = data_validator(data)
    print("valid_data", valid_data)

    # form['csrf_token'].data = request.cookies['csrf_token']

    user.bio = valid_data['bio']
    user.born_from = valid_data['born_from']
    user.cover_pic = valid_data['cover_pic']
    user.profile_pic = valid_data['profile_pic']
    user.lives_in = valid_data['lives_in']

    db.session.commit()
    return jsonify({"user": user.serialize()})
    # return {'errors': validation_errors_to_error_messages(form.errors)}, 401


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
