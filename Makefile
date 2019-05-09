PACKAGE_NAME=motuz
VENV_DIR?=venv
VENV_ACTIVATE=$(VENV_DIR)/bin/activate
WITH_VENV=. $(VENV_ACTIVATE);
# only experimental support for 2.7
# to install use VENV_PYTHON=python2.7 make teardown clean venv
VENV_PYTHON?=python3
# override this if you want to point to internal PyPI
# this is the default for pip
PIP_INDEX_URL?=https://pypi.python.org/simple

.PHONY: default
default: develop


.PHONY: teardown
teardown:
	rm -rf $(VENV_DIR)

.PHONY: clean
clean:
	python setup.py clean
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg*/
	rm -rf __pycache__/
	rm -f MANIFEST
	find $(PACKAGE_NAME) -type f -name '*.pyc' -delete

$(VENV_ACTIVATE): requirements*.txt
	test -f $@ || virtualenv --python=$(VENV_PYTHON) $(VENV_DIR)
	$(WITH_VENV) pip install -r requirements-test.txt --index-url=${PIP_INDEX_URL}
	$(WITH_VENV) pip install -e . --index-url=${PIP_INDEX_URL}
	touch $@

.PHONY: venv
venv: $(VENV_ACTIVATE)

.PHONY: develop
# use this if you want changes in the repo to be immediately reflected in scripts
develop: venv
	$(WITH_VENV) python setup.py develop
