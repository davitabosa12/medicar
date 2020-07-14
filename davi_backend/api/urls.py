from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views
from . import rest_viewsets
from . import views
from . import rest_api_views
router = routers.DefaultRouter()
router.register(r'users', rest_viewsets.UserViewSet)
router.register(r'groups', rest_viewsets.GroupViewSet)
router.register(r'especialidades', rest_viewsets.EspecialidadeViewSet)
router.register(r'medicos', rest_viewsets.MedicoViewSet)
router.register(r'agendas', rest_viewsets.AgendaViewSet)
router.register(r'horarios', rest_viewsets.HorarioViewSet)
router.register(r'consultas', rest_viewsets.ConsultaViewSet)

# API urls.py
urlpatterns = [
    path('teste/', views.teste),
    #path do rest framework
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls'), name='rest_framework'),
    #Autenticação de usuário
    path('api-token-auth/', authtoken_views.obtain_auth_token),
    # Cadastro de novos usuários
    path('register/', rest_api_views.UserCreate.as_view(), name='register')
    
]