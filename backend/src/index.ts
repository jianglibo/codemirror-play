import express, { Express, Request, Response } from "express";

export default () => {
	const app: Express = express();
	const port = 3000;

	app.use(express.static('public'))

	app.get("/completion", (req: Request, res: Response) => {
		res.send("Express + TypeScript Server");
	});

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
} 