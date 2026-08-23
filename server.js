const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const fs = require('fs');
const path = require('path');

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const pathname = parsedUrl.pathname || '/';

      if (pathname === '/llms.txt' || pathname === '/robots.txt' || pathname === '/site.webmanifest') {
        const filePath = path.join(__dirname, 'public', pathname.slice(1));
        if (fs.existsSync(filePath)) {
          const contentType = pathname.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'application/manifest+json';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.end(fs.readFileSync(filePath));
        }
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Vaneando Next.js server ready on port ${port}`);
    });
});
