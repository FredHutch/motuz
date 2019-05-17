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
        title='Motuz',
        description='Motuz a web based infrastructure for large scale data movements '
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

    from .views.user_views import api as user_ns
    api.add_namespace(user_ns)

    from .views.auth_views import api as auth_ns
    api.add_namespace(auth_ns)

    app.register_blueprint(bp)

    return app
