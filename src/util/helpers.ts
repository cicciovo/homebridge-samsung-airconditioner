import {JsonType} from '../types/generic'

export const getIntFromUnderscoredString: (str?: string) => number
= (str) => {
    if (!str) {
        return NaN
    }
    return parseInt(str.split('_').pop() || '')
}

export const getVal: (obj: JsonType, dottedKey?: string) => JsonType | undefined
= (obj, dottedKey) => {
    if (!dottedKey) {
        return obj
    }
    const splits = dottedKey.split('.')
    let output: JsonType | undefined = obj
    for (const key of splits) {
        if (!!key) {
            if (!!output && typeof output === 'object') {
                if (key.endsWith(']') && /^[^.\s\[\]]+\[[0-9]+\]$/.test(key)) {
                    const arr_splits = key.split('[')
                    output = output[arr_splits[0]]
                    const idx = parseInt(arr_splits[1])
                    if (idx >= 0 && !!output && typeof output === 'object') {
                        output = output[idx]
                    } else {
                        return undefined
                    }
                } else {
                    output = output[key]
                }
            } else {
                return undefined
            }
        }
    }
    return output
}