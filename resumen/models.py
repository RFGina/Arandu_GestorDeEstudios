from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

class Carpeta(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
        unique_together = ['nombre', 'usuario']  
    
    def __str__(self):
        return f"{self.nombre} - {self.usuario.username}"
    
    def get_absolute_url(self):
        return reverse('carpeta_detalle', kwargs={'pk': self.pk})

class Resumen(models.Model):
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
    activo = models.BooleanField(default=True)
    carpeta = models.ForeignKey(Carpeta, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name_plural = "Resúmenes"
    
    def __str__(self):
        return f"{self.titulo} - {self.carpeta.nombre}"
    
    def get_absolute_url(self):
        return reverse('resumen_detalle', kwargs={'pk': self.pk})