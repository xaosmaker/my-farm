from django.db import models

from core_apps.common.models import BaseModel

# Create your models here.


class Company(BaseModel):
    company_name = models.CharField()

    def __str__(self):
        return f"Company {self.company_name}"
