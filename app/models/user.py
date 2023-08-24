from app.models.likes import Like
from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .post import Post


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    bio = db.Column(db.String(101), nullable=True)
    lives_in = db.Column(db.String(255), nullable=True)
    born_from = db.Column(db.String(255), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True)
    cover_pic = db.Column(db.String(255), nullable=True)

    posts = db.relationship("Post", back_populates="users",
                            cascade='all, delete-orphan', passive_deletes=True)
    comments = db.relationship("Comment", back_populates="users",
                               cascade='all, delete-orphan', passive_deletes=True)
    likes = db.relationship("Like", back_populates="users",
                            cascade='all, delete-orphan', passive_deletes=True)
    friend1 = db.relationship("Friend", foreign_keys="[Friend.user_id]", back_populates="user1",
                              cascade='all, delete-orphan', passive_deletes=True)
    friend2 = db.relationship("Friend", foreign_keys="[Friend.friend_id]", back_populates="user2",
                              cascade='all, delete-orphan', passive_deletes=True)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        likes = Like.query.filter(Like.user_id == self.id).all()

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
            'likes': {like.id: like.to_dict() for like in likes}
        }
