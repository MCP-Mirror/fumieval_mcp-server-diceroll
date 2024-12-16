#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const server = new Server(
  {
    name: "dice-roll",
    version: "1.0.1",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

const DiceRollSchema = z.object({
  faces: z.number().default(6),
  rolls: z.number().default(1),
});

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "roll_dice",
    description: "Roll a dice",
    inputSchema: zodToJsonSchema(DiceRollSchema),
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "roll_dice": {
      const { faces, rolls } = DiceRollSchema.parse(args);
      let result = 0;
      for (let i = 0; i < rolls; i++) {
        result += Math.floor(Math.random() * faces) + 1;
      }
      return {
        content: [{type: 'text', text: result.toString()}],
      }
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server started");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
