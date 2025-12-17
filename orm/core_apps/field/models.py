from typing import cast

from django.db import models

from core_apps.common.models import BaseModel
from core_apps.farm.models import Farm

# Create your models here.


class FarmField(BaseModel):
    field_name = models.CharField()
    farm_field = models.ForeignKey(
        Farm,
        on_delete=models.DO_NOTHING,
        related_name="farm_field",
    )
    epsg_2100_boundary = models.JSONField(null=True, blank=True)
    epsg_4326_boundary = models.JSONField(null=True, blank=True)
    area_in_meters = models.FloatField()
    farm_location = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = ("field_name", "farm_field")

    def __str__(self):
        farm_obj = cast(Farm, self.farm_field)

        return f"{self.field_name}-{farm_obj.farm_name}"


class SoilProperties(BaseModel):
    farm_field = models.ForeignKey(
        FarmField,
        on_delete=models.DO_NOTHING,
        related_name="farm_field_soil",
        null=True,
        blank=True,
    )

    soil_ph = models.FloatField(null=True, blank=True)
    soil_phosphorous = models.FloatField(null=True, blank=True)
    soil_nitrogen = models.FloatField(null=True, blank=True)
    soil_potasium = models.FloatField(null=True, blank=True)
