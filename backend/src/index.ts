import express, { Express, Request, Response } from "express";
var shelljs = require("shelljs");
// import shelljs from "shelljs"


export default () => {
	const app: Express = express();
	const port = 3000;

	app.use(express.static('public'))

	let cache: unknown = null;

	app.get("/completion", async (req: Request, res: Response) => {
		// get the url from environment variable COMPLETION_ENDPOINT
		const url = process.env.COMPLETION_ENDPOINT ||
			'http://localhost:4002/rest-get/?obtype=SettingInDb&id=codemirror-play';
		const response = await fetch(url);
		if (!cache) {
			try {
				cache = await response.json();
				console.log("fetched: ", cache)
			} catch (error) {
				console.log(error)
				console.log("-------------end of error ----------------")
			}
		}
		res.send(cache || {
			data: [
				"free -mh, Display amount of free and used memory in the system, local",
				"df -lh / /mnt/g, report file system disk space usage",
				"ps aux, report a snapshot of the current processes",
				"diff -bur folder1 folder2, compare two folders recursively",
			]
		});
	});

	app.get("/execute", (req: Request, res: Response) => {
		let cmd = req.query.cmd as string;
		let parts = cmd.split(",", 2);
		shelljs.exec(parts[0].trim(), (code: number, stdout: any, stderr: any) => {
			if (code === 0) {
				res.send({ data: stdout });
			} else {
				res.send({ data: stderr });
			}
		})
	})

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
} 