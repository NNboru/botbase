@echo off
cd F:\Rohan\Python\chatbot\botbase
f:
set FLASK_DEBUG=1
set FLASK_APP=app.py
python -m flask run --host=0.0.0.0