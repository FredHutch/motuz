import os

basedir = os.path.abspath(os.path.dirname(__file__))


# Preventing lazy loading of mandatory variables
try:
    MOTUZ_FLASK_SECRET_KEY = os.environ['MOTUZ_FLASK_SECRET_KEY']
    MOTUZ_DATABASE_PROTOCOL = os.environ['MOTUZ_DATABASE_PROTOCOL']
    MOTUZ_DATABASE_USER = os.environ['MOTUZ_DATABASE_USER']
    MOTUZ_DATABASE_PASSWORD = os.environ['MOTUZ_DATABASE_PASSWORD']
    MOTUZ_DATABASE_NAME = os.environ['MOTUZ_DATABASE_NAME']
    MOTUZ_DATABASE_HOST = os.environ['MOTUZ_DATABASE_HOST']
    MOTUZ_DATABASE_REQUIRE_SSL = os.environ.get('MOTUZ_DATABASE_REQUIRE_SSL', 'false')
except KeyError as e:
    raise KeyError("Environment variable {} not set".format(e.args[0]))



class Config:
    SECRET_KEY = MOTUZ_FLASK_SECRET_KEY
    JWT_SECRET_KEY = MOTUZ_FLASK_SECRET_KEY
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['refresh']
    CELERY_BROKER_URL = 'amqp://'
    CELERY_RESULT_BACKEND = 'amqp://'

    DATABASE_PARAMS = ''
    if MOTUZ_DATABASE_REQUIRE_SSL.lower() in ('true', 't'):
        DATABASE_PARAMS = '?sslmode=require'
    SQLALCHEMY_DATABASE_URI = '{PROTOCOL}://{USER}:{PASSWORD}@{HOST}/{DATABASE}{PARAMS}'.format(
        PROTOCOL=MOTUZ_DATABASE_PROTOCOL,
        USER=MOTUZ_DATABASE_USER,
        PASSWORD=MOTUZ_DATABASE_PASSWORD,
        HOST=MOTUZ_DATABASE_HOST,
        DATABASE=MOTUZ_DATABASE_NAME,
        PARAMS=DATABASE_PARAMS,
    )

    DEBUG = False
    # https://flask-sqlalchemy.palletsprojects.com/en/2.x/signals/
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class DevelopmentConfig(Config):
    DEBUG = True



class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database_test.sqlite3')
    PRESERVE_CONTEXT_ON_EXCEPTION = False



class ProductionConfig(Config):
    DEBUG = False



config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)
