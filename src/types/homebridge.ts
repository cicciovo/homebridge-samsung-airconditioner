export interface HbActiveEnum {
	INACTIVE: 0
	ACTIVE: 1
}

export interface HbTargetHeaterCoolerStateEnum {
	AUTO: 0
	HEAT: 1
	COOL: 2
}

export interface HbCurrentHeaterCoolerStateEnum {
	INACTIVE: 0
	IDLE: 1
	HEATING: 2
	COOLING: 3
}

export interface HbFilterChangeIndicationEnum {
	FILTER_OK: 0
	CHANGE_FILTER: 1
}

export interface HbSwingModeEnum {
	SWING_DISABLED: 0
	SWING_ENABLED: 1
}

export type EnumValueLiterals <T = {[key: string]: number}> = T[keyof T]

export type InjectHbToHapCharacteristic <T = {[key: string]: number}>
	= HAPNodeJS.Characteristic & {
		uiud: string
	} & T

// Reference: https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js
export interface HomebridgeHapExtendedCharacteristic extends HAPNodeJS.Characteristic {
	Active: InjectHbToHapCharacteristic<HbActiveEnum>
	CurrentHeaterCoolerState: InjectHbToHapCharacteristic<HbCurrentHeaterCoolerStateEnum>
	TargetHeaterCoolerState: InjectHbToHapCharacteristic<HbTargetHeaterCoolerStateEnum>
	SwingMode: InjectHbToHapCharacteristic<HbSwingModeEnum>
	FilterChangeIndication: InjectHbToHapCharacteristic<HbFilterChangeIndicationEnum>
}