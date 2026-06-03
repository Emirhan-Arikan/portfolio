import logging
import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'E-posta adresi gereklidir.'}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email=email)
        if not users.exists():
            # For security reasons, don't disclose if email exists or not
            return Response({'message': 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi (varsa).'}, status=status.HTTP_200_OK)

        user = users.first()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Build reset link
        frontend_url = request.headers.get('origin') or 'http://localhost:3000'
        reset_link = f"{frontend_url}/auth/reset-password?token={token}&uid={uid}"

        # Send email
        subject = 'Şifre Sıfırlama Talebi'
        message = (
            f"Merhaba {user.username},\n\n"
            f"Hesabınızın şifresini sıfırlamak için aşağıdaki bağlantıya tıklayın:\n"
            f"{reset_link}\n\n"
            f"Eğer bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.\n"
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            # If console backend or SMTP fails, print to terminal as fallback so it's always viewable in dev
            print(f"\n================ RESET EMAIL FALLBACK ================")
            print(f"To: {user.email}")
            print(f"Subject: {subject}")
            print(f"Message:\n{message}")
            print(f"======================================================\n")

        return Response({'message': 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid', '').strip()
        token = request.data.get('token', '').strip()
        password = request.data.get('password', '').strip()

        if not uidb64 or not token or not password:
            return Response({'error': 'Eksik parametreler.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Geçersiz bağlantı.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Geçersiz veya süresi dolmuş sıfırlama kodu.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({'message': 'Şifreniz başarıyla güncellendi.'}, status=status.HTTP_200_OK)


class GithubLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip()
        redirect_uri = request.data.get('redirect_uri', '').strip()
        if not code:
            return Response({'error': 'OAuth kodu gereklidir.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Mock / Demo Mode
        if code.startswith('mock_github_code'):
            username = f"github_demo_{code.split('_')[-1]}"
            email = f"{username}@example.com"
            user, _ = User.objects.get_or_create(username=username, defaults={'email': email})
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)

        # 2. Exchange code for access token with GitHub APIs
        try:
            token_res = requests.post(
                'https://github.com/login/oauth/access_token',
                headers={'Accept': 'application/json'},
                data={
                    'client_id': settings.GITHUB_CLIENT_ID,
                    'client_secret': settings.GITHUB_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': redirect_uri
                },
                timeout=10
            )
            token_data = token_res.json()
            access_token = token_data.get('access_token')
            if not access_token:
                logger.error(f"GitHub OAuth error response: {token_data}")
                return Response({'error': 'GitHub erişim anahtarı alınamadı. Kimlik doğrulaması başarısız.'}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Retrieve user profile
            profile_res = requests.get(
                'https://api.github.com/user',
                headers={'Authorization': f"token {access_token}"},
                timeout=10
            )
            profile_data = profile_res.json()
            github_username = profile_data.get('login')
            if not github_username:
                return Response({'error': 'GitHub profil bilgisi okunamadı.'}, status=status.HTTP_400_BAD_REQUEST)

            # 4. Fetch emails to get primary verified email if empty
            email = profile_data.get('email')
            if not email:
                email_res = requests.get(
                    'https://api.github.com/user/emails',
                    headers={'Authorization': f"token {access_token}"},
                    timeout=10
                )
                emails = email_res.json()
                if isinstance(emails, list) and len(emails) > 0:
                    primary_emails = [e for e in emails if e.get('primary')]
                    email = primary_emails[0].get('email') if primary_emails else emails[0].get('email')

            username = f"github_{github_username.lower()}"
            user, _ = User.objects.get_or_create(username=username, defaults={'email': email or ''})
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"GitHub Login Exception: {e}")
            return Response({'error': f"Giriş başarısız oldu: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip()
        redirect_uri = request.data.get('redirect_uri', '').strip()
        if not code:
            return Response({'error': 'OAuth kodu gereklidir.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Mock / Demo Mode
        if code.startswith('mock_google_code'):
            username = f"google_demo_{code.split('_')[-1]}"
            email = f"{username}@example.com"
            user, _ = User.objects.get_or_create(username=username, defaults={'email': email})
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)

        # 2. Exchange code with Google token endpoint
        try:
            token_res = requests.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': redirect_uri,
                    'grant_type': 'authorization_code'
                },
                timeout=10
            )
            token_data = token_res.json()
            access_token = token_data.get('access_token')
            if not access_token:
                logger.error(f"Google OAuth error response: {token_data}")
                return Response({'error': 'Google erişim anahtarı alınamadı. Kimlik doğrulaması başarısız.'}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Retrieve user profile
            profile_res = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f"Bearer {access_token}"},
                timeout=10
            )
            profile_data = profile_res.json()
            email = profile_data.get('email')
            name = profile_data.get('name', '').replace(' ', '').lower()

            if not email:
                return Response({'error': 'Google e-posta adresi alınamadı.'}, status=status.HTTP_400_BAD_REQUEST)

            username = f"google_{name or email.split('@')[0]}"
            # Ensure unique username
            if User.objects.filter(username=username).exists() and not User.objects.filter(username=username, email=email).exists():
                username = f"{username}_{User.objects.filter(username__startswith=username).count()}"

            user, _ = User.objects.get_or_create(email=email, defaults={'username': username})
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Google Login Exception: {e}")
            return Response({'error': f"Giriş başarısız oldu: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
