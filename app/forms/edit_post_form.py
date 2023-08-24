from flask_wtf import FlaskForm
from wtforms import StringField, TextField
from wtforms.validators import DataRequired, Email, ValidationError
from datetime import datetime


class EditPostForm(FlaskForm):
    text = TextField(
        'text', validators=[DataRequired()])
    image_link = StringField('image_link')
    edited_at = StringField('edited_at', default=str(datetime.now()))
