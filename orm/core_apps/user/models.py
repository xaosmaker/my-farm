"""
Base user model.
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.user.manager import UserManager

# TODO: need test admin user


class User(AbstractBaseUser, PermissionsMixin):
    """
    Base user class
    """

    id = models.BigAutoField(primary_key=True, unique=True, editable=False)
    email = models.EmailField(
        verbose_name=_("Email Address"),
        unique=True,
        max_length=200,
        db_index=True,
    )
    first_name = models.CharField(verbose_name=_("First name"), max_length=60)
    last_name = models.CharField(verbose_name=_("Last name"), max_length=60)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return str(self.email)
