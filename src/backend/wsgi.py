import os

from api import create_app, db
from api.models import * # To ensure that all models are tracked


application = create_app(os.getenv('PYTHON_ENVIRONMENT') or 'dev')

if __name__ == '__main__':
    application.run(host='0.0.0.0')
