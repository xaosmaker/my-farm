from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SuppliesConfig(AppConfig):
    name = "core_apps.supplies"
    verbose_name = _("supply")
    verbose_name_plural = _("supplies")
