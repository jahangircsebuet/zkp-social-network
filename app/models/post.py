from app.models.likes import Like
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .comment import Comment


class Post(db.Model):
    __tablename__ = "posts"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    image_link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.String(255), nullable=False)
    edited_at = db.Column(db.String(255), nullable=False)

    users = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comment', back_populates='posts',
                               cascade='all, delete-orphan', passive_deletes=True)
    likes = db.relationship('Like', back_populates='posts',
                            cascade='all, delete-orphan', passive_deletes=True)

    def to_dict(self):
        likes = Like.query.filter(Like.post_id == self.id).count()

        return {
            'id': self.id,
            'user_id': self.user_id,
            'text': self.text,
            'image_link': self.image_link,
            'created_at': self.created_at,
            'edited_at': self.edited_at,
            'comments': {},
            'likes': likes

        }
