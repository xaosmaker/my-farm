from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CompanyConfig(AppConfig):
    name = "core_apps.company"
    verbose_name = _("Company")
