
# 🎨 Projet Django - Site Vitrine Artistique

## 🚧 Objectif
Créer un site vitrine artistique avec :
- affichage d’œuvres (galerie photo HD),
- base de données (gestion via l'admin Django),
- flux RSS,
- automatisation vers les réseaux sociaux.

---

## 🛠️ Étapes de mise en place

### 📁 1. Création du dossier projet
```bash
mkdir site_vitrine_artiste && cd site_vitrine_artiste
```

### 🐍 2. Création de l'environnement virtuel Python
```bash
python -m venv .venv
source .venv/bin/activate
```

### 🧰 3. Installation de Django
```bash
pip install django
```

### 🚀 4. Création du projet Django
```bash
django-admin startproject vitrine .
```

### 🗃️ 5. Initialisation de la base de données
```bash
python manage.py migrate
```

> ✅ Création des tables : `auth`, `admin`, `contenttypes`, `sessions`, etc.

### 🔐 6. Création du super-utilisateur (admin)
```bash
python manage.py createsuperuser
```

> ✅ Utilisateur admin créé avec login `root` et email personnel

### 🌍 7. Lancement du serveur local
```bash
python manage.py runserver
```

> Accès à : http://127.0.0.1:8000 et http://127.0.0.1:8000/admin

### 🧩 8. Démarrage de Jupyter Lab (optionnel)
```bash
jupyter-lab
```

> ✅ JupyterLab lancé sur : http://localhost:8888/lab

---

## 📦 9. Création de la première app Django : `galerie`
```bash
python manage.py startapp galerie
```

Structure du dossier généré :
```
galerie/
├── admin.py         # Affichage dans l’interface admin
├── apps.py          # Configuration de l’app
├── models.py        # Définition des modèles (données)
├── views.py         # Fonctions qui génèrent les pages web
├── migrations/      # Historique des changements de modèles
└── ...
```

---

## 🧠 Remarques pédagogiques

- Django fonctionne en **projet + applications**
- Chaque app est indépendante et modulaire
- L’environnement virtuel permet de ne pas polluer le système global
- Le serveur local est accessible sur `127.0.0.1:8000`
- L’interface admin est une force majeure de Django : super pratique pour les contenus dynamiques

---

## 🔧 Étape 10 — Activer l’application `galerie` dans le projet Django

### 🎯 Pourquoi ?
Django ne sait pas que tu veux utiliser l’app `galerie`.  
Il faut l’ajouter dans la configuration pour qu’elle soit prise en compte.

---

### 🗂️ Fichier concerné :
`vitrine/settings.py`

---

### ✍️ Action à faire :
1. Ouvrir le fichier `vitrine/settings.py`
2. Rechercher la variable `INSTALLED_APPS`
3. Ajouter `'galerie',` à la fin de la liste

---

### ✅ Exemple de code :
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'galerie',  # 👈 Ajout de l'application "galerie"
]

## 🖼️ Étape 11 — Création du modèle `Photo` dans l'application `galerie`

### 🎯 Objectif :
Définir une **structure de données** pour représenter chaque œuvre artistique dans la base de données :
- un **titre**
- une **description**
- une **image**
- une **date de création**

---

### 🗂️ Fichier concerné :
`galerie/models.py`

---

### ✍️ Code à ajouter :
```python
from django.db import models

class Photo(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='galerie/')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre

### Dans la consol
faires les commandes suivante : 
    - python manage.py makemigrations #Pour preparer les tables
    - python manage.py migrate #Pour exécuter la tache préparer en amont ;)


## 🛠️ Étape 12 — Enregistrer le modèle `Photo` dans l’interface d’administration

### 🎯 Objectif :
Permettre d’ajouter/modifier/supprimer des photos dans l’interface Django Admin.

---

### 🗂️ Fichier concerné :
`galerie/admin.py`

---

### ✍️ Code à ajouter :
```python
from django.contrib import admin
from .models import Photo

admin.site.register(Photo)

## 🖼️ Étape 13 — Configuration des fichiers médias (images)

### 🎯 Objectif :
Permettre l’upload et l'affichage d’images dans l'interface Django (et plus tard sur le site vitrine).

---

### 🗂️ Fichier à modifier :
`vitrine/settings.py`

---

### ✍️ Ajout à faire en bas du fichier :
```python
import os

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

### 🧩 Étape complémentaire — Servir les fichiers médias en développement

### 🎯 Pourquoi ?
Par défaut, Django **ne sert pas les fichiers médias** (images, vidéos, etc.) pendant le développement.  
Cette étape permet d’accéder aux fichiers uploadés via des URLs (`/media/...`) quand `DEBUG = True`.

---

### 🗂️ Fichier à modifier :
`vitrine/urls.py`

---

### ✍️ Code à ajouter tout en bas :
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

Cette configuration ne sert les fichiers média que quand DEBUG = True, donc en développement uniquement.
En production, tu devras configurer Nginx ou un autre serveur pour servir ces fichiers.

## 🌐 Étape 15 — Créer une vue publique pour afficher les photos

### 🎯 Objectif :
Afficher les œuvres de ta galerie (modèle `Photo`) sur une **page web visible par tous**.

---

### 🗂️ Fichier à modifier :
`galerie/views.py`

---

### ✍️ Code à ajouter :
```python
from django.shortcuts import render
from .models import Photo

def galerie_view(request):
    photos = Photo.objects.all().order_by('-date_creation')
    return render(request, 'galerie/galerie.html', {'photos': photos})

## 🔗 Étape 16 — Lier la vue `galerie_view` à une URL

### 🎯 Objectif :
Faire en sorte que Django affiche la galerie quand l’utilisateur visite le site (par exemple `http://127.0.0.1:8000`)

---

## 🗂️ Partie 1 — Créer le fichier `galerie/urls.py`

> Par défaut, ce fichier n’existe pas. On va le créer.

### 📄 Crée un fichier : `galerie/urls.py`

### ✍️ Contenu à ajouter :
```python
from django.urls import path
from .views import galerie_view

urlpatterns = [
    path('', galerie_view, name='galerie'),
]

## 🗂️ Partie 2 — Relier l’application `galerie` au routeur principal Django

### 🎯 Objectif :
Dire à Django que les URLs définies dans `galerie/urls.py` doivent être utilisées pour gérer les routes du site.

---

### 📄 Fichier à modifier :
`vitrine/urls.py`

---

### ✍️ Étapes :

1. Ajouter l import include` en haut du fichier :
```python
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('galerie.urls')),  # 👈 Ajout ici
]

## 🎨 Étape 17 — Créer un template HTML pour afficher la galerie

### 🎯 Objectif :
Afficher les images enregistrées via l’interface admin sur la page d’accueil `http://127.0.0.1:8000/`.

---

### 📁 Dossier à créer (si pas encore fait) :
`galerie/templates/galerie/`

> Django s'attend à trouver les templates dans ce chemin précis :  
> `nom_app/templates/nom_app/fichier.html`

---

### 📄 Fichier à créer :
`galerie/templates/galerie/galerie.html`

---

### ✍️ Contenu minimal du fichier (version simple) :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Galerie artistique</title>
</head>
<body>
    <h1>Bienvenue dans la galerie</h1>
    <ul>
        {% for photo in photos %}
            <li>
                <h3>{{ photo.titre }}</h3>
                <p>{{ photo.description }}</p>
...

## 🖼️ Étape 18 — Ajouter des photos dans l’interface d’administration Django

### 🎯 Objectif :
Uploader des images dans ta base de données via l’interface `/admin`, pour qu’elles s’affichent dans ta galerie.

---

### ✅ Prérequis :
- Tu as bien créé ton modèle `Photo`
- Tu l’as enregistré dans `admin.py` :
```python
from django.contrib import admin
from .models import Photo

admin.site.register(Photo)

Tu as créé un superutilisateur(createsuperuser)
                 
Le serveur tourne (python manage.py runserver)
