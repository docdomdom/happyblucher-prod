from . import views
from django.urls import path
from django.contrib import admin


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_route, name="login"),
    path("logout", views.logout_route, name="logout"),
    path("register", views.register, name="register"),

    path("save_list", views.save_list, name="save_list"),
    path("my_lists", views.my_lists, name="my_lists"),
    path("load_list/<int:id>", views.load_list, name="load_list"),
    path("delete_list/<int:id>", views.delete_list, name="delete_list"),
    path("delete_all", views.delete_all, name="delete_all"),

    path('admin/', admin.site.urls),
]
