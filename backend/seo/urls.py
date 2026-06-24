from django.urls import path

from .views import PageSEORetrieveView

urlpatterns = [
    path('<slug:page_identifier>/', PageSEORetrieveView.as_view(), name='page-seo'),
]
