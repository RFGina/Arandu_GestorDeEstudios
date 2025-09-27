from rest_framework import serializers
from .models import Carpeta, Resumen
from django.contrib.auth.models import User

class CarpetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carpeta
        
        fields = '__all__'
        read_only_fields = ('id', 'fecha_creacion', 'usuario')


class ResumenSerializer(serializers.ModelSerializer):
    # campo para incluir los datos de la carpeta
    carpeta_nombre = serializers.CharField(source='carpeta.nombre', read_only=True)
    carpeta_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Resumen
        fields = '__all__'

    def get_carpeta_info(self, obj):
        if obj.carpeta:
            return {
                'id': obj.carpeta.id,
                'nombre': obj.carpeta.nombre,
                'descripcion': obj.carpeta.descripcion
            }
        return None

    def create(self, validated_data):
        resumen = Resumen.objects.create(
            titulo=validated_data['titulo'],
            contenido=validated_data['contenido'],
            carpeta=validated_data['carpeta']  
        )
        return resumen


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        
        fields = ['username']

    

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        
        fields = ['username', 'email', 'password' ]

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user