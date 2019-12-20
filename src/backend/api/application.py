import logging

from celery import Celery
from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_restplus import Api
from flask_jwt_extended import JWTManager

from .config import config_by_name, Config

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')

db = SQLAlchemy()

app = Flask(__name__, instance_relative_config=True)
app.config.from_object(config_by_name['dev'])

db.init_app(app)
jwt = JWTManager(app)

celery = Celery(
    __name__,
    backend=Config.CELERY_RESULT_BACKEND,
    broker=Config.CELERY_BROKER_URL,
)
celery.conf.update(app.config)
class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        with app.app_context():
            return self.run(*args, **kwargs)

celery.Task = ContextTask


def create_app(config_name='dev'):
    global app
    app.config.from_object(config_by_name[config_name])

    bp = Blueprint('api', __name__, url_prefix='/api')

    api = Api(bp,
        title='Motuz',
        description='A web based infrastructure for large scale data movements '
            'between on-premise and cloud',
        version='0.0.2',
        security='Bearer Auth',
        authorizations={
            'Bearer Auth': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization'
            },
        },
        ordered=True,
        terms_url='https://github.com/FredHutch/motuz',
        license='MIT',
        license_url='https://github.com/FredHutch/motuz/blob/master/LICENSE',
    )

    from .views.auth_views import api as auth_ns
    api.add_namespace(auth_ns)

    from .views.copy_job_views import api as copy_job_ns
    api.add_namespace(copy_job_ns)

    from .views.cloud_connection_views import api as connection_ns
    api.add_namespace(connection_ns)

    from .views.system_views import api as system_ns
    api.add_namespace(system_ns)

    app.register_blueprint(bp)

    return app
