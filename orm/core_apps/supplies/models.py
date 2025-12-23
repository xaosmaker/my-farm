from django.db import models

from core_apps.common.models import BaseModel


# Create your models here.
class SupplyChoises(models.TextChoices):
    SPRAYING = "SPRAYING"
    FERTILIZER = "FERTILIZER"


class Suppies(BaseModel):
    name = models.CharField()
    choices = models.CharField(choices=SupplyChoises.choices)
