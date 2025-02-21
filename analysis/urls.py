from django.urls import path
from .views import upload_code_view, process_code_view

urlpatterns = [
    path('', upload_code_view, name='upload_code'),
    path('process/', process_code_view, name='process_code'),
]
