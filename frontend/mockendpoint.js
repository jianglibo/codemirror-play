
// export default function (req, res, next) {
// 	res.send('Hello World!')
// 	// next();
// }

// https://expressjs.com/en/4x/api.html#req
module.exports = function (req, res, next) {
	// res.statusCode = 202;
	// console.log(res)
	console.log(typeof req.url)
	// Object.keys(req).forEach((prop)=> console.log(prop));
	// if (req.url.startsWith('/execute')) {
	// 	res.send('about to execute cmd: ' + req.url)
	// 	return;
	// } else if (req.url == '/completion') {
	// 	res.send(JSON.stringify({data: ['comm1', 'comm2', 'comm3']}))
	// 	return;
	// }
	next();
}

// module.exports = function (options) {
// 	return function (req, res, next) {
// 		res.send('Hello World!')
// 		// next();
// 	}
// }