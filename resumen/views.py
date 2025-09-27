from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializer import ResumenSerializer, CarpetaSerializer, UserRegistrationSerializer
from django.contrib.auth.models import User
from .models import Carpeta, Resumen
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class CuestomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        try: 
            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except:
            return Response({'success':False})
        

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try: 
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except:
            return Response({'refreshed': False})
        
@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success':False})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated':True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_carpetas(request):
    user = request.user
    carpetas = Carpeta.objects.filter(usuario=user)
    serializer = CarpetaSerializer(carpetas, many=True)
    return Response(serializer.data)

class CarpetaViewSet(viewsets.ModelViewSet):
    queryset = Carpeta.objects.all()
    serializer_class = CarpetaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtrar por usuario actual
        return Carpeta.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asignar usuario automáticamente
        serializer.save(usuario=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

class ResumenView(viewsets.ModelViewSet):
    queryset = Resumen.objects.all()
    serializer_class = ResumenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Resumen.objects.all()
        carpeta_id = self.request.query_params.get('carpeta')
        
        if carpeta_id:
            # Filtrar por carpeta
            queryset = queryset.filter(carpeta_id=carpeta_id)
        
        return queryset



