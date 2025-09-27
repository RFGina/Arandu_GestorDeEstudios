from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from resumen import views
from django.conf import settings
from .views import get_carpetas, CuestomTokenObtainPairView, register, CustomRefreshTokenView, logout, is_authenticated, CarpetaViewSet, ResumenView
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('carpetas', CarpetaViewSet, basename='carpeta')
router.register('resumen', ResumenView, basename='resumen')


urlpatterns = [
    path('token/', CuestomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='is_authenticated'),
    path('registerUser/', register, name='registerUser'),
    path('', include(router.urls)),
]

