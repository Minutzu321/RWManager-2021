#!/bin/bash
source /home/pi/pidjango/djenv/bin/activate
cd /home/pi/pidjango/frontend
npm run build
cd /home/pi/pidjango
python manage.py collectstatic
sudo supervisorctl restart all