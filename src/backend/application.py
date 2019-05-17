from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_restplus import Api

from .config import config_by_name


db = SQLAlchemy()


def create_app(config_name='dev'):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)

    bp = Blueprint('api', __name__, url_prefix='/api')

    api = Api(bp,
        title='Flask Restplus Api Boiler-plate with JWT',
        description='A boilerplate for Flask-RESTplus web service',
        version='1.0',
        security='Bearer Auth',
        authorizations={
            'Bearer Auth': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization'
            },
        },
        license='MIT',
        license_url='https://opensource.org/licenses/MIT',
    )

    from .views.user_views import api as user_ns
    api.add_namespace(user_ns)

    from .views.auth_views import api as auth_ns
    api.add_namespace(auth_ns)

    app.register_blueprint(bp)

    return app
