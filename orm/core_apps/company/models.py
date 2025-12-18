from django.db import models

from core_apps.common.models import BaseModel


class Company(BaseModel):
    company_name = models.CharField()

    class Meta:
        db_table = "company"

    def __str__(self):
        return f"Company {self.company_name}"
