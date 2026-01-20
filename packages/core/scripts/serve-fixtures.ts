/**
 * Shift CSS - Test Fixture Server
 *
 * Simple static server for serving test fixtures during E2E testing.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '../tests/e2e/fixtures');
const DIST_DIR = join(__dirname, '../dist');

const PORT = 3333;

const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
};

const server = Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		let pathname = url.pathname;

		// Default to index.html
		if (pathname === '/') {
			pathname = '/index.html';
		}

		// Route /dist/* to the dist directory
		if (pathname.startsWith('/dist/')) {
			const filePath = join(DIST_DIR, pathname.replace('/dist/', ''));
			const file = Bun.file(filePath);

			if (await file.exists()) {
				const ext = pathname.substring(pathname.lastIndexOf('.'));
				return new Response(file, {
					headers: {
						'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
					},
				});
			}
		}

		// Otherwise serve from fixtures directory
		const filePath = join(FIXTURES_DIR, pathname);
		const file = Bun.file(filePath);

		if (await file.exists()) {
			const ext = pathname.substring(pathname.lastIndexOf('.'));
			return new Response(file, {
				headers: {
					'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
				},
			});
		}

		return new Response('Not Found', { status: 404 });
	},
});

console.log(`Test fixture server running at http://localhost:${server.port}`);
