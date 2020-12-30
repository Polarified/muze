from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


# Create your views here.
class ListRoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    """
    Defines how post requests will act with our data.
    """
    # queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer

    def post(self, request):
        # Make sure we have a session
        if not request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # Serialize the data from the post request and fill it in
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            # Check if host already owns a room
            if queryset.exists():
                # Update host's room if it exists
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                # Create a room for host if it doesn't have one yet
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                room = rooms[0]
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == room.host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoomView(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # Make sure we have a session
        if not request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        if code is not None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                room = rooms[0]
                self.request.session['room_code'] = code
                return Response({'Message': 'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Invalid Code': 'No such room exists'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid post data, did not find room code.'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoomView(APIView):
    def get(self, request, format=None):
        # Make sure we have a session
        if not request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
