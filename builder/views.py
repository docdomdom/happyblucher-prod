from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import CustomUser, Armylist


from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def index(request):
    # pass logged in status on to index.html
    return render(request, "builder/index.html", {"logged_in": request.user.is_authenticated, "name": request.user.username})


def login_route(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return JsonResponse({"logged_in": True}, status=201)
            # return HttpResponseRedirect(reverse('index'))
        else:
            return JsonResponse({"message": "Invalid username or password."}, status=404)
    else:
        return render(request, "builder/index.html")


def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        confirmation = data["confirmation"]
        if password != confirmation:
            return JsonResponse({"message": "Passwords don't match."}, status=404)
        # Attempt to create new user
        try:
            user = CustomUser.objects.create_user(
                username=username, password=password)
        except IntegrityError:
            return JsonResponse({"message": "Username already taken."}, status=404)
        login(request, user)
        return JsonResponse({"logged_in": True}, status=201)
    else:
        return render(request, "builder/index.html")


def logout_route(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))


@ login_required
def my_lists(request):
    if request.method == "GET":
        try:
            # returns a queryset (list of objects)
            my_queryset = Armylist.objects.filter(user=request.user)
            # create a list made of dicts with the values from the queryset items
            list_of_dicts = [{"id": list["id"], "description": list["description"], "faction": list["faction"], "country": list["country"], "points": list["points"], "date": list["timestamp"].strftime("%d-%b-%y %H:%M:%S")}
                             for list in my_queryset.values()]
        except Armylist.DoesNotExist:
            return JsonResponse({"message": "No lists found."}, status=404)
        return JsonResponse(list_of_dicts, safe=False)
        # return JsonResponse([list.serialize() for list in lists], safe=False)

    # Return emails in reverse chronologial order
    # emails = emails.order_by("-timestamp").all()
    # return JsonResponse([email.serialize() for email in emails], safe=False)


@ login_required
def save_list(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    # try:
    # list name already exists
    #   existing_armylist = Armylist.objects.get(
    #      user=request.user, description=data["savedList"]["description"])
    #  return JsonResponse({"message": "Name already taken.", "success": False}, status=401)
    # list name doesn't exist yet
    # except Armylist.DoesNotExist:
    armylist = Armylist(
        # user=request.user, description=data["description"], points=data["totalPoints"], faction=data["name"], data=data["alldata"])
        user=request.user, description=data["savedList"]["description"], country=data["savedList"]["country"], points=data[
            "savedList"]["totalPoints"], faction=data["savedList"]["name"], data=json.dumps(data["savedList"]))

    # dump the json.loads(request.body) first into json string with json.dumps(data["savedList"] and then save it to the model.
    armylist.save()
    return JsonResponse({"message": "List saved successfully."}, status=201)


@login_required
def load_list(request, id):
    if request.method == "GET":
        try:
            list = Armylist.objects.filter(user=request.user, id=id)
        except Armylist.DoesNotExist:
            return JsonResponse({"message": "No lists found."}, status=404)
        # list is queryset with one Armylist model object, list.values is queryset with only one dict item, [0] gets this dict
        # JSONResponse requires dict
        context = {"data": (list.values()[0]["data"])}
        return JsonResponse(context)


@login_required
def delete_list(request, id):
    if request.method == "POST":
        try:
            list = Armylist.objects.get(id=id)
        except Armylist.DoesNotExist:
            return JsonResponse({"message": "No lists found."}, status=404)
        list.delete()
        return JsonResponse({"message": "List deleted successfully."}, status=201)


@login_required
def delete_all(request):
    if request.method == "POST":
        try:
            all_lists = Armylist.objects.filter(user=request.user)
        except Armylist.DoesNotExist:
            return JsonResponse({"message": "No lists found."}, status=404)
        all_lists.delete()
        return JsonResponse({"message": "Lists deleted successfully."}, status=201)
