from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

SQLALCHEMY_DATABASE_URI = "mysql://bookface:123456@localhost/bookface"
SECRET_KEY = os.urandom(32)

db = SQLAlchemy()

