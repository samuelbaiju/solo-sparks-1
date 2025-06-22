from django.contrib import admin
from .models import Quest, UserProfile, Reflection, Reward, Tag

class QuestAdmin(admin.ModelAdmin):
    filter_horizontal = ('tags',)

# Register your models here.
admin.site.register(Quest, QuestAdmin)
admin.site.register(UserProfile)
admin.site.register(Reflection)
admin.site.register(Reward)
admin.site.register(Tag)
