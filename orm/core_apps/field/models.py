from typing import cast

from django.db import models

from core_apps.common.models import BaseModel
from core_apps.farm.models import Farm


class FarmField(BaseModel):
    field_name = models.CharField()
    farm_field = models.ForeignKey(
        Farm,
        on_delete=models.DO_NOTHING,
        related_name="fk_farm_field",
    )
    field_epsg_2100_boundary = models.JSONField(null=True, blank=True)
    field_epsg_4326_boundary = models.JSONField(null=True, blank=True)
    field_area_in_meters = models.FloatField()
    field_location = models.JSONField(null=True, blank=True)
    is_owned = models.BooleanField(default=False)

    class Meta:
        db_table = "farm_field"
        unique_together = ("field_name", "farm_field")

    def __str__(self):
        farm_obj = cast(Farm, self.farm_field)

        return f"{self.field_name}-{farm_obj.farm_name}"


class SoilProperties(BaseModel):
    farm_field = models.ForeignKey(
        FarmField,
        on_delete=models.DO_NOTHING,
        related_name="fk_farm_field",
        null=True,
        blank=True,
    )

    soil_ph = models.FloatField(null=True, blank=True)
    soil_phosphorous = models.FloatField(null=True, blank=True)
    soil_nitrogen = models.FloatField(null=True, blank=True)
    soil_potasium = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "farm_field_soil_properties"
