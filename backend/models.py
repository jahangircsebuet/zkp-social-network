from datetime import datetime
from settings import db
from hashlib import sha256


# def init_db(db):
#     def save(model):
#         db.session.add(model)
#         db.session.commit()
#
#     db.Model.save = save

# init_db(db)



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    birthday = db.Column(db.String(10), nullable=False)
    bio = db.Column(db.String(255), nullable=True)
    lives_in = db.Column(db.String(255), nullable=True)
    born_from = db.Column(db.String(255), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True)
    cover_pic = db.Column(db.String(255), nullable=True)
    auth_token = db.Column(db.String(255), nullable=True)
    posts = db.relationship("Post", back_populates="users",
                            cascade='all, delete-orphan', passive_deletes=True)

    def __init__(self, first_name="", last_name="", email="", password="", birthday="", bio="", lives_in="",
                 born_from="", profile_pic="", cover_pic="", auth_token=""):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = sha256(password.encode()).hexdigest()
        self.birthday = birthday
        self.bio = bio
        self.lives_in = lives_in
        self.born_from = born_from
        self.profile_pic = profile_pic
        self.cover_pic = cover_pic
        self.auth_token = auth_token

    def __repr__(self):
        return '<User %r Pass %r>' % (self.email, self.password)

    def update_password(self, password: str):
        self.password = sha256(password.encode()).hexdigest()

    def obtain_auth_token(self):
        self.auth_token = sha256((self.email + str(datetime.now().timestamp())).encode()).hexdigest()
        self.save()
        return self.auth_token

    def clear_auth_token(self):
        self.auth_token = ""
        self.save()

    def save(self):
        db.session.commit()

    @staticmethod
    def create_fields():
        return {'email': 'text', 'password': 'password', 'confirm password': 'password'}

    @staticmethod
    def login_fields():
        return {'email': 'text', 'password': 'password'}

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'birthday': self.birthday,
            'bio': self.bio,
            'lives_in': self.lives_in,
            'born_from': self.born_from,
            'profile_pic': self.profile_pic,
            'cover_pic': self.cover_pic,
            'auth_token': self.auth_token}


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    image_link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.String(255), nullable=False)
    edited_at = db.Column(db.String(255), nullable=False)

    users = db.relationship('User', back_populates='posts')
    # comments = db.relationship('Comment', back_populates='posts',
    #                            cascade='all, delete-orphan', passive_deletes=True)
    # likes = db.relationship('Like', back_populates='posts',
    #                         cascade='all, delete-orphan', passive_deletes=True)

    def to_dict(self):
        # likes = Like.query.filter(Like.post_id == self.id).count()

        return {
            'id': self.id,
            'user_id': self.user_id,
            'text': self.text,
            'image_link': self.image_link,
            'created_at': self.created_at,
            'edited_at': self.edited_at,
            # 'comments': {},
            # 'likes': likes

        }