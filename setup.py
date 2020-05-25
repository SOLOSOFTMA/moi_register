# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in moi_register/__init__.py
from moi_register import __version__ as version

setup(
	name='moi_register',
	version=version,
	description='Inward and Outward Register',
	author='Dennis Tatila',
	author_email='dennis.tatila@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
