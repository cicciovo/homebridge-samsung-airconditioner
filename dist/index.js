'use strict';

var child_process = require('child_process');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function callbackify(func, log) {
  return function () {
    var onlyArgs = [];
    var maybeCallback = null;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    for (var _i = 0, _args = args; _i < _args.length; _i++) {
      var arg = _args[_i];

      if (typeof arg === 'function') {
        maybeCallback = arg;
      } else {
        onlyArgs.push(arg);
      }
    }

    if (!maybeCallback) {
      if (!!log) {
        log('Missing callback parameter');
      }

      throw new Error("Missing callback parameter!");
    }

    if (!!log) {
      log('callback with args: ' + JSON.stringify(onlyArgs) + '; func type: ' + func);
    }

    var callback = maybeCallback;
    func.apply(void 0, onlyArgs).then(function (data) {
      if (!!log) {
        log('callback resolve: ' + JSON.stringify(data));
      }

      callback(null, data);
    }).catch(function (err) {
      callback(err);
    });
  };
}

var getIntFromUnderscoredString = function getIntFromUnderscoredString(str) {
  if (!str) {
    return NaN;
  }

  return parseInt(str.split('_').pop() || '');
};
var getVal = function getVal(obj, dottedKey) {
  if (!dottedKey) {
    return obj;
  }

  var splits = dottedKey.split('.');
  var output = obj;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = splits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!!key) {
        if (!!output && typeof output === 'object') {
          if (key.endsWith(']') && /^[^.\s\[\]]+\[[0-9]+\]$/.test(key)) {
            var arr_splits = key.split('[');
            output = output[arr_splits[0]];
            var idx = parseInt(arr_splits[1]);

            if (idx >= 0 && !!output && typeof output === 'object') {
              output = output[idx];
            } else {
              return undefined;
            }
          } else {
            output = output[key];
          }
        } else {
          return undefined;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return output;
};

require('@babel/polyfill');
var Service;
var Characteristic;
var Accessory;
var Response;

var SamsungAircon =
/*#__PURE__*/
function () {
  function SamsungAircon(log, config) {
    var _this = this;

    _classCallCheck(this, SamsungAircon);

    _defineProperty(this, "aircon", void 0);

    _defineProperty(this, "airconFilter", void 0);

    _defineProperty(this, "infoService", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "ip", void 0);

    _defineProperty(this, "token", void 0);

    _defineProperty(this, "userAllowedMode", void 0);

    _defineProperty(this, "patchCert", void 0);

    _defineProperty(this, "accessoryName", void 0);

    _defineProperty(this, "response", void 0);

    _defineProperty(this, "curlGetPartials", void 0);

    _defineProperty(this, "curSetPartials", void 0);

    _defineProperty(this, "genCurlGetStr", function (dottedKey) {
      var last_str = !!dottedKey ? ` \'.Devices[0].${dottedKey}\'` : ` \'.Devices[0]\'`;
      var str = _this.curlGetPartials.join(' ') + last_str;
      return str;
    });

    _defineProperty(this, "genCurlSetStr", function (request, append) {
      var post_str = !!append ? append.startsWith('/') ? append.substring(1, append.length) : append : '';

      var str = _this.curSetPartials(request, post_str).join(' ');

      return str;
    });

    _defineProperty(this, "execRequest", function (curlCommandString) {
      _this.log('execRequest: ' + curlCommandString);

      return new Promise(function (resolve, reject) {
        child_process.exec(curlCommandString, function (error, stdout, stderr) {
          if (!error) {
            resolve(_this.parseCurlResponse(stdout));
          } else {
            reject(stderr);
          }
        });
      });
    });

    _defineProperty(this, "execGetRequest",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dottedKey) {
        var timestamp, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                timestamp = new Date().getTime();

                if (!(!!Response && !(Response instanceof Promise))) {
                  _context.next = 7;
                  break;
                }

                if (!(timestamp - Response.timestamp <= 3000)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", getVal(Response.response, dottedKey));

              case 6:
                Response = null;

              case 7:
                if (!Response) {
                  // Do not await here
                  Response = _this.execRequest(_this.genCurlGetStr() // full response
                  );
                } // By now, Response should be a Promise


                if (!(Response instanceof Promise)) {
                  _context.next = 21;
                  break;
                }

                _context.prev = 9;
                _context.next = 12;
                return Response;

              case 12:
                response = _context.sent;
                Response = {
                  response,
                  timestamp
                };
                return _context.abrupt("return", getVal(response, dottedKey));

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](9);
                Response = null;
                throw _context.t0;

              case 21:
                return _context.abrupt("return", undefined);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 17]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "execPostRequest", function (curlCommandString) {
      if (!!Response && !(Response instanceof Promise)) {
        Response = null;
      }

      return _this.execRequest(curlCommandString);
    });

    _defineProperty(this, "getServices", function () {
      /**
       * Generic
       * - Active √
       * - Name
       * - LockPhysicalControls
       * 
       * As 'HeaterCooler':
       * - CurrentTemperature √		required
       * - CurrentHeaterCoolerState √	required
       * - TargetHeaterCoolerState √	required
       * - CoolingThreshold √
       * - HeatingThreshold √
       * - SwingMode √
       * - TemperatureDisplayUnits
       * - RotationSpeed √
       * 
       * As 'Thermostat':
       * - CurrentTemperature			required
       * - TargetTemperature			required
       * - CurrentHeatingCoolingState	required
       * - TargetHeatingCoolingState	required
       * - TemperatureDisplayUnits	required
       * - CurrentRelativeHumidity
       * - TargetRelativeHumidity
       * - CoolingThresholdTemperature
       * - HeatingThresholdTemperature
       * 
       * As 'Fan':
       * - CurrentFanState
       * - TargetFanState
       * - RotationDirection
       * - RotaltionSpeed
       * - SwingMode
       * 
       * 
       * As 'FilterMaintenance':
       * - FilterChangeIndication	√	required
       * - FilterLifeLevel √
       * - ResetFilterIndication
       */
      return [_this.infoService, _this.aircon, _this.airconFilter];
    });

    _defineProperty(this, "getActive",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var curlResponse, char;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.execGetRequest('Operation.power');

            case 2:
              curlResponse = _context2.sent;

              if (!(typeof curlResponse === 'string')) {
                _context2.next = 10;
                break;
              }

              // just to safe-guard response
              char = Characteristic.Active;
              _context2.t0 = curlResponse;
              _context2.next = _context2.t0 === 'On' ? 8 : _context2.t0 === 'Off' ? 9 : 10;
              break;

            case 8:
              return _context2.abrupt("return", char.ACTIVE);

            case 9:
              return _context2.abrupt("return", char.INACTIVE);

            case 10:
              _this.log('Samsung Aircon: invalid power'); // Other cases: throw as Error


              throw 'invalid-power';

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));

    _defineProperty(this, "setActive",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(state) {
        var curlStr;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                curlStr = _this.genCurlSetStr({
                  Operation: {
                    power: state === Characteristic.Active.ACTIVE ? 'On' : 'Off'
                  }
                });
                _context3.next = 3;
                return _this.execPostRequest(curlStr);

              case 3:
                return _context3.abrupt("return", null);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getCurrentTemperature",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var curlResponse, cur_temp;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this.execGetRequest('Temperatures[0].current');

            case 2:
              curlResponse = _context4.sent;

              if (!(!!curlResponse && typeof curlResponse === 'number')) {
                _context4.next = 8;
                break;
              }

              cur_temp = Math.round(curlResponse * 10) / 10;
              /*this.aircon
              .getCharacteristic(Characteristic.CurrentTemperature)
              .updateValue(cur_temp)*/

              return _context4.abrupt("return", cur_temp);

            case 8:
              _this.log('Samsung Aircon: invalid current temperature');

              throw 'invalid-current-temperature';

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));

    _defineProperty(this, "getMode",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var curlResponse, char;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _this.execGetRequest('Mode.modes[0]');

            case 2:
              curlResponse = _context5.sent;
              char = Characteristic.TargetHeaterCoolerState;
              _context5.t0 = curlResponse;
              _context5.next = _context5.t0 === 'Auto' ? 7 : _context5.t0 === 'Cool' ? 8 : _context5.t0 === 'Heat' ? 9 : _context5.t0 === 'Dry' ? 10 : _context5.t0 === 'Wind' ? 11 : 12;
              break;

            case 7:
              return _context5.abrupt("return", char.AUTO);

            case 8:
              return _context5.abrupt("return", char.COOL);

            case 9:
              return _context5.abrupt("return", char.HEAT);

            case 10:
              return _context5.abrupt("return", char.AUTO);

            case 11:
              return _context5.abrupt("return", char.AUTO);

            case 12:
              _this.log('Samsung Aircon: invalid mode');

              throw 'invalid-mode';

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));

    _defineProperty(this, "setMode",
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(state) {
        var char, curlStr;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                char = Characteristic.TargetHeaterCoolerState;
                curlStr = _this.genCurlSetStr({
                  modes: [function () {
                    switch (state) {
                      case char.AUTO:
                        return 'Auto';

                      case char.COOL:
                        return 'Cool';

                      case char.HEAT:
                        return 'Heat';

                      default:
                        return 'Auto';
                    }
                  }()]
                }, 'mode');
                _context6.next = 4;
                return _this.execPostRequest(curlStr);

              case 4:
                return _context6.abrupt("return", null);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x3) {
        return _ref6.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getSwingMode",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var curlResponse, char;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _this.execGetRequest('Wind.direction');

            case 2:
              curlResponse = _context7.sent;
              char = Characteristic.SwingMode;
              _context7.t0 = curlResponse;
              _context7.next = _context7.t0 === 'Fix' ? 7 : _context7.t0 === 'Up_And_Low' ? 8 : 9;
              break;

            case 7:
              return _context7.abrupt("return", char.SWING_DISABLED);

            case 8:
              return _context7.abrupt("return", char.SWING_ENABLED);

            case 9:
              _this.log('Samsung Aircon: invalid swing mode');

              throw 'invalid-swing-mode';

            case 11:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));

    _defineProperty(this, "setSwingMode",
    /*#__PURE__*/
    function () {
      var _ref8 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(state) {
        var char, cur_wind_status, curlStr;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                char = Characteristic.SwingMode;
                _context8.next = 3;
                return _this.execGetRequest('Wind');

              case 3:
                cur_wind_status = _context8.sent;
                curlStr = _this.genCurlSetStr(Object.assign(cur_wind_status || {}, {
                  direction: function () {
                    switch (state) {
                      case char.SWING_DISABLED:
                        return 'Fix';

                      case char.SWING_ENABLED:
                        return 'Up_And_Low';

                      default:
                        return 'Up_And_Low';
                    }
                  }()
                }), 'wind');
                _context8.next = 7;
                return _this.execPostRequest(curlStr);

              case 7:
                return _context8.abrupt("return", null);

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      return function (_x4) {
        return _ref8.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getRotationSpeed",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var curlResponse;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _this.execGetRequest('Wind.speedLevel');

            case 2:
              curlResponse = _context9.sent;
              return _context9.abrupt("return", curlResponse || 0);

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));

    _defineProperty(this, "setRotationSpeed",
    /*#__PURE__*/
    function () {
      var _ref10 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(state) {
        var cur_wind_status, _ref11, _ref11$maxSpeedLevel, maxSpeedLevel, curlStr;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return _this.execGetRequest('Wind');

              case 2:
                cur_wind_status = _context10.sent;
                _ref11 = cur_wind_status || {}, _ref11$maxSpeedLevel = _ref11.maxSpeedLevel, maxSpeedLevel = _ref11$maxSpeedLevel === void 0 ? 4 : _ref11$maxSpeedLevel;
                curlStr = _this.genCurlSetStr(Object.assign(cur_wind_status, {
                  speedLevel: function () {
                    if (state < 1) {
                      return 1;
                    }

                    if (maxSpeedLevel > 0 && state > maxSpeedLevel) {
                      return maxSpeedLevel;
                    }

                    return state;
                  }()
                }), 'wind');
                _context10.next = 7;
                return _this.execPostRequest(curlStr);

              case 7:
                return _context10.abrupt("return", null);

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      return function (_x5) {
        return _ref10.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getTargetTemperature",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var curlResponse;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return _this.execGetRequest('Temperatures[0].desired');

            case 2:
              curlResponse = _context11.sent;

              if (!(!!curlResponse && typeof curlResponse === 'number')) {
                _context11.next = 7;
                break;
              }

              return _context11.abrupt("return", Math.round(curlResponse));

            case 7:
              _this.log('Samsung Aircon: invalid target temperature');

              throw 'invalid-target-temperature';

            case 9:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));

    _defineProperty(this, "setTargetTemperature",
    /*#__PURE__*/
    function () {
      var _ref13 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(state) {
        var curlStr;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                curlStr = _this.genCurlSetStr({
                  desired: state
                }, 'temperatures/0');
                _context12.next = 3;
                return _this.execPostRequest(curlStr);

              case 3:
                return _context12.abrupt("return", null);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      return function (_x6) {
        return _ref13.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getCurrentHeaterCoolerState",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var curlResponse, char;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return _this.execGetRequest('Mode.modes[0]');

            case 2:
              curlResponse = _context13.sent;
              char = Characteristic.CurrentHeaterCoolerState;
              _context13.t0 = curlResponse;
              _context13.next = _context13.t0 === 'Auto' ? 7 : _context13.t0 === 'Cool' ? 8 : _context13.t0 === 'Heat' ? 9 : _context13.t0 === 'Dry' ? 10 : _context13.t0 === 'Wind' ? 11 : 12;
              break;

            case 7:
              return _context13.abrupt("return", char.IDLE);

            case 8:
              return _context13.abrupt("return", char.COOLING);

            case 9:
              return _context13.abrupt("return", char.HEATING);

            case 10:
              return _context13.abrupt("return", char.INACTIVE);

            case 11:
              return _context13.abrupt("return", char.INACTIVE);

            case 12:
              _this.log('Samsung Aircon: invalid current heating cooling state');

              throw 'invalid-current-heating-cooling-state';

            case 14:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));

    _defineProperty(this, "getFilterStatus",
    /*#__PURE__*/
    // Promise all in number
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var curlResponse, FilterTimeStr, FilterAlarmTimeStr, filterTime, filterAlarmTime;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return _this.execGetRequest('Mode.options');

            case 2:
              _context14.t0 = _context14.sent;

              if (_context14.t0) {
                _context14.next = 5;
                break;
              }

              _context14.t0 = [];

            case 5:
              curlResponse = _context14.t0;
              // There is a FilterCleanAlarm_0, but seems not for this purpose...
              // find 'FilterTime_x' etc.
              FilterTimeStr = curlResponse.find(function (opt) {
                return opt.startsWith('FilterTime_');
              });
              FilterAlarmTimeStr = curlResponse.find(function (opt) {
                return opt.startsWith('FilterAlarmTime_');
              });
              filterTime = getIntFromUnderscoredString(FilterTimeStr); // value / 10 is hour

              filterAlarmTime = getIntFromUnderscoredString(FilterAlarmTimeStr); // This is in hour

              return _context14.abrupt("return", {
                filterTime: (filterTime || 0) / 10 || 0,
                filterAlarmTime: filterAlarmTime || 0
              });

            case 11:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));

    _defineProperty(this, "getFilterChangeIndication",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var _ref17, filterTime, filterAlarmTime, alarm, char;

      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return _this.getFilterStatus();

            case 2:
              _ref17 = _context15.sent;
              filterTime = _ref17.filterTime;
              filterAlarmTime = _ref17.filterAlarmTime;
              alarm = filterAlarmTime > 0 && filterTime >= filterAlarmTime;
              char = Characteristic.FilterChangeIndication;
              return _context15.abrupt("return", alarm ? char.CHANGE_FILTER : char.FILTER_OK);

            case 8:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));

    _defineProperty(this, "getFilterLifeLevel",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var _ref19, filterTime, filterAlarmTime, leftover_percent;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return _this.getFilterStatus();

            case 2:
              _ref19 = _context16.sent;
              filterTime = _ref19.filterTime;
              filterAlarmTime = _ref19.filterAlarmTime;

              if (!(!filterAlarmTime || !(filterTime >= 0))) {
                _context16.next = 7;
                break;
              }

              throw 'invalid-filter-time';

            case 7:
              leftover_percent = (filterAlarmTime - filterTime) / filterAlarmTime * 100;
              return _context16.abrupt("return", leftover_percent >= 0 ? leftover_percent : 0);

            case 9:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));

    var name = config.name,
        ip = config.ip,
        token = config.token,
        patchCert = config.patchCert,
        _config$userAllowedMo = config.userAllowedMode,
        userAllowedMode = _config$userAllowedMo === void 0 ? 'both' : _config$userAllowedMo;
    this.log = log;
    this.name = name;
    this.ip = ip;
    this.token = token;
    this.patchCert = patchCert;
    this.accessoryName = name;
    this.userAllowedMode = ['heat', 'cool', 'both'].includes(userAllowedMode.toLowerCase()) ? userAllowedMode.toLowerCase() : 'both';
    this.response = '';
    this.curlGetPartials = ['curl -s -k', '-H "Content-Type: application/json"', `-H "Authorization: Bearer ${token}"`, `--cert ${patchCert}`, `--insecure -X GET`, `https://${ip}:8888/devices|jq`];

    this.curSetPartials = function (request, append) {
      return ['curl -k', '-H "Content-Type: application/json"', `-H "Authorization: Bearer ${token}"`, `--cert ${patchCert}`, '--insecure -X PUT -d', `\'${JSON.stringify(request)}\'`, !!append ? `https://${ip}:8888/devices/0/` + append : `https://${ip}:8888/devices/0`];
    };

    log('Constructor Samsung Aircon...'); // @ts-ignore

    this.aircon = new Service.HeaterCooler(this.name); // @ts-ignore

    this.airconFilter = new Service.FilterMaintenance(this.name + ' Filter'); // @ts-ignore

    this.infoService = new Service.AccessoryInformation(); // On or Off

    this.aircon.getCharacteristic(Characteristic.Active).on('get', callbackify(this.getActive)).on('set', callbackify(this.setActive));
    this.aircon.getCharacteristic(Characteristic.CurrentTemperature).setProps({
      minValue: -100,
      maxValue: 100,
      minStep: 0.01
    }).on('get', callbackify(this.getCurrentTemperature));

    var targetHeaterCoolerStateProp = function () {
      var char = Characteristic.TargetHeaterCoolerState;
      var HEAT = char.HEAT,
          COOL = char.COOL,
          AUTO = char.AUTO;

      if (_this.userAllowedMode === 'cool') {
        return {
          validValues: [AUTO, COOL]
        };
      }

      if (_this.userAllowedMode === 'heat') {
        return {
          validValues: [AUTO, HEAT]
        };
      }

      return {
        validValues: [AUTO, HEAT, COOL]
      };
    }();

    this.aircon.getCharacteristic(Characteristic.TargetHeaterCoolerState).setProps(targetHeaterCoolerStateProp).on('get', callbackify(this.getMode)).on('set', callbackify(this.setMode));
    this.aircon.getCharacteristic(Characteristic.CurrentHeaterCoolerState).on('get', callbackify(this.getCurrentHeaterCoolerState));

    if (this.userAllowedMode !== 'cool') {
      this.aircon.getCharacteristic(Characteristic.HeatingThresholdTemperature).setProps({
        minValue: -10,
        maxValue: 20,
        minStep: 1
      }).on('get', callbackify(this.getTargetTemperature)).on('set', callbackify(this.setTargetTemperature));
    }

    if (this.userAllowedMode !== 'heat') {
      this.aircon.getCharacteristic(Characteristic.CoolingThresholdTemperature).setProps({
        minValue: 16,
        maxValue: 30,
        minStep: 1
      }).on('get', callbackify(this.getTargetTemperature)).on('set', callbackify(this.setTargetTemperature));
    }

    this.aircon.getCharacteristic(Characteristic.RotationSpeed) // @ts-ignore
    .setProps({
      format: Characteristic.Formats.INT,
      unit: undefined,
      minValue: 1,
      maxValue: 4,
      minStep: 1
    }).on('get', callbackify(this.getRotationSpeed)).on('set', callbackify(this.setRotationSpeed));
    this.aircon.getCharacteristic(Characteristic.SwingMode).on('get', callbackify(this.getSwingMode)).on('set', callbackify(this.setSwingMode));
    this.airconFilter.getCharacteristic(Characteristic.FilterChangeIndication).on('get', callbackify(this.getFilterChangeIndication));
    this.airconFilter.getCharacteristic(Characteristic.FilterLifeLevel).setProps({
      unit: Characteristic.Units.PERCENTAGE,
      minValue: 0,
      maxValue: 100,
      minStep: 0.1
    }).on('get', callbackify(this.getFilterLifeLevel));
    this.infoService.setCharacteristic(Characteristic.Manufacturer, 'Samsung').setCharacteristic(Characteristic.Model, "Smart Air Conditioner").setCharacteristic(Characteristic.SerialNumber, "-");
  } // e.g. curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer TOKENXXXXX" --cert /usr/share/ca-certificates/local/ac14k_m.pem --insecure -X GET https://192.168.1.xxx:8888/devices|jq '.Devices[0].Temperatures[0].current


  _createClass(SamsungAircon, [{
    key: "parseCurlResponse",
    value: function parseCurlResponse(response) {
      try {
        var res = JSON.parse(response);
        return res;
      } catch (err) {
        return response.trim();
      }
    }
  }, {
    key: "identify",
    value: function identify(callback) {
      this.log('Identifying Aircon: ' + this.name);
      callback();
    }
  }]);

  return SamsungAircon;
}();

function index (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  Accessory = homebridge.hap.Accessory; //UUIDGen = homebridge.hap.uuid

  homebridge.registerAccessory('homebridge-samsung-air-conditioner', 'SamsungSmartAirConditioner', SamsungAircon);
}

module.exports = index;
