from django.db import models
from django.utils import timezone


class Comment(models.Model):
    author = models.CharField(max_length=100)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    likes = models.IntegerField(default=0)
    image = models.URLField(max_length=500, blank=True)

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        # Only set updated_at if the comment already exists and text changed
        if self.pk:
            try:
                old = Comment.objects.get(pk=self.pk)
                if old.text != self.text:
                    self.updated_at = timezone.now()
            except Comment.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.author}: {self.text[:50]}"
