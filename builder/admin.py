from django.contrib import admin
#from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Armylist


class CustomUserAdmin(admin.ModelAdmin):

    list_display = ("pk", "username")


class ArmyListAdmin(admin.ModelAdmin):
    list_display = ("pk", "user", "description",
                    "points", "faction", "timestamp")


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Armylist, ArmyListAdmin)


# @admin.register(Listing)
# class ListingAdmin(admin.ModelAdmin):
#    list_display = ("pk", "user", "title", "category",
#                    "image", "top_bid", "active", "timestamp")
#    # creates a filter field in admin interface
#    list_filter = ('category',)
