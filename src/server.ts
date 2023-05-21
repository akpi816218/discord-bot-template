/**
 * @fileoverview The server for the application
 */

import express, { Request, Response } from 'express';

export enum Method {
	DELETE = 'delete',
	GET = 'get',
	POST = 'post',
	PUT = 'put'
}

/**
 * @function createServer
 * @param routes The routes to launch the server with
 * @returns {Express} An express server
 */
export function createServer(
	...routes: {
		handler: (req: Request, res: Response) => void;
		method: Method;
		route: string;
	}[]
) {
	const app = express();
	for (const { handler, method, route } of routes) {
		app[method](route, handler);
	}
	return app;
}
