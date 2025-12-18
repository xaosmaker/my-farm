from typing import cast

from django.contrib.auth import get_user_model
from django.db import models

from core_apps.common.models import BaseModel
from core_apps.company.models import Company
from core_apps.user.models import User


class UserProfile(BaseModel):
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        db_table = "user_profile"

    def __str__(self):
        user = cast(User, self.user)
        return f"User Profile {user.email}"
