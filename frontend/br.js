var livereload = require('livereload');
var lrport = 35729;
var server = livereload.createServer({
	port: lrport,
	exts: ["html", "js"],
	delay: 300
}, () => {
	console.log(`LiveReload server started, list on port ${lrport}`);
});

var towatch = __dirname + "/public"
console.log(towatch)
server.watch(towatch);
