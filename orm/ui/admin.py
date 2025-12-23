from django.contrib import admin

from ui.custom_model import (
    Farms,
    Fields,
    Jobs,
    JobsObservations,
    JobsSupplies,
    Supplies,
    SuppliesDetails,
    SuppliesPrices,
    Users,
)


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ("email", "farm__name")  # customize columns shown in list
    search_fields = ("email", "farm__name")


@admin.register(Farms)
class FarmsAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Fields)
class FieldsAdmin(admin.ModelAdmin):
    list_display = ("name", "farm__name")
    search_fields = ("name", "farm__name")


@admin.register(Supplies)
class SuppliesAdmin(admin.ModelAdmin):
    list_display = ("name", "farm__name")
    search_fields = ("name", "farm__name")


@admin.register(SuppliesPrices)
class SuppliesPricesAdmin(admin.ModelAdmin):
    list_display = ("price", "supply__name")
    search_fields = ("supply__name",)


@admin.register(SuppliesDetails)
class SuppliesDetailsAdmin(admin.ModelAdmin):
    list_display = ("description", "supply__name")
    search_fields = ("description", "supply__name")


@admin.register(Jobs)
class JobsAdmin(admin.ModelAdmin):
    list_display = ("job_type", "field__name")
    search_fields = ("job_type", "field__name")


@admin.register(JobsSupplies)
class JobsSuppliesAdmin(admin.ModelAdmin):
    list_display = ("quantity", "job__job_type", "job__field__name")
    search_fields = ("job__job_type", "job__field__name")


@admin.register(JobsObservations)
class JobsObservationsAdmin(admin.ModelAdmin):
    list_display = (
        "observations",
        "job__job_type",
    )  # "Job__job__field__name")
    search_fields = ("observations", "job__job_type")
