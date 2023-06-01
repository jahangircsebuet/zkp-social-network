from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError


def bio_length(form, field):
    # Checking if bio is too long
    bio = field.data
    if len(bio) > 101:
        raise ValidationError('Bio must be under 101 characters.')


class EditProfileForm(FlaskForm):
    bio = StringField(
        'bio', validators=[bio_length])
    born_from = StringField(
        'born_from')
    cover_pic = StringField('cover_pic')
    profile_pic = StringField('profile_pic')
    lives_in = StringField('lives_in')
