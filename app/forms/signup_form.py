from flask_wtf import FlaskForm, Form
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
from datetime import datetime, timedelta


# if (email !== reEmail) emailPassCheck.push("Email and Re-email must match.")
# if (password != = confirmPassword)
# emailPassCheck.push("Password and Confirm Password must match.")


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def age_check(form, field):
    # Checking if username is already in use
    birthday = datetime.strptime(field.data, "%Y-%m-%dT%H:%M:%S.%fZ")
    now = datetime.now()
    add_13_years = timedelta(days=365*13)
    if now - add_13_years < birthday:
        raise ValidationError('Must be over 13.')


def long_name_check(form, field):
    # Check if name length is too long
    if len(field.data) > 31:
        raise ValidationError('Name must be less than 31 characters.')


def confirm_password_check(form, field):
    # Check if confirm password == password
    if form.data['password'] != field.data:
        raise ValidationError('Passwords must match.')


def reEmail_check(form, field):
    # Check if reEmail == email
    if form.data['email'] != field.data:
        raise ValidationError('Emails must match.')


class SignUpForm(FlaskForm):
    class Meta:
        csrf = False
    firstName = StringField(
        'first_name', validators=[DataRequired(), long_name_check])
    lastName = StringField(
        'last_name', validators=[DataRequired(), long_name_check])
    email = StringField('email', validators=[
        DataRequired(), Email(), user_exists])
    reEmail = StringField('reEmail', validators=[
                          DataRequired(), reEmail_check])
    password = StringField('password', validators=[DataRequired()])
    confirmPassword = StringField(
        'confirmPassword', validators=[DataRequired(), confirm_password_check])
    birthday = StringField('birthday', validators=[DataRequired(), age_check])

