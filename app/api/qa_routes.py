from flask import Blueprint, jsonify, session, request

qa_routes = Blueprint('qa', __name__)


@qa_routes.route('/generate')
def generate():
    """
    Authenticates a user.
    """

    return {'errors': ['Unauthorized']}
