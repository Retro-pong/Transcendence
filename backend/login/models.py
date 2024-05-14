from django.db import models


class TFA(models.Model):
    email = models.EmailField(max_length=200, null=False)
    code = models.CharField(max_length=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tfa"
        ordering = ["-created_at"]

    def __str__(self):
        return self.email
