#!/bin/bash
#sudo cp themachine.service /etc/systemd/system/themachine.service
#sudo systemctl daemon-reload
#sudo service themachine restart
cd /home/pi/pidjango/
sudo docker run -p 6379:6379 -d redis:5
sudo /home/pi/pidjango/djenv/bin/python manage.py runserver 192.168.0.149:8001