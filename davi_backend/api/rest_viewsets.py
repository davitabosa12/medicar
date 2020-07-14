# Viewsets do djangorestframework
# Separado de views.py para não conflitar com as views de renderização de páginas web.

from django.contrib.auth.models import User, Group
from rest_framework import status, viewsets
from . import serializers
from .models import Especialidade, Medico, Agenda, Horario, Consulta
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from datetime import date, datetime


class EspecialidadeViewSet(viewsets.ModelViewSet):
    queryset = Especialidade.objects.all()
    serializer_class = serializers.EspecialidadeSerializer
    def get_queryset(self):
        qs = super().get_queryset()
        search_query = self.request.query_params.get('search')
        if search_query:
            return qs.filter(nome__icontains=search_query)
        return qs

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all().order_by('nome')
    serializer_class = serializers.MedicoSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        search_query = self.request.query_params.get('search')
        especialidade_query = self.request.query_params.getlist('especialidade')
        if search_query:
            qs = qs.filter(nome__icontains=search_query)
        if especialidade_query:
            qs = qs.filter(especialidade__id__in=especialidade_query)
        return qs


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer

class AgendaViewSet(viewsets.ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = serializers.AgendaSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        medico_query = self.request.query_params.get('medico', None)
        especialidade_query = self.request.query_params.getlist('especialidade', None)
        data_inicio = self.request.query_params.get('data_inicio', None)
        data_final = self.request.query_params.get('data_final', None)
        medico_id = ""
        
        # Filtragem pelo medico
        if medico_query:
            try:
                medico_id = int(medico_query)
                if medico_id < 0:
                    raise ValueError()
                qs = qs.filter(medico=medico_query)
            except ValueError as error:
                raise ValidationError(detail="Valor de 'medico' deve ser um inteiro positivo")
        # Filtragem por especialidade
            if especialidade_query:
                qs = qs.filter(especialidade__id__in=especialidade_query)
        # Filtragem por data_inicio
        if data_inicio:
            try:
                qs = qs.filter(dia__gte=data_inicio)
            except Exception as ex:
                raise ValidationError(detail="Valor de 'data_inicio' deve ter o formato de data: YYYY-MM-DD.")
        # Filtragem por data_final
        if data_final:
            try:
                qs = qs.filter(dia__lte=data_final)
            except Exception as ex:
                raise ValidationError(detail="Valor de 'data_final' deve ter o formato de data: YYYY-MM-DD.")
        return qs

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = serializers.HorarioSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    read_serializer_class = serializers.ConsultaSerializer
    write_serializer_class = serializers.ConsultaCreateSerializer

    def get_serializer_class(self):
        if self.action in ['create']:
            return self.write_serializer_class
        else:
            return self.read_serializer_class
    def create(self, request, *args, **kwargs):
        print("Called create in ConsultaViewSet")
        # Primeiro, valida os dados de entrada com o ConsultaCreateSerializer.
        create_serializer = self.get_serializer(data=request.data)
        if create_serializer.is_valid():
            # Caso os dados estejam validados, salve o recurso no banco.
            consulta = create_serializer.save()
            
            # Agora, usando o serializador de leitura, insira a instancia recem criada.
            read_serializer = serializers.ConsultaSerializer(consulta)
            # Retorne a nova instancia serializada com o serializador de leitura para o consumidor da API.
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Se os dados não forem validos, apenas retorne 400 com os erros detectados pelo serializador de escrita.
            return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def list(self, request):

        qs = Consulta.objects.all()
        
        # Retorna todas as consultas do usuario
        if not request.user.is_staff:
            now = datetime.now()
            qs = qs.filter(cliente=request.user, dia__gte=now.date()).exclude(dia=now.date(), horario__horario__lt=now.time())
        
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
    

    def destroy(self, request, pk=None):
        # validar o horário se ainda for possivel marcar uma consulta nesse dia/hora.
        try:
            consulta = Consulta.objects.get(id=pk)
            
        except Consulta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        horario = consulta.horario
        agenda = horario.agenda
        """
        ingenuamente validando os horarios da agenda e do horario
        na próxima vez que for necessário verificar se a agenda/horário forem validos,
        o proprio sistema rodará a rotina de validação e invalidará a agenda/horário indevidamente validado aqui.
        """
        agenda.valido = True
        horario.valido = True
        return Response(status=status.HTTP_204_NO_CONTENT)
        
        
    
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
