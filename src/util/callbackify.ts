

export default function callbackify(
	func: (...args: any[]) => Promise<any>,
	log?: (any) => void
): Function {
	return (...args: any[]) => {
		const onlyArgs: any[] = []
		let maybeCallback: Function | null = null

		for (const arg of args) {
			if (typeof arg === 'function') {
				maybeCallback = arg
			} else {
				onlyArgs.push(arg)
			}
		}

		if (!maybeCallback) {
			if (!!log) {
				log('Missing callback parameter')
			}
			throw new Error("Missing callback parameter!")
		}
		if (!!log) {
			log('callback with args: ' + JSON.stringify(onlyArgs) + '; func type: ' + func)
		}
		const callback = maybeCallback

		func(...onlyArgs)
		.then((data: any) => {
			if (!!log) {
				log('callback resolve: ' + JSON.stringify(data))
			}
			callback(null, data)
		})
		.catch((err: any) => {
			callback(err)
		})
	}
}