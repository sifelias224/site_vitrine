from django.shortcuts import render

# Create your views here.

from .models import Photo

def galerie_view(request):
    photos = Photo.objects.all().order_by('-date_creation')
    return render(request, 'galerie/galerie.html', {'photos': photos})


def home_view(request):
    return render(request, 'galerie/home.html')