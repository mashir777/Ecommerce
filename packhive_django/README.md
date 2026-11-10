# PackHive (Django)

Same PackHive packaging storefront, rebuilt with Django templates + SQLite backend.

## Run

```bash
cd packhive_django
pip install -r requirements.txt
python manage.py migrate
python manage.py load_catalog
python manage.py runserver
```

Open http://127.0.0.1:8000/

Admin: `python manage.py createsuperuser` then http://127.0.0.1:8000/admin/
