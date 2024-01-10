import express, { Express, Request, Response } from "express";
var shelljs = require("shelljs");

export default () => {
	const app: Express = express();
	const port = 3000;

	app.use(express.static('public'))

	app.get("/completion", (req: Request, res: Response) => {
		res.send({
			data: [
				"free -mh, Display amount of free and used memory in the system",
				"df -lh / /mnt/g, report file system disk space usage",
				"ps aux, report a snapshot of the current processes",
			]
		});
	});

	app.get("/execute", (req: Request, res: Response) => {
		let cmd = req.query.cmd as string;
		let parts = cmd.split(",", 2);
		shelljs.exec(parts[0], (code: number, stdout: any, stderr: any) => {
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