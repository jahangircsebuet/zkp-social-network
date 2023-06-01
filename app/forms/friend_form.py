from flask_wtf import FlaskForm
from wtforms import IntegerField, BooleanField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    user_id = field.data
    user = User.query.get(user_id)
    if not user:
        raise ValidationError('User not found.')


class FriendForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired(), user_exists])
    friend_id = IntegerField('friend_id', validators=[
        DataRequired(), user_exists])
