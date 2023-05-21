/**
 * @fileoverview The logger for the application
 */

import { pino } from 'pino';
import pretty from 'pino-pretty';
export const logger = pino(
	pretty({
		colorize: true
	})
);
