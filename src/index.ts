import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { findDocs } from './findDocs.js';
import { getVersion } from './getVersion.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = await import(join(__dirname, '../package.json'), { assert: { type: 'json' } });

const server = new McpServer({
  name: 'Dev Proxy',
  version: packageJson.default.version
});

server.tool('FindDocs', 'Finds the relevant Dev Proxy documentation for the given query',
  { query: z.string() },
  async ({ query }) => ({
    content: [{ type: 'text', text: await findDocs(query) }]
  })
);

server.tool('GetVersion', 'Gets the current Dev Proxy version',
  async () => ({
    content: [{ type: 'text', text: await getVersion() }]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);