from django.db import models
from datetime import date
from django.core.exceptions import ValidationError
# Create your models here.
# Modelo Medico
class Medico(models.Model):
    nome = models.CharField(max_length=125) #Nome completo do medico
    crm = models.CharField(max_length=50) # Cadastro no Conselho Regional de Medicina
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    especialidade = models.ForeignKey('Especialidade', on_delete=models.CASCADE) # Área de atuação do médico
    def __str__(self):
        return f"{self.nome}, CRM:{self.crm}"

# Modelo Especialidade
class Especialidade(models.Model):
    nome = models.CharField(max_length=100) # Nome da especialidade

    def __str__(self):
        return self.nome

# Modelo Agenda
class Agenda(models.Model):
    dia = models.DateField(verbose_name='Data de alocação do médico')
    medico = models.ForeignKey('Medico', on_delete= models.CASCADE)
    valido = models.BooleanField(default=True, editable=False)

    def com_horarios_validos(self):
        horarios_validos = self.horarios.filter(valido=True)
        return len(horarios_validos) > 0

    def invalidar(self):
        self.valido = False
        self.save()
        self.horarios.update(valido=False)
    def __str__(self):
        return f"Agenda de {self.medico.nome}: {self.dia}"
    def clean(self):
        if self.dia < date.today():
            raise ValidationError('Novas entradas de Agenda não podem receber datas no passado.')
    class Meta:
        ordering = ['dia']

# Modelo Horario
class Horario(models.Model):
    horario = models.TimeField()
    agenda = models.ForeignKey('Agenda', related_name='horarios', on_delete= models.CASCADE)
    valido = models.BooleanField(default=True, editable=False)
    def __str__(self):
        return f"{self.horario} {self.agenda}"
    def validate_unique(self, exclude=None):
        try:
            Horario.objects.get(agenda__id = self.agenda.id, horario=self.horario)
        except Horario.DoesNotExist:
            return
        raise ValidationError("Dois horarios repetidos na mesma agenda.")

    class Meta:
        ordering = ['horario']

# Modelo Consulta
class Consulta(models.Model):
    dia = models.DateField(verbose_name='Dia da consulta')
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    data_agendamento = models.DateTimeField(auto_now=True, verbose_name='Data de agendamento')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    cliente = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return f"Consulta de {self.cliente} com {self.medico} dia {self.dia} as {self.horario.horario}"