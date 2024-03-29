from flask_sqlalchemy import SQLAlchemy
from flask_mysqldb import MySQL

# add import and set variable to access flask environment
import os
# environment = os.getenv("FLASK_ENV")
environment = None
# SCHEMA = os.environ.get('SCHEMA')
SCHEMA = None

db = SQLAlchemy()

# db = MySQL()

# add function to add a prefix to table names in production environment only


def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr
