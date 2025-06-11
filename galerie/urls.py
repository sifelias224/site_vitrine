from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('galerie/', views.galerie_view, name='galerie'),
    path('mosaique/', views.mosaique_view, name='mosaique'),
    path('a-propos/', views.a_propos, name='a_propos'),
    path('contact/', views.contact, name='contact'),
]