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
       //.RotationSpeed in my case Quite mode
   this.aircoSamsung.getCharacteristic(Characteristic.SwingMode).on('get', this.getRotationSpeed.bind(this)).on('set', this.setRotationSpeed.bind(this));
var informationService = new Service.AccessoryInformation();
return [informationService, this.aircoSamsung];
},
    //services
 getRotationSpeed: function (callback) {
                         var body2;
                         str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Mode.options[0]\'';
                         this.log.debug(str);
                     this.execRequest(str, body2, function(error, stdout, stderr) {
                                          if(error) {
                                          //this.log('Power function failed', stderr);
                                          callback(error);
                                          } else {
                                          this.response=stdout;
                                          this.response= this.response.substr(1,this.response.length-3);

                                          this.log("VelocitÃ  Ventola ");
                                         // body2=stdout;
                                          this.log(stdout);
                                          if (this.response == "Comode_Quiet") {
                                          body2=1;
                                           this.log('Quiet acceso');
                                          this.log(this.response);

                                          }
                                          else if (this.response== "Comode_Off") {
                                          body2=0;
                                          this.log('Quiet Spento');
                                          this.log(this.response);
                                          }
                                          else {
                                          body2=0;
                                          this.log('Quiet non so');
                                          this.log(this.response);

                                          }
                                          this.log('SONO ADESSO QUI');
                                          this.log(body2);
                                          callback(null, body2);
                                          }
                                          }.bind(this))
    },
    setRotationSpeed: function (wind, callback) {
    //    switch (wind){
            

   // case false:
        if(wind==0) {
                
                
                var body;
                               this.log("Setting  AC to Normal")
                               str =  'curl -X PUT -d \'{"options": ["Comode_Off"]}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/mode';
                               this.log(str);
                               this.execRequest(str, body, function(error, stdout, stderr) {
                                                if(error) {
                                                this.log('Power function failed', stderr);
                                                callback(error);
                                                } else {
                                                this.log('OK setting AC to Normal . Off Quite');
                                                this.log(stdout);
                                                body=0;
                                                }
                                                }.bind(this));
                               callback(null, body);
                         //      break;
        }
        else if (wind==1){
                
         //   case true:
                
                var body;
                this.log("Setting  AC to QUIET")
                str =  'curl -X PUT -d \'{"options": ["Comode_Quiet"]}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/mode';
                this.log(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('Power function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('OK setting AC to Queit');
                                 this.log(stdout);
                                 body=1;
                                 }
                                 }.bind(this));
                callback(null, body);
               // break;
                
        }
        else {
            
            System.log('Setting mode Unknow --> Setting to OFF QUITE');
            callback(null, 0);
                
        }
               

        },
        
    //},
   

    
getHeatingUpOrDwTemperature: function(callback) {
    var body;
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Temperatures[0].desired\'';
    
    this.log.debug(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     //this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     //this.log('Power function OK');
                     //this.response=stdout;
                     this.log("TEMPERTURA DESIDERTA in getUPorDOWN");
                     body = stdout << 0;
                    // body=parseInt(stdout)
                     
                   //  body=parseInt(stdout) || 0; se quealocsa va storto mettere solo body=parseInt(stdout) che restituirÃ  Nan
                     if(body==0) {
                     this.log(' Impossibile stabilire la temperatura corrente, ritorna 0 gradi. Ã¨ vero 0 gradi? Prova a chiudere e riaprire homekit o riavviare homebridge RITORNA 16');
                     callback(null,16);
                     }
                     this.log.debug(stdout);
                     this.log(body);
                     this.log('QUIIIII');

                     callback(null, body);
                     //callback();
                     }
                     }.bind(this))
    
    //callback(null, null);
},
    
setHeatingUpOrDwTemperature: function(temp, callback) {
    var body;
    
    str = 'curl -X PUT -d \'{"desired": '+temp+'}\' -v -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure https://'+this.ip+':8888/devices/0/temperatures/0';
    this.log.debug(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     //this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     //this.log('Power function OK');
                     this.log.debug(stdout);
                     callback(null, temp);
                     //callback();
                     }
                     }.bind(this))
    
    
},
    
getCurrentHeaterCoolerState: function (callback) {
    var body;
    
    str= 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Mode.modes[0]\'';
    this.log.debug(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('getCurrentSTATE function failed', stderr);
                     callback(error);
                     } else {
                     this.log('getCurrentSTATE function OK');
                     this.log.debug(stdout);
                     this.response=stdout;
                     this.response= this.response.substr(1,this.response.length-3);
                     //this.log(this.response);
                     if (this.response == "Cool") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.COOLING);
                     } else if (this.response == "Heat") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.HEATING);
                     } else if (this.response == "Fan") {
                         this.log('Clima state FAN but become AUTO');
                     callback(null, Characteristic.CurrentHeaterCoolerState.AUTO);                      
                     } else if (this.response == "Auto") {
                     callback(null, Characteristic.CurrentHeaterCoolerState.AUTO);                        
                     }else { //questa non c era
                     this.log(this.response);
                     this.log(' Undefined Current STATE of CLIMA, maybe DRY? set to AUTO');
                        //callback(null, Characteristic.Active.INACTIVE); //questa prima non era attiva e funzionava. riproveremo cosi
                     callback(null,Characteristic.CurrentHeaterCoolerState.AUTO); //questa non c era
                     } //questa non c era
                     }
                     }.bind(this))
},
    
getCurrentTemperature: function(callback) {
    var body;
    
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Temperatures[0].current\'';
    this.log.debug(str);
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('getCurrentTemperature function failed', stderr);
                     callback(error);
                     } else {
                     this.log('getCurrentTemperature function OK');
                     //callback();
                     this.log(stdout);
                     
                     body = stdout << 0;
                     
                    // body=parseInt(stdout) || 0;
                     this.log("Temperatura corrente: "+body);
this.aircoSamsung.getCharacteristic(Characteristic.CurrentTemperature).updateValue(body);
                     if(body==0) {
                     this.log(' Impossibile stabilire la temperatura corrente, ritorna 0 gradi Ã¨ veramente 0 gradi?. Prova a chiudere e riaprire homekit o riavviare homebridge RITORNA 16');
                     callback(null,body);
                     }
                     }
                     callback(null, body); //Mettere qui ritorno di stdout? o solo callback()
                     }.bind(this));
 
},
    
    
getActive: function(callback) {
    var body;
    var OFForON;
    str = 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Operation.power\'';
    this.log.debug(str);
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     this.log('Power function OK');
                     this.log.debug(stdout);
                     this.response=stdout;
                     this.response= this.response.substr(1,this.response.length-3);
                     this.log(this.response);
                     }
                     if (this.response == "Off") {
                         this.log("Clima in getModalita is OFF");
                     callback(null, Characteristic.Active.INACTIVE);
                     } else if (this.response == "On") {
                     this.log("Clima in getModalita IS ON");
                     callback(null, Characteristic.Active.ACTIVE);
                     } else {
                     this.log(this.response+ " Unknow if Clima is ON or OFF");
                        callback(null, Characteristic.Active.INACTIVE); //prima era ACTIVE
                     }
                     }.bind(this));
    
},
    
setActive: function(state, callback) {
    var body;
    var token, ip, patchCert;
    token=this.token;
    ip=this.ip;
    patchCert=this.patchCert;   
    this.log.debug("COSA E SETACTIVE");
    this.log.debug(state); //lo stato del clima. 1 forse Ã¨ heat
    this.log.debug(ip);
    var activeFuncion = function(state) {
        if (state==Characteristic.Active.ACTIVE) {
            str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+token+'" --cert '+patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"On"\}}\' https://'+ip+':8888/devices/0';
            console.log("The Clima is ATTIVO in setModalita");
        } else {
            console.log("The Clima is INATTIVO or UNKNOW in setModalita");
            str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+token+'" --cert '+patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"Off"\}}\' https://'+ip+':8888/devices/0';
        }
    }
activeFuncion(state);
    this.log.debug(str);
    
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('Power function failed', stderr);
                     callback(error);
                     } else {
                     this.log('Power function OK HERE');
                     callback();
                     this.log.debug(stdout);
                     }
                     }.bind(this));
    //activeFuncion(state);
    
    //callback();
},
    
setPowerState: function(powerOn, callback) {
    var body;
    var str;
    this.log("Il clima per ora Ã¨ ");   
    if (powerOn) {
        body=this.setOn
        this.log("Accendo ");
        str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"On"\}}\' https://'+this.ip+':8888/devices/0';
        
    } else {
        body=this.setOff;
        this.log("Spengo ");
        str = 'curl -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X PUT -d \'{"Operation" : {\"power"\ : \"Off"\}}\' https://'+this.ip+':8888/devices/0';
    }
    this.log.debug(str);
    this.execRequest(str, body, function(error, stdout, stderr) {
                     if(error) {
                     this.log('SETPowerSTATE function failed', stderr);
                     callback(error);
                     } else {
                     this.log('SETPowerSTATE function OK');
                     callback();
                     this.log.debug(stdout);
                     }
                     }.bind(this));
},
    
getModalita: function(callback) {
    var str;
    var body;
    this.log.debug("Mettere modalita ");
    str= 'curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer '+this.token+'" --cert '+this.patchCert+' --insecure -X GET https://'+this.ip+':8888/devices|jq \'.Devices[0].Mode.modes[0]\'';
    this.log.debug(str);
    this.execRequest(str, body, function(error, stdout, stderr) {
                              if(error) {
                              this.log('getModalita function failed', stderr);
                              callback(error);
                              } else {
                              this.log('getModalita function OK ');
                                     this.log.debug(stdout);
                                     this.response=stdout;
                     this.response = this.response.substr(1,this.response.length-3);
                     this.log(this.response);
                              
                     if (this.response == "Cool") {
                         this.log("Cool ");
                     callback(null, Characteristic.TargetHeaterCoolerState.COOL);
                     } else if (this.response == "Heat") {
                     this.log("Heat ");
                     callback(null, Characteristic.TargetHeaterCoolerState.HEAT);
                     } else if (this.response == "FAN") {
                         this.log("Fan ");
                     callback(null, Characteristic.TargetHeaterCoolerState.AUTO);
                     } else if (this.response == "Auto") { //Prima Auto era scritto tutto maiuscolo
                         this.log("Auto ");
                     callback(null, Characteristic.TargetHeaterCoolerState.AUTO);
                     }else {
                     this.log(this.response+ " <-- Unknow modalita, return AUTO - ERROR");
                        callback(null, Characteristic.TargetHeaterCoolerState.AUTO);
                     }
                    // callback();
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
                 this.log.debug(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('SetModalita COOL function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('SetModalita Cool function OK');
                                 callback();
                                 this.log.debug(stdout);
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
                this.log.debug(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('setModalita HEAT function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('setModalita Heat function OK');
                                 callback();
                                 this.log.debug(stdout);
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
                this.log.debug(str);
                this.execRequest(str, body, function(error, stdout, stderr) {
                                 if(error) {
                                 this.log('setModalita AUTO function failed', stderr);
                                 callback(error);
                                 } else {
                                 this.log('SetModalita Auto function OK');
                                 callback();
                                 this.log.debug(stdout);
                                 }
                                 }.bind(this));
                //return accessory.lastMode.auto
            //} //else return null
                break;
    }
    
}    
};
