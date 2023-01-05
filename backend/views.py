from .api import *

#PAGINI
# @ensure_csrf_cookie
# def index(request):
#     ip = get_client_ip(request)

#     raspuns = render(request, 'build/index.html')
#     co = None
#     if ip_valid(ip):
#         co = cookie_protocol(request, ip, raspuns)
#         #daca userul are deja un cookie care este invalid, il stergem si dam refresh la pagina ca sa facem unul nou
#         if not co:
#             rasp = redirect('/')
#             rasp.delete_cookie('riverwolves_session')
#             return rasp
#     user = user_protocol(request, co)
#     if not user and request.COOKIES.get('riverwolves_user') :
#         rasp = redirect('/')
#         rasp.delete_cookie('riverwolves_user')
#         return rasp
#     return raspuns