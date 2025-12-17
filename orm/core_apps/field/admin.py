from django.contrib import admin

from core_apps.field.models import FarmField, SoilProperties

# Register your models here.

admin.site.register(FarmField)
admin.site.register(SoilProperties)
