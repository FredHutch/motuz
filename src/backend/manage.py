import os
import unittest

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from api import create_app, db
from api.models import * # To ensure that all models are tracked

app = create_app(os.getenv('PYTHON_ENVIRONMENT') or 'dev')

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

@manager.command
def run():
    app.run(host=os.getenv('MOTUZ_HOST', 'localhost'))

@manager.command
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('../../test/backend', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    manager.run()
