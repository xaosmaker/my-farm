from typing import cast

from django.db import models

from core_apps.common.models import BaseModel


class Farm(BaseModel):
    farm_name = models.CharField()

    class Meta:
        db_table = "farm"

    def __str__(self) -> str:
        return f"{self.farm_name}"
