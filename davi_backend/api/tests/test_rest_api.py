from django.urls import reverse
from django.urls import path, include
from rest_framework import status
from rest_framework.test import APITestCase, URLPatternsTestCase, APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from api.models import Especialidade, Medico, Agenda, Consulta, Horario
from rest_framework.test import force_authenticate
from api import rest_api_views
from datetime import date, datetime, timedelta, time

class UserTests(APITestCase):
    def test_criar_nova_conta(self):
        """
        Teste de criação de conta
        """
        url = reverse('register')
        data = {
            'username': 'djangotest',
            'password': 'secret',
            'email': 'djangotest@django.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class ConsultaTests(APITestCase):
    mock_user = None
    mock_medico = None
    mock_agenda = None
    mock_horario = None
    mock_especialidade = None
    mock_dia = datetime(2020, 8, 26, 15, 00, 00, 00, datetime.now().tzinfo)
    mock_agenda_passada = None
    client = APIClient()
    def setUp(self):
        self.mock_user = User.objects.create_user('client', 'client@example.com', 'client')
        self.mock_especialidade = Especialidade.objects.create(nome='CARDIOLOGIA')
        self.mock_medico = Medico.objects.create(nome='Dr. Roberto', especialidade= self.mock_especialidade)
        self.mock_agenda = Agenda.objects.create(dia=self.mock_dia.date(), medico=self.mock_medico)
        self.mock_horario = Horario.objects.create(agenda=self.mock_agenda, horario=self.mock_dia.time())
        #criar dia passado
        mock_dia_passado = datetime.now() - timedelta(days=1)
        self.mock_agenda_passada = Agenda.objects.create(dia= mock_dia_passado, medico=self.mock_medico)
        meia_noite = time(0, 0, 0, 0)
        #criar um horario passado à meia_noite
        Horario.objects.create(agenda=self.mock_agenda_passada, horario=meia_noite)

        
    def test_criar_nova_consulta(self):
        url = '/api/consultas/'
        data = {
            'agenda_id': self.mock_agenda.id,
            'horario': self.mock_horario.horario
        }
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_criar_nova_consulta_agenda_errada(self):
        url = '/api/consultas/'
        data = {
            'agenda_id': 8000,
            'horario': self.mock_horario.horario
        }
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_criar_nova_consulta_horario_errado(self):
        url = '/api/consultas/'
        data = {
            'agenda_id': self.mock_agenda.id,
            'horario': '00:00'
        }
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_nova_consulta_dia_passado(self):
        url = '/api/consultas/'
        data = {
            'agenda_id': self.mock_agenda_passada.id,
            'horario': '00:00'
        }
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_criar_nova_consulta_indisponivel(self):
        self.test_criar_nova_consulta() #chama o teste de criar uma nova consulta...
        url = '/api/consultas/'
        data = {
            'agenda_id': self.mock_agenda.id,
            'horario': self.mock_horario.horario
        }
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remover_consulta(self):
        self.test_criar_nova_consulta()
        consulta_id = Consulta.objects.all()[0].id
        url = f'/api/consultas/{consulta_id}/'
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_remover_consulta_inexistente(self):
        url = '/api/consultas/8000/'
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    
class EspecialidadeTest(APITestCase):
    client = APIClient()
    mock_user = None
    def setUp(self):
        Especialidade.objects.create(nome="Cardiologista")
        Especialidade.objects.create(nome="Clinico Geral")
        Especialidade.objects.create(nome="Nutrição")
        self.mock_user = User.objects.create_user('mock')
    def test_get_especialidades(self):
        url = '/api/especialidades/'
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    def test_get_especialidades_nao_autorizado(self):
        url = '/api/especialidades/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    def test_get_especialidades_filtro(self):
        url = '/api/especialidades/?search=card'
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.get(url)
        self.assertEqual(response.data[0]['nome'], 'Cardiologista')

class MedicoTest(APITestCase):
    client = APIClient()
    mock_user = User.objects.create_user('mock')
    def setUp(self):
        #mock especialidades
        cardio = Especialidade.objects.create(nome="Cardiologista")
        clinico = Especialidade.objects.create(nome="Clinico Geral")
        nutri = Especialidade.objects.create(nome="Nutrição")
        #mock medicos
        Medico.objects.create(nome='Dr. Roberto', especialidade=cardio, crm='123456')
        Medico.objects.create(nome='Dra. Ana', especialidade=nutri, crm='654321')
        Medico.objects.create(nome='Dra. Carla', especialidade=clinico, crm='7890')
        Medico.objects.create(nome='Dr. João', especialidade=clinico, crm='585678')
    def test_get_medicos(self):
        url = '/api/medicos/'
        self.client.force_authenticate(user=self.mock_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4, '4 Médicos cadastrados')
    def test_get_medicos_nao_autorizado(self):
        url = '/api/medicos/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
