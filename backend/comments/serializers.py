from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'date', 'updated_at', 'likes', 'image']
        read_only_fields = ['id', 'date', 'updated_at', 'likes', 'image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make author read-only only for updates (PATCH/PUT), not for creation (POST)
        if self.instance is not None:  # This is an update
            self.fields['author'].read_only = True

    def validate_text(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Comment text cannot be empty.")
        return value
