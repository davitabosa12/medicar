from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Especialidade)
admin.site.register(models.Medico)
admin.site.register(models.Agenda)
admin.site.register(models.Horario)
admin.site.register(models.Consulta)