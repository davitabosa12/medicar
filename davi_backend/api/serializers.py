from django.contrib.auth.models import User, Group
from django.db.models import Q
from rest_framework import serializers
from .models import Especialidade, Medico, Agenda, Horario, Consulta
from datetime import date, datetime
from rest_framework.exceptions import ValidationError


class EspecialidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidade
        fields = '__all__'

class MedicoSerializer(serializers.ModelSerializer):
    especialidade = EspecialidadeSerializer(read_only= False)
    class Meta:
        model = Medico
        fields = ('id', 'crm', 'nome', 'especialidade')

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = ['horario']
    def to_representation(self, instance):
        return str(instance.horario)[:5]

class AgendaSerializer(serializers.ModelSerializer):
    medico = MedicoSerializer(read_only=False)
    horarios = HorarioSerializer(many=True)
    class Meta:
        model = Agenda
        fields = '__all__'

class ConsultaSerializer(serializers.ModelSerializer):
    medico = MedicoSerializer()
    horario = HorarioSerializer()
    class Meta:
        model = Consulta
        fields = ['id', 'dia', 'horario', 'data_agendamento', 'medico']

class ConsultaCreateSerializer(serializers.Serializer):
    agenda_id = serializers.IntegerField()
    horario = serializers.TimeField()
    def validate(self, attrs):
        super().validate(attrs)
        # Invalidar datas passadas
        past_dates = Agenda.objects.filter(dia__lt=date.today())
        for past_date in past_dates:
            past_date.invalidar()
        # Invalidar horarios de hoje e que já passou da hora atual
        past_times_from_today = Horario.objects.filter(agenda__dia=date.today(), horario__lt=datetime.now().time())
        past_times_from_today.update(valido=False)
        # Invalidar agendas que todos os horarios estao invalidos
        agendas_validas = Agenda.objects.filter(valido=True)
        for agenda in agendas_validas:
            if not agenda.com_horarios_validos():
                agenda.invalidar()

        # Pegar agendas validas
        try:
            agendas_validas = Agenda.objects.filter(valido=True)
        except Agenda.DoesNotExist:
            raise serializers.ValidationError(detail="Data indisponivel")
        except Horario.DoesNotExist:
            raise serializers.ValidationError(detail="Horario indisponivel")
        usuario = self.context['request'].user
        print(usuario)
        

        try:
            agenda = Agenda.objects.get(id=attrs['agenda_id'], valido=True)
            horario_db = Horario.objects.get(agenda=agenda, horario=attrs['horario'], valido=True)
        except Agenda.DoesNotExist:
            raise ValidationError("Data indisponivel")
        except Horario.DoesNotExist:
            raise ValidationError("Horario indisponivel")
        try:
            consulta = Consulta.objects.get(dia=agenda.dia, cliente=usuario, horario__horario=horario_db.horario)
        except Consulta.DoesNotExist:
            return attrs
        raise ValidationError(f'{usuario} já possui consulta marcada no horário')
    def create(self, validated_data):
        agenda = Agenda.objects.get(id=validated_data['agenda_id'])
        horario = agenda.horarios.get(horario=validated_data['horario'])
        horario.valido = False
        horario.save()
        return Consulta.objects.create(
            dia=agenda.dia,
            horario=horario,
            medico=agenda.medico,
            cliente=self.context['request'].user
        )

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'password', 'email', 'groups']
        extra_kwargs = {
            'password': { 'write_only': True }
        }
        read_only_fields = ['id']
    def create(self, validated_data):
        # Cria um usuario normal no Django
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        # Atribui a senha ao usuário criado
        user.set_password(validated_data['password'])
        # Registra no banco de dados
        user.save()
        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']