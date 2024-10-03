from django.contrib import admin
from .models import *
# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display=("title",'icons','slug')
    prepopulated_fields={'slug':('title',)}


admin.site.register(UserProfile)
admin.site.register(Category,CategoryAdmin)
admin.site.register(Post)
admin.site.register(Notification)
admin.site.register(Bookmark)
admin.site.register(Comment)
