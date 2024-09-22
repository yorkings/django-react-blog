from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.utils.text import slugify
from shortuuid.django_fields import ShortUUIDField
import shortuuid
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Use OneToOneField for a user profile
    image = models.ImageField(upload_to='images', default='default.webp')
    bio = models.CharField(max_length=100, null=True, blank=True)
    facebook = models.CharField(max_length=100, null=True, blank=True)
    twitter = models.CharField(max_length=100, null=True, blank=True)  # Corrected spelling
    instagram = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.user.username  


def create_user_profile(sender,instance,created,**kwargs): 
    if created:
        UserProfile.objects.create(user=instance)   

def save_user_profile(sender,instance,**kwargs):
    instance.userprofile.save()        

post_save.connect(create_user_profile,sender=User)    
post_save.connect(save_user_profile,sender=User)



class Category(models.Model):
    title=models.CharField(max_length=100)
    icons=models.FileField(upload_to='icon',null=True,blank=True)
    slug= models.SlugField(unique=True,blank=True)
    def __str__(self):
        return self.title 
    # class Meta:
    #     verbose_name_plural="Category" 
    def save(self,*args,**kwargs):
        if self.slug == "" or self.slug==None:
            self.slug=slugify(self.title)
        super(Category,self).save(*args,**kwargs)  

    def post_count(self):  
        return Post.objects.filter(category=self).count()  


class Post(models.Model):
    STATUS=(
        ("Active",'active'),
        ("Draft",'draft'),
        ("Disabled",'disabled'),
    )
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    profile=models.ForeignKey(UserProfile,on_delete=models.CASCADE,blank=True,null=True)
    title=models.CharField(max_length=100)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,null=True,blank=True)
    content=models.TextField(null=True,blank=True)
    image=models.FileField(upload_to="post",null=True,blank=True)
    status=models.CharField(choices=STATUS,default="Active",max_length=10 )
    view=models.IntegerField(default=0)
    likes=models.ManyToManyField(User,blank=True,related_name="likes_user")
    slug=models.SlugField(unique=True,blank=True)
    date=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title  
    
    class Meta:
        ordering=["-date"]
        verbose_name_plural="Post"
    def save(self,*args,**kwargs):
        if self.slug == "" or self.slug == None:
            self.slug = slugify(self.title)+ "-"+shortuuid.uuid()[:2]
        super(Post,self).save(*args,**kwargs)  

class comment(models.Model):
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    name=models.ForeignKey(User,on_delete=models.CASCADE)
    title=models.CharField(max_length=100)
    content=models.TextField(null=True,blank=True)
    reply=models.TextField(null=True,blank=True)
    date=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.post.title 
    
    class Meta:
        ordering=["-date"]
        verbose_name_plural="Comment"

      
class Bookmark(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    date=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.post.title 
    
    class Meta:
        ordering=["-date"]
        verbose_name_plural="Bookmark"

class Notification(models.Model):
    NOTE_TYPE=(
        ("Like",'like'),
        ("Comment",'Comment'),
        ("Bookmark",'Bookmark'),
    )
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    type=models.CharField(choices=NOTE_TYPE,max_length=10)
    seen=models.BooleanField(default=False)
    date=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        if self.post:
         return f"{self.post.title} -{self.type}"
        else:
            return "Notification"
    class Meta:
        ordering=["-date"]
        verbose_name_plural="Notification"