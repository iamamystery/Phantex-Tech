from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SubmissionSerializer


class SubmissionCreateView(APIView):
    """
    POST /api/contact/submit/

    Public endpoint — no authentication required.
    Returns 201 on success, 400 with field-level errors on invalid input.
    Submissions are write-only: never exposed via GET.
    """

    permission_classes = [AllowAny]
    # Explicitly disable authentication to avoid CSRF/session issues from frontend
    authentication_classes = []

    def post(self, request):
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'success': True,
                    'message': "Thank you! We'll be in touch within 24 hours.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
