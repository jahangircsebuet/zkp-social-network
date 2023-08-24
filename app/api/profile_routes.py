from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import and_, or_
from app.models import db, User
from app.forms import EditProfileForm

profile_routes = Blueprint('profile', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@profile_routes.route('/', methods=['PATCH'])
@login_required
def edit_profile():
    """
    Edit profile.
    """

    form = EditProfileForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user = User.query.get(current_user.id)

        user.bio = form.data['bio']
        user.born_from = form.data['born_from']
        if form.data['cover_pic']:
            user.cover_pic = form.data['cover_pic']
        if form.data['profile_pic']:
            user.profile_pic = form.data['profile_pic']
        user.lives_in = form.data['lives_in']

        db.session.commit()
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
