from django.db import models

# Create your models here.


class BaseModel(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
