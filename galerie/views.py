from django.shortcuts import render

# Create your views here.

from .models import Photo

from django.shortcuts import render

def home(request):
    return render(request, 'galerie/home.html')

def galerie_view(request):
    return render(request, 'galerie/galerie.html')

def mosaique_view(request):
    return render(request, 'galerie/mosaique.html')

def a_propos(request):
    return render(request, 'galerie/a_propos.html')

def contact(request):
    return render(request, 'galerie/contact.html')