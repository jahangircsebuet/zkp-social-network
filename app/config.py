import os


class Config:
    SECRET_KEY = os.urandom(32)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here
    SQLALCHEMY_DATABASE_URI = "mysql://bookface:123456@localhost/bookface"
    SQLALCHEMY_ECHO = True
    WTF_CSRF_ENABLED = False
    WTF_CSRF_CHECK_DEFAULT = False
