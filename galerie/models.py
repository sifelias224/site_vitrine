from django.db import models

# Create your models here.
class Photo(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='galerie/')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre