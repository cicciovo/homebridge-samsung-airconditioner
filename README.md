#Homebridge-samsung-airconditioner

Samsung Airconditioenr plugin for [Homebridge]

This allows you to control your Samsung Airconditioner with HomeKit and Siri.

THIS SCRIPT FOR NOW WORKS ONLY WITH THE AC WITH THE PORT NUMBER 8888 AND NOT WITH THE PORT 2878

##Installation
1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-samsung-airconditioner
3. To obtain a token (if the clima is ON, turn OFF it) run in a shell window the file Server8889.py: python Server8889.py 

	3.1 Open another shell window, copy and past the command: 
curl -k -H "Content-Type: application/json" -H "DeviceToken: xxxxxxxxxxx" --cert /usr/local/lib/node_modules/homebridge-samsung-airconditioner/ac14k_m.pem --insecure -X POST https://192.168.1.152:8888/devicetoken/request

	3.2 In this string change 192.168.1.152 with the ip of your Airconditioner

	3.3 Send the command

	3.4 Turn On your AC

	3.5 In the window where are running the file Server8889.py should be appare the TOKEN, copy and past it in your config.json

4. Remember to install "Samsung root certificate" in the System

	4.1 if you are on the mac double click on the certain
	
	4.2 if you are in Raspberry to add the root certificate this:
	
		sudo mkdir /usr/share/ca-certificates/local
		
		sudo cp /usr/lib/node_modules/homebridge-samsung-airconditioner/ac14k_m.pem /usr/share/ca-certificates/local/
		
		sudo update-ca-certificates
	
	(If you are in a new system the cartificate is not valid, because the new system acpet only SHA256 certificate, and the ack_14m.pem is a SHA1 certificate, so, if do you want use this plugin, tell to your PC to use Tls version 1.0 or minor)

5. Update your configuration file. See `config.json`.

	5.1 Change the ip with the ip of your AC

	5.2 Change the token with the token obtain in step 3

	5.3 if necessary change the patchCert
	
	5.4 If you obtain an error with this string "Power function failed /bin/sh: jq: not found" install jq with the command brew install jq
	
6. If you obtain an Nan error/undefined error see if your AC is connected to the wifi or if there are a problem with certificate.

