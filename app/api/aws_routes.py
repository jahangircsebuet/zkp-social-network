import uuid
import os
import botocore
import boto3
from flask import Blueprint, request
# from .aws_helper import (allowed_file, upload_file_to_s3, get_unique_filename)
from flask_login import login_required


aws_routes = Blueprint('images', __name__)


# BUCKET_NAME = os.environ.get("S3_BUCKET")
# S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

# s3 = boto3.client(
#     "s3",
#     aws_access_key_id=os.environ.get("S3_KEY"),
#     aws_secret_access_key=os.environ.get("S3_SECRET")
# )


def allowed_file(filename):
    return "." in filename and \
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


# def upload_file_to_s3(file, acl="public-read"):
#     try:
#         s3.upload_fileobj(
#             file,
#             BUCKET_NAME,
#             file.filename,
#             ExtraArgs={
#                 "ACL": acl,
#                 "ContentType": file.content_type
#             }
#         )
#     except Exception as e:
#         return {"errors": str(e)}
#
#     return {"url": f"{S3_LOCATION}{file.filename}"}


@aws_routes.route('/', methods=["POST"])
@login_required
def upload():
    print("File upload")

    if "image" not in request.files:
        return {"url": ""}

    image = request.files['image']

    if not allowed_file(image.filename):
        return {"errors": "Image must be .pdf .jpg .jpeg .png .gif"}

    image.filename = get_unique_filename(image.filename)
    image.save(image.filename)
    print("File uploaded successfully")
    # upload = upload_file_to_s3(image)

    # if "url" not in upload:
    #     return {"errors": upload}, 400

    upload = {
        "url": "http://localhost:5000/"
    }
    return upload
