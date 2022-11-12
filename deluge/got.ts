import got from "got";

const logger = got.extend({
	handlers: [
		(options, next) => {
			console.log(`Sending ${options.method} to ${options.url} options: ${(options.json as any)?.method}`);
			return next(options);
		}
	],
    hooks: {
        afterResponse: [
            (response, retryWithMergedOptions) => {
                console.log(`Total time ${response.timings.phases.total}`)
                return response
            }
        ]
    },
    dnsCache: true
});
export default logger
