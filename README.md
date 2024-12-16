## mcp-server-diceroll

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dice-roll": {
      "command": "npx",
      "args": ["-y", "mcp-server-diceroll"]
    }
  }
}
```