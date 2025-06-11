from django.urls import path
from . import views


#Cette URL ('') correspond à la page d’accueil du site (racine /)
#Elle est reliée à la vue galerie_view définie dans views.py
urlpatterns = [
    path('', views.home_view, name='home'),
    path('galerie/', views.galerie_view, name='galerie'),
]