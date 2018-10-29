var Service, Characteristic;
var exec2 = require("child_process").exec;
var response;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    Accessory = homebridge.hap.Accessory;
    //UUIDGen = homebridge.hap.uuid;
    homebridge.registerAccessory("homebridge-samsung-airconditioner", "SamsungAirconditioner", SamsungAirco);
};

function SamsungAirco(log, config) {
    this.log=log;
    this.name= config["name"];
    this.ip=config["ip"];
    this.token=config["token"];
    this.patchCert=config["patchCert"];
    this.accessoryName=config["name"];
    this.setOn = true;
    this.setOff= false;
}



SamsungAirco.prototype = {
    
    
execRequest: function(str, body, callback){
    exec2(str, function(error, stdout, stderr){
        callback(error, stdout, stderr)
          })
    //return stdout;
},
    identify: function(callback) {
        this.log("Identify the clima!");
        callback(); // success
    },
    
    

getServices: function() {
    
    //var uuid;
    //uuid = UUIDGen.generate(this.accessoryName);
    this.aircoSamsung = new Service.HeaterCooler(this.name);
    
        
    this.aircoSamsung.getCharacteristic(Characteristic.Active).on('get',this.getActive.bind(this)).on('set', this.setActive.bind(this)); //On  or Off
        
        this.aircoSamsung.getCharacteristic(Characteristic.CurrentTemperature)
        .setProps({
                  minValue: 0,
                  maxValue: 100,
                  minStep: 0.01
                  })
        .on('get', this.getCurrentTemperature.bind(this));

        this.aircoSamsung.getCharacteristic(Characteristic.TargetHeaterCoolerState).on('get',this.getModalita.bind(this)).on('set', this.setModalita.bind(this));
        
        this.aircoSamsung.getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .on('get', this.getCurrentHeaterCoolerState.bind(this));
        
        this.aircoSamsung.getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .setProps({
                  minValue: 16,
                  maxValue: 30,
                  minStep: 1
                  })
        .on('get', this.getHeatingUpOrDwTemperature.bind(this))
        .on('set', this.setHeatingUpOrDwTemperature.bind(this));

        
        var informationService = new Service.AccessoryInformation();
      

    return [informationService, this.aircoSamsung];
    
},
    
    //services
    
    
getHeatingUpOrDwTemperature: function(callback) {
    var body;
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Temperatures[0].desired\'';
    
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     //this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     //this.log('Power function OK');
                     //this.response=stdout;
                     this.log("TEMPERTURA DESIDERTA");
                     body=parseInt(stdout);
                     this.log(stdout);
                     this.log(body);

                     callback(null, body);
                     //callback();
                     }
                     }.bind(this))
    
    //callback(null, null);
},
    
setHeatingUpOrDwTemperature: function(temp, callback) {
    var body;
    
    str = 'curl -X PUT -d \'{"desired": '+temp+'}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/temperatures/0';
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     //this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     //this.log('Power function OK');
                     this.log(stdout);
                     callback(null, temp);
                     //callback();
                     }
                     }.bind(this))
    
    
},
    
getCurrentHeaterCoolerState: function (callback) {
    var body;
    
    str= 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Mode.modes[0]\'';
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     //this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     //this.log('Power function OK');
                     //this.log(stdout);
                     this.response=stdout;
                     this.response= this.response.substr(1,this.response.length-3);
                     //this.log(this.response);
                     if (this.response == "Cool") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.COOLING);
                     } else if (this.response == "Heat") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.HEATING);
                     } else if (this.response == "Fan") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.INACTIVE);
                     } else if (this.response == "Auto") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.IDLE);
                     }else
                     this.log(this.response+ "azz");
                     //callback();
                     }
                     }.bind(this))
},
    
getCurrentTemperature: function(callback) {
    var body;
    
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Temperatures[0].current\'';
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     this.log('Power function OK');
                     //callback();
                     this.log(stdout);
                     body=parseInt(stdout);
                     this.log("Temperatura corrente: "+body);
                     this.aircoSamsung.getCharacteristic(Characteristic.CurrentTemperature).updateValue(body);
                     }
                     callback(null, body); //Mettere qui ritorno di stdout? o solo callback()
                     }.bind(this));
 
},
    
    
getActive: function(callback) {
    var body;
    var OFForON;
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Operation.power\'';
    
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     this.log('Power function OK');
                     this.log(stdout);
                     this.response=stdout;
                     this.response= this.response.substr(1,this.response.length-3);
                     this.log(this.response);
                     //callback();
                     
                     }
                     if (this.response == "Off") {
                     callback(null, Characteristic.Active.INACTIVE);
                     } else if (this.response == "On") {
                     this.log("Acceso");
                     callback(null, Characteristic.Active.ACTIVE);
                     } else {
                     this.log(this.response+ "NON LO SO");
                     }
                     }.bind(this));
    
},
    
setActive: function(state, callback) {
    var body;
    var token, ip, patchCert;
    token=this.token;
    ip=this.ip;
    patchCert=this.patchCert;
    
    this.log("COSA E");
    this.log(state);
    this.log(ip);
    var activeFuncion = function(state) {
        if (state==Characteristic.Active.ACTIVE) {
            str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+token+'" --cert '+patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"On"\}}\' https://'+ip+':8888/devices/0';
            console.log("ATTIVO");
        } else {
            console.log("INATTIVO");
            str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+token+'" --cert '+patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"Off"\}}\' https://'+ip+':8888/devices/0';
        }
    }
    activeFuncion(state);
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     //callback(error);
                     } else {
                     this.log('Power function OK');
                     //callback();
                     this.log(stdout);
                     }
                     }.bind(this));
    callback();
},
    
setPowerState: function(powerOn, callback) {
    var body;
    var str;
    this.log("Il clima per ora è ");
    
    if (powerOn) {
        body=this.setOn
        this.log("Acceso");
        str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"On"\}}\' https://'+this.ip+':8888/devices/0';
        //powerOn=false;
        
    } else {
        body=this.setOff;
        this.log("Spengo");
        str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"Off"\}}\' https://'+this.ip+':8888/devices/0';
        //powerOn=true;
    }
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     this.log('Power function OK');
                     callback();
                     this.log(stdout);
                     }
                     }.bind(this));
},
    
getModalita: function(callback) {
    var str;
    //var response;
    var body;
    this.log("Mettere modalita");
    //str =  'curl -X PUT -d \'{"speedLevel": 1}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer 0HiRz37Baa" --cert /Users/francescobosco/Desktop/ac14k_m.pem --insecure https://192.168.1.201:8888/devices/0/wind';
   // if (data.setting.power=="OFF") {
    //    callback(null, null);
 //   }
    str= 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Mode.modes[0]\'';
    this.log(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                              if(error) {
                              this.log('Power function failed', stderr);
                              callback(error);
                              } else {
                              this.log('Power function OK');
                                     this.log(stdout);
                                     this.response=stdout;
                     this.response= this.response.substr(1,this.response.length-3);
                     this.log(this.response);
                                    callback();
                              }
                     
                     if (this.response == "Cool") {
                     Characteristic.TargetHeaterCoolerState.COOL;
                     } else if (this.response == "Heat") {
                     this.log("AZZZ");
                     Characteristic.TargetHeaterCoolerState.HEAT;
                     } else if (this.response == "FAN") {
                     callback(null, null);
                     } else if (this.response == "AUTO") {
                     Characteristic.TargetHeaterCoolerState.AUTO;
                     }else {
                     this.log(this.response+ "azz");
                     }
                     
                              }.bind(this));
    
},
setModalita: function(state, callback) {
    
    switch (state){
        case Characteristic.TargetHeaterCoolerState.COOL:
            var body;
           // if (accessory.coolMode){
                this.log("Setting  AC to COOL")
                 str =  'curl -X PUT -d \'{"modes": ["Cool"]}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/mode';
                 this.log(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('Power function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('Power function OK');
                                 callback();
                                 this.log(stdout);
                                 }
                                 }.bind(this));
                //return accessory.lastMode.cool
                
            //} //else return null
                break;
        case Characteristic.TargetHeaterCoolerState.HEAT:
            var body;
            //if (accessory.heatMode){
                this.log("Setting  AC to HEAT")
                str =  'curl -X PUT -d \'{"modes": ["Heat"]}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/mode';
                this.log(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('Power function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('Power function OK');
                                 callback();
                                 this.log(stdout);
                                 }
                                 }.bind(this));
               // return accessory.lastMode.heat
            //} else return null
                break;
        case Characteristic.TargetHeaterCoolerState.AUTO:
    var body;
           // if (accessory.autoMode){
                this.log("Setting  AC to AUTO")
                str =  'curl -X PUT -d \'{"modes": ["Auto"]}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/mode';
                this.log(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('Power function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('Power function OK');
                                 callback();
                                 this.log(stdout);
                                 }
                                 }.bind(this));
                //return accessory.lastMode.auto
            //} //else return null
                break;
    }
    
}    
};

