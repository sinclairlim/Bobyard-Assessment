import os
import django
import json
from dateutil import parser

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from comments.models import Comment

def load_comments():
    json_file = '../../comments.json'

    with open(json_file, 'r') as f:
        data = json.load(f)

    Comment.objects.all().delete()

    for comment_data in data['comments']:
        Comment.objects.create(
            author=comment_data['author'],
            text=comment_data['text'],
            date=parser.parse(comment_data['date']),
            likes=comment_data['likes'],
            image=comment_data.get('image', '')
        )

    print(f"Successfully loaded {len(data['comments'])} comments!")

if __name__ == '__main__':
    load_comments()
