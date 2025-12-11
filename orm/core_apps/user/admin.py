from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from core_apps.user.models import User


class UserAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = (
        "email",
        "id",
        "is_active",
        "is_superuser",
        "created_at",
    )
    readonly_fields = ("created_at", "edited_at", "last_login")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_superuser",
                    "is_staff",
                    "is_active",
                    "user_permissions",
                )
            },
        ),
        ("dates", {"fields": ("created_at", "edited_at", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ["wide"],
                "fields": (
                    "email",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


admin.site.register(User, UserAdmin)
