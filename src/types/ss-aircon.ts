export interface AirconAlarm {
	alarmType: string // 'device'
	code: string // e.g. 'FilterAlarm_OFF'
	id: string // stringified number, e.g. '0'
	triggeredTime: string // YYYY-MM-DDTHH:MM:SS
}

export interface Temperature {
	id: string
	current: number
	desired: number
	maximum: number
	minimum: number
	unit: 'Celsius' | 'Fahrenheit'
}

export type Swing = 'Fix' | 'Up_And_Low'

export interface Wind {
	direction: Swing | string
	maxSpeedLevel: number // 4
	speedLevel: number // 0
}

// For aircon sold in tropical countries
// 'Heat' function may be removed
// even it may be found on remote control
// Switching to heat would remain as the last mode
export type AirconMode = 'Cool'
	| 'Dry'
	| 'Wind'
	| 'Auto'
	| 'Heat'

export type AirconModeOption = string
/*	an incomplete list
	'Comode_Off'
	| 'Comode_Quiet'
	| 'Comode_Comfort'
	| 'Sleep_0'
	| 'Autoclean_Off'
	| 'Spi_Off'
	| 'Spi_On'
	| 'FilterCleanAlarm_0'
	| 'OutdoorTemp_83'
	| 'CoolCapa_25'
	| 'WarmCapa_0'
	| 'UsagesDB_254'
	| 'FilterTime_1905'
	| 'OptionCode_33002'
	| 'UpdateAllow_NotAllowed'
	| 'FilterAlarmTime_180'
	| 'Function_15'
	| 'Volume_100'
*/

export type AirconResource = 'Alarms'
	| 'Configuration'
	| 'Diagnosis'
	| 'EnergyConsumption'
	| 'Information'
	| 'Mode'
	| 'Operation'
	| 'Temperatures'
	| 'Wind'

export type OnOff = 'On' | 'Off'

export interface AirconResponse {
	Alarms: AirconAlarm[]
	ConfigurationLink: {
		href: string // '/devices/0/configuration'
	},
	Diagnosis: {
		diagnosisStart: string // 'Ready'
	},
	EnergyConsumption: {
		saveLocation: string // '/files/usage.db'
	},
	InformationLink: {
		href: string // '/devices/0/information'
	},
	Mode: {
		modes: AirconMode[] // ['Cool']
		options: AirconModeOption[]
	  	supportedModes: AirconMode[] // full list
	},
	Operation: {
		power: OnOff
	},
	Temperatures: Temperature[]
	Wind: Wind
	connected: boolean
	description: string // 'TP6X_RAC_16K'
	id: string // '0'
	name: string // 'RAC'
	resources: AirconResource[]
	type: string // 'Air_Conditioner'
	uuid: string
}

export interface SamsungAirconConfig {
	name: string
	ip: string
	token: string
	patchCert: string
	userAllowedMode: 'heat' | 'cool' | 'both'
}