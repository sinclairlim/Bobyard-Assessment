#!/bin/bash

echo "Starting Django Backend Server..."
cd backend/backend
source venv/bin/activate
python manage.py runserver
