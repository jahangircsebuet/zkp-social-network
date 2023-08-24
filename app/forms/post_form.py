from flask_wtf import FlaskForm
from wtforms import StringField, TextField, FileField
from wtforms.validators import DataRequired, Email, ValidationError
from datetime import datetime


class PostForm(FlaskForm):
    text = TextField(
        'text', validators=[DataRequired()])
    image_link = FileField('image_link')
    created_at = StringField('created_at', default=str(datetime.now()))
    edited_at = StringField('edited_at', default=str(datetime.now()))
