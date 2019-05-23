# homebridge-samsung-smart-aircon
(homebridge-samsung-aircon-8888 <= This name triggers npm spam check...)

This is a [Homebridge](https://homebridge.io/) plugin for Samsung Smart Air Conditioner with Port 8888. If you have your Samsung AC working over Port 2878, please check out [this project](https://github.com/SebastianOsinski/HomebridgePluginSamsungAirConditioner).

This allows you to control your Samsung air conditioner with HomeKit and Siri.

## Air Conditioner Model

Tested with AJ009MBADEC, should work with all AJ\*\*\*MBADEC models.

![Samsung AJ009MBADEC](https://images.samsung.com/is/image/samsung/sg-sac-fjm-5ticks-aj009mbadec-sp-frontopenwhite-62829763?$PD_GALLERY_L_JPG$)

## Installation

Make sure that you have Node and npm installed.

### Install Homebridge

```bash
npm install -g homebridge
```

If you encounter permission issue, you may need do this with `sudo` and `--unsafe-perm`:

```
sudo npm install -g homebridge --unsafe-perm
```

If you are on Raspberry or Debian system, and wish to use `systemd` to run `homebridge` so that it is persisted, please refer to this [reference](https://gist.github.com/johannrichard/0ad0de1feb6adb9eb61a/).

### Install Plugin

```bash
npm install -g homebridge-samsung-smart-aircon
```

Please apply `sudo` and / or `--unsafe-perm` if you encounter any permission error.

### Install jq
[jq](https://stedolan.github.io/jq/) is a command-line JSON parse tool. You need install `jq` first.

On Mac, if you have [`brew`](https://brew.sh/) installed:

```bash
brew install jq
```

On Linux (Raspberry Pi etc.), you may try `apt-get`:

```bash
apt-get install jq
```

### Obtain Your Samsung AC Token

#### Assign Static IP

It is highly recommended to assign a static IP to your AC. If you have not done so, please do this via your home router, and restart your AC (cut off power, not via remote only) or router thereafter, to make sure that your AC does have the static IP you have assigned to.

#### Get Token

`cd` to your installed `node_modules/homebridge-samsung-aircon-8888`, and you will find a `Server8889.py` script.

From the folder:

```bash
python Server8889.py
```

Note that this scripts needs the cert `ac14k_m.pem`, which is in the plugin folder as well. It assumes that your plugin is installed at `/usr/local/lib/node_modules/homebridge-samsung-aircon-8888`. If in any case that the path of your installed module is different, you need feed it with the correct path:

```bash
python Server8889.py /my-absolute-path-to/ac14k_m.pem
```

If successful, a server will run and listen to the response from your AC. **Open a new Terminal / Shell window**, and type in as follows. **Please do not hit enter to execute this first**.

```bash
curl -k -H "Content-Type: application/json" -H "DeviceToken: xxxxxxxxxxx" --cert /usr/local/lib/node_modules/homebridge-samsung-aircon-8888/ac14k_m.pem --insecure -X POST https://192.168.1.xxx:8888/devicetoken/request
```

Please replace the IP address to your AC's static IP. If you have your cert elsewhere, please replace the cert path too.

Turn off your AC, and then hit enter to run the script. Then turn on your AC again.

Return to the Shell window that is running the python script. You should see the following:

```
----- Request Start ----->

/devicetoken/response
Host: 192.168.1.xxx:8889
Accept: */*
X-API-Version : v1.0.0
Content-Type: application/json
Content-Length: 28

{"DeviceToken":"xxxxxxxx"}
<__main__.RequestHandler instance at 0x......>
<----- Request End -----
```

Please note down the `DeviceToken` value. This is your AC token.

### Install Root Certificate

If you are on Mac, simply double click to install it.

If you are on Linux:

```bash
 sudo mkdir /usr/share/ca-certificates/local
 
 sudo cp /usr/lib/node_modules/homebridge-samsung-aircon-8888	/ac14k_m.pem /usr/share/ca-certificates/local/
 
 sudo update-ca-certificates
 ```

### Update Homebridge Config File

Usually, you may find your Homebridge config file at `~/.homebridge/config.json`.

You may refer to the `config-sample.json` in this project folder as reference.

```jvascript
{
    // Homebridge and other configs...
    "accessories": [{
        "accessory": "SamsungSmartAirConditioner", // do not change this
        "name": "My Aircon",
        "ip": "192.168.1.x", // AC's static IP
        "token": "A1B2C3D4E5F", // the token 
        "patchCert": "/usr/local/lib/node_modules/homebridge-samsung-aircon-8888/ac14k_m.pem",
        "userAllowedMode": "cool" // 'both','heat', 'cool'
    }]
}
```

#### `userAllowedMode`

Accepted value: `'both'`, `'heat'`, `'cool'`.

While this AC technically supports both heating and cooling, Samsung has made specific models for some countries, and may have either heating or cooling disabled (even though the disabled mode can still be found on the official remote control, it's not functioning). Also, some parts of the world need not one of these modes.

Based on your AC model and your living place, you may wish to set this value to `'heat'` to allow heating only, or `'cool'` to allow cooling only, or `'both'`.

Please note that due to Homekit limitation, this may not be perfect.

## Some Notes

### Fan or Wind / Dry Mode

At current stage, homekit `HeaterCooler` does not have an option for these modes.

### Heating / Cooling Trigger Threshold

While this is not really an AC function, adjusting them is actually setting the **target temperature**. There are no separate thresholds for this AC. (and Homekit `HeaterCooler` does not support `TargetTemperature` directly. `Thermostat` supports it, but it does not have some other functions...)

### Swing and Wind Level

Switching between swinging and fixed modes is fine. The "Rotation Speed" is actually to adjust the wind level, which ranges from 1 to 4.

### Filter

Support for filter health has been added, though I am not sure how to see it in Apple's Home app. Its status is accessible via Siri. You may see this information if you use [Home 3](https://itunes.apple.com/us/app/home-3/id995994352?mt=8) app.

Resetting filter status function is yet to add.

## Credit

This project is forked from [cicciovo/homebridge-samsung-airconditioner](https://github.com/cicciovo/homebridge-samsung-airconditioner) and rewritten in Typescript.

The Typescipt part uses [homebridge-tesla](https://github.com/nfarina/homebridge-tesla) as reference, as well as for some `utils` methods.
