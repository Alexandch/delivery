import os

import subprocess

import sys





def enabled(name, default='1'):

    return os.getenv(name, default).strip().lower() in {'1', 'true', 'yes', 'on'}





def manage(*args):

    subprocess.run([sys.executable, 'manage.py', *args], check=True)





if enabled('DJANGO_MIGRATE'):

    manage('migrate', '--noinput')



if enabled('DJANGO_COLLECTSTATIC'):

    manage('collectstatic', '--noinput')



if len(sys.argv) < 2:

    raise SystemExit('No application command was provided')



os.execvp(sys.argv[1], sys.argv[1:])

