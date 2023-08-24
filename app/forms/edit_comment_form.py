from flask_wtf import FlaskForm
from wtforms import StringField, TextField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from datetime import datetime
from ..models.post import Post
from ..models.comment import Comment


def check_post(form, field):
    post_id = field.data

    post = Post.query.get(post_id)

    if post.id:
        return True
    return False


class EditCommentForm(FlaskForm):
    post_id = IntegerField('post_id', validators=[DataRequired(), check_post])
    text = TextField(
        'text', validators=[DataRequired()])
    edited_at = StringField('edited_at', default=str(datetime.now()))
