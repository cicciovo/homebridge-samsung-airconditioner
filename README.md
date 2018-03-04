#Homebridge-samsung-airconditioner

Samsung Airconditioenr plugin for [Homebridge]

This allows you to control your Samsung Airconditioner with HomeKit and Siri.

##Installation
1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-samsung-airconditioner
3. To obtain a token run in a shell window the file Server8889.py: python Server8889.py

	3.1 Open another shell window, copy and past the command: 
curl -k -H "Content-Type: application/json" -H "DeviceToken: xxxxxxxxxxx" --cert /usr/local/lib/node_modules/homebridge-samsung-airconditioner/ac14k_m.pem --insecure -X POST https://192.168.1.152:8888/devicetoken/request

	3.2 In this string change 192.168.1.152 with the ip of your Airconditioner

	3.3 Send the command

	3.4 Turn On your AC

	3.5 In the window where are running the file Server8889.py should be appare the TOKEN, copy and past it in your config.json

4. Update your configuration file. See `config.json`.

	4.1 Change the ip with the ip of your AC

	4.2 Change the token with the token obtain in step 3

	4.3 if necessary change the patchCert

	
