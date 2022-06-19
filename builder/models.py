from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    id = models.BigAutoField(primary_key=True)

    def _str__(self):
        # return self.username???
        return f"{self.username}"


class Armylist(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        "CustomUser", on_delete=models.CASCADE, related_name="userlists")
    description = models.CharField(max_length=255)
    faction = models.CharField(max_length=63)
    country = models.CharField(max_length=63)
    points = models.IntegerField()
    data = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    # serialize loaded Armylist to render in builder

    def serialize(self):
        return {
            "data": self.data,
        }


#from django.contrib.auth.models import AbstractUser
#from django.db import models
#from django.forms import ModelForm
#from django import forms
#
#
# class User(AbstractUser):
#    def _str__(self):
#        return f"{self.username}"
#
# class Listing(models.Model):
#    FASHION = 'fa'
#    TOYS = 'to'
#    ELECTRONICS = 'el'
#    HOME = 'ho'
#    category_choices = [
#        ('', 'Select...'),
#        (FASHION, 'Fashion'),
#        (TOYS, 'Toys'),
#        (ELECTRONICS, 'Electronics'),
#        (HOME, 'Home'),
#    ]
#    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userlistings")
#    title = models.CharField(max_length=64, help_text="Title")
#    category = models.CharField(max_length=2, choices=category_choices, help_text="Category")
#    description = models.TextField(max_length=1024, blank=True, help_text="Description")
#    top_bid = models.DecimalField(max_digits=8, decimal_places=2, help_text="Starting Bid")
#    #top_bid = models.FloatField(max_length=16, verbose_name="Starting Bid", help_text="Enter your bid in USD")
#    timestamp = models.DateTimeField(blank=True, null=True)
#    image = models.ImageField(upload_to='images', null=True, blank=True, help_text="Image")
#    active = models.BooleanField(default=True)
#
#    def __str__(self):
#        return f"{self.title}"
#
#
# class Bid(models.Model):
#    value = models.DecimalField(max_digits=8, decimal_places=2, help_text="Bid")
#    winner = models.BooleanField(default=False)
#    timestamp = models.DateTimeField(blank=True, null=True)
#    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listingbids")
#    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userbids")
#
#    def __str__(self):
#        return f"{self.listing} {self.value} {self.user}"
#
#    # look for winner=True and set him to False. Then do the normal save() procedure and save the new winner = True. This ensures
#    # True is a unique value in the table and the rest is always False.
#    #def save(self, *args, **kwargs):
#     #   if self.winner:
#      #      try:
#       #         temp = Bid.objects.get(winner=True)
#        #        if self != temp:
#         #           temp.winner = False
#          #          temp.save()
#           # except Bid.DoesNotExist:
#            #    pass
#        #super(Bid, self).save(*args, **kwargs)
#
# class Comment(models.Model):
#    comment = models.TextField(max_length=1024)
#    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listingcomments")
#    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="usercomments")
#    timestamp = models.DateTimeField(blank=True, null=True)
#
# class Watchlist(models.Model):
#    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userwatchlist")
#    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listingwatchlist")
#    timestamp = models.DateTimeField(blank=True, null=True)
#
# class ListingForm(ModelForm):
#
#    # hier änderungen für das Form Field möglich oder bei __init__ Funktion self.fields['description']
#    #title = forms.CharField(label=False, widget=forms.TextInput(attrs={'placeholder': 'Title'}))
#    #top_bid = forms.CharField(label=False)
#    # nicht mehr nötig, da crispy forms benutzt wird für bootstrap classes
#    # alle sichtbaren Felder bekommen form-control CSS-Klasse
#    def __init__(self, *args, **kwargs):
#            super().__init__(*args, **kwargs)
#            self.fields['title'].label = ""
#            self.fields['description'].label = ""
#            self.fields['category'].label = ""
#            self.fields['top_bid'].label = ""
#            self.fields['image'].label = ""
#            for visible in self.visible_fields():
#                visible.field.widget.attrs['class'] = 'form-control'
#            #self.fields['title'].widget.attrs.update({'placeholder': 'Title'})
#            #self.fields['description'].widget.attrs.update({'placeholder': 'Description'})
#            #self.fields['top_bid'].widget.attrs.update({'placeholder': 'Starting Bid'})
#            self.fields['description'].widget.attrs.update({'rows': 5})
#
#    class Meta:
#        model = Listing
#        fields = ['user', 'title', 'category', 'image', 'description', 'top_bid']
#        exclude = ['user']
#
#
# class BidForm(ModelForm):
#    # label im Form entspricht verbose_name im Model
#    value = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Bid'}))
#
#    class Meta:
#        model = Bid
#        fields = ['user', 'listing', 'winner', 'value']
#        exclude = ['user', 'listing', 'winner']
#
#
# class CommentForm(ModelForm):
#
#    comment = forms.CharField(label=False, widget=forms.Textarea(attrs={'rows': '2', 'placeholder': 'Comment', 'class': 'form-control'}))
#
#    class Meta:
#        model = Comment
#        fields = ['comment']
#        exclude = ['user', 'listing', 'timestamp']
#        #fields = ['comment', 'listing', 'user', 'timestamp']
#        #exclude = ['user', 'listing', 'timestamp']
#
#
# class WatchlistForm(ModelForm):
#    class Meta:
#        model = Watchlist
#        fields = ['user', 'listing', 'timestamp']
#        exclude = ['user', 'listing', 'timestamp']
#
#
#


#
#
#from django.contrib.auth.models import AbstractUser
#from django.db import models
#from django.db.models.fields.related import ManyToManyField
#
#
# class User(AbstractUser):
#    users_followed = models.ManyToManyField("User", related_name="followers")
#    followers_count = models.IntegerField(default=0)
#    favorites_count = models.IntegerField(default=0)
#
#
# class Post(models.Model):
#    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
#    content = models.TextField()
#    timestamp = models.DateTimeField(auto_now_add=True)
#    likescount = models.IntegerField(default=0)
#    liked_by = models.ManyToManyField("User")
#    def __str__(self):
#        return f"Post {self.pk}"
#
# class Like(models.Model):
##    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="post_likes")
##    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_likes")
##    choice = models.BooleanField(default=False)
##    timestamp = models.DateTimeField(auto_now_add=True)
#
#    def __str__(self):
#        return f"Like {self.pk}"
