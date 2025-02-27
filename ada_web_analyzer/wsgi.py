"""
WSGI config for ada_web_analyzer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

# Add the project directory to the sys.path
sys.path.append('/home/yourusername/ada_web_analyzer')

# Set the settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ada_web_analyzer.settings")

application = get_wsgi_application()
