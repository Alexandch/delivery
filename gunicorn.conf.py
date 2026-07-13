import multiprocessing

import os





bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

workers = int(os.getenv('WEB_CONCURRENCY', str(min(multiprocessing.cpu_count() * 2 + 1, 4))))

timeout = int(os.getenv('GUNICORN_TIMEOUT', '60'))

accesslog = '-'

errorlog = '-'

capture_output = True

