# homebridge-samsung-airconditioner
This is a plugin for homebridge to add a Samsung AirConditioner as an accessory type "HeaterCooler" in homekit.


In order to make it work you will need 


-**jq** '''brew jq'''
-**curl** '''brew curl'''
-a **token** to authenticate with the AC. You can find this very simply running the plugin
-a **certificate** to authenticate with the AC. You can find this very simply running the plugin
-the **ip address** of the AC 


At the moment you will need to change the **ip address**, the **token** and path to the **certificate** manually, inside the code file named index.js . 
I will streamline this and put it in the config file once i have some time to work on it. 
In the meanwhile feel free to try it and tell me your thoughts.
