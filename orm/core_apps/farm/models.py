from typing import cast

from django.db import models

from core_apps.common.models import BaseModel
from core_apps.company.models import Company


class Farm(BaseModel):
    farm_name = models.CharField()
    farm_company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        related_name="fk_farm_company",
    )

    address = models.CharField(null=True, blank=True)

    class Meta:
        unique_together = ("farm_name", "farm_company")

    def __str__(self) -> str:
        comp = cast(Company, self.farm_company)
        return f"{self.farm_name}-{comp.company_name}"
