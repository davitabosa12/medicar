from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

# Create your views here.

def teste(request):
    return HttpResponse("teste is working")