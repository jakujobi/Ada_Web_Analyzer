# Ada Web Analyzer - Deployment Guide

This guide provides detailed instructions for deploying the Ada Web Analyzer application to production environments, with a focus on Render.com deployment.

## Table of Contents

1. [Deployment Prerequisites](#deployment-prerequisites)
2. [Local Preparation](#local-preparation)
3. [Render.com Deployment](#rendercom-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Static Files](#static-files)
6. [Database Configuration](#database-configuration)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

## Deployment Prerequisites

Before deploying, ensure you have:

- A GitHub repository with your Ada Web Analyzer code
- A Render.com account
- Your application code ready for production
- All dependencies listed in requirements.txt
- Proper configuration in settings.py for production

## Local Preparation

### 1. Update Production Settings

Ensure your `settings.py` has proper production settings:

```python
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-app-name.onrender.com', 'your-custom-domain.com']

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'analysis/static'),
]

# WhiteNoise configuration
MIDDLEWARE = [
    # ...
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ...
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### 2. Create Required Files

Ensure you have these files in your repository root:

#### Procfile

```
web: gunicorn ada_web_analyzer.wsgi:application --log-file -
```

#### runtime.txt

```
python-3.11.0
```

### 3. Test Locally

Before deploying, test your production settings locally:

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn ada_web_analyzer.wsgi:application
```

### 4. Commit Changes

Commit all changes to your repository:

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

## Render.com Deployment

### 1. Create a New Web Service

1. Log in to your Render.com account
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository with your Ada Web Analyzer code

### 2. Configure the Web Service

Fill in the following details:

- **Name**: ada-web-analyzer (or your preferred name)
- **Environment**: Python
- **Region**: Choose the region closest to your users
- **Branch**: main (or your production branch)
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Start Command**: `gunicorn ada_web_analyzer.wsgi:application`

### 3. Add Environment Variables

Click on "Advanced" and add the following environment variables:

- `PYTHON_VERSION`: 3.11.0
- `SECRET_KEY`: [Generate a secure random string]
- `DEBUG`: False
- `ALLOWED_HOSTS`: your-app-name.onrender.com,your-custom-domain.com

### 4. Deploy the Service

Click "Create Web Service" to start the deployment process. Render will:

1. Clone your repository
2. Install dependencies
3. Collect static files
4. Start the application with Gunicorn

## Environment Configuration

### Security Settings

For production, ensure you have:

1. **Secret Key**: Set a strong, random SECRET_KEY as an environment variable
2. **Debug Mode**: Set DEBUG=False in production
3. **HTTPS**: Render.com provides HTTPS by default
4. **CSRF Protection**: Ensure CSRF_TRUSTED_ORIGINS includes your domain

Example environment variables:

```
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com,your-custom-domain.com
CSRF_TRUSTED_ORIGINS=https://your-app-name.onrender.com,https://your-custom-domain.com
```

## Static Files

### WhiteNoise Configuration

WhiteNoise is used to serve static files efficiently in production:

1. Ensure WhiteNoise middleware is in your MIDDLEWARE setting
2. Configure STATICFILES_STORAGE to use WhiteNoise
3. Set STATIC_ROOT to collect static files

```python
# WhiteNoise configuration
MIDDLEWARE = [
    # ...
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ...
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

### Collecting Static Files

Static files are collected during the build process with:

```bash
python manage.py collectstatic --noinput
```

This command is included in the build command on Render.com.

## Database Configuration

### Using PostgreSQL on Render

For persistent data storage:

1. Create a PostgreSQL database on Render
2. Connect it to your web service
3. Update your DATABASE settings to use the environment variables

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DATABASE'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}
```

## Monitoring and Logging

### Logging Configuration

Configure comprehensive logging in settings.py:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'analysis': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Viewing Logs on Render

To view logs:

1. Go to your web service on Render.com
2. Click on "Logs" in the left sidebar
3. View real-time logs or download historical logs

## Troubleshooting

### Common Deployment Issues

#### Static Files Not Loading

1. Check WhiteNoise configuration
2. Verify STATIC_ROOT and STATICFILES_DIRS settings
3. Ensure collectstatic ran successfully during deployment

#### CSRF Errors

1. Add your domain to CSRF_TRUSTED_ORIGINS
2. Check that CSRF tokens are included in forms
3. Verify that cookies are being set correctly

#### 500 Server Errors

1. Check Render logs for error details
2. Verify environment variables are set correctly
3. Test with DEBUG=True temporarily to see detailed error pages

#### Database Connection Issues

1. Verify database credentials
2. Check if the database service is running
3. Ensure the web service has access to the database

## Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**: Regularly update packages in requirements.txt
2. **Monitor Logs**: Check logs for errors and warnings
3. **Backup Database**: If using a database, set up regular backups
4. **Performance Monitoring**: Monitor response times and resource usage

### Updating the Application

To update your deployed application:

1. Make and test changes locally
2. Commit changes to your repository
3. Push to the main branch
4. Render will automatically deploy the updates

### Scaling

If you need to scale your application:

1. Go to your web service on Render.com
2. Under "Settings", adjust the plan and instance type
3. For high traffic, consider using a higher tier plan

## Conclusion

Following this deployment guide will help you successfully deploy the Ada Web Analyzer to Render.com. The application will be accessible via a secure HTTPS connection, with static files served efficiently by WhiteNoise.

For any deployment issues, check the Render.com documentation or reach out to the project maintainers for assistance.

---

*Last Updated: March 6, 2025*
