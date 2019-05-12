export type JsonAllowedBasicType = string | number | boolean | null | undefined 

export interface JsonObjectInterface {
	[key: string]: JsonAllowedBasicType | JsonObjectInterface | Array<JsonAllowedBasicType | JsonObjectInterface>
}

export type JsonType = JsonObjectInterface | JsonAllowedBasicType | JsonAllowedBasicType[]

export type EnumValueLiterals <T = {[key: string]: number}> = T[keyof T]