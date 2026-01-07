---
description: 使用 Appwrite CLI 通过 MCP 工具进行数据库、函数、存储等操作的最佳实践和命令格式
globs: []
alwaysApply: false
---

# Appwrite CLI Usage Rules

This project uses Appwrite CLI through MCP (Model Context Protocol) tools. Follow these rules when working with Appwrite services.

## Available Tools

### Configuration Tools

#### Configure Appwrite Connection
- **Tool**: `mcp_appwrite-cli-mcp_appwrite_configure`
- **Purpose**: Configure Appwrite connection settings (endpoint, projectId, apiKey)
- **Parameters**:
  - `endpoint` (required): API endpoint URL, e.g., `https://cloud.appwrite.io/v1`
  - `projectId` (required): Your Appwrite project ID
  - `apiKey` (required): Your Appwrite API key
  - `selfSigned` (optional): Allow self-signed certificates for self-hosted instances (default: false)
- **Note**: Configuration is automatically saved and persists across sessions

#### Check Configuration Status
- **Tool**: `mcp_appwrite-cli-mcp_appwrite_status`
- **Purpose**: View current configuration status and connection information
- **Usage**: Call without parameters to check if Appwrite is properly configured

### Execute CLI Commands

#### Execute Appwrite CLI Commands
- **Tool**: `mcp_appwrite-cli-mcp_appwrite`
- **Purpose**: Execute any Appwrite CLI command
- **Critical**: 
  - Input the command directly WITHOUT the `appwrite` prefix
  - Example: Use `databases list` instead of `appwrite databases list`
  - Output is automatically in JSON format

## Command Categories

### Database Operations
- **Legacy**: `databases` - Use for older database operations
- **Recommended**: `tables-db` - Use for new database/table operations
  - Example commands:
    - `tables-db list` - List all databases
    - `tables-db create-table --database-id <id> --table-id <id> --name <name>`
    - Use `tables-db --help` to see all available subcommands

### Functions
- **Command**: `functions`
- **Example commands**:
  - `functions list` - List all functions
  - `functions create-execution --function-id <id>` - Execute a function
  - Use `functions --help` to see all available subcommands

### Storage
- **Command**: `storage`
- **Example commands**:
  - `storage list-buckets` - List all storage buckets
  - `storage create-file --bucket-id <id> --file-id <id> --file <path>` - Upload a file
  - Use `storage --help` to see all available subcommands

### Sites (Static Site Hosting)
- **Command**: `sites`
- **Example commands**:
  - `sites list` - List all sites
  - `sites update --site-id <id> --name <name> --framework <framework> --adapter <adapter> --build-runtime <runtime> --output-directory <dir>` - Update site configuration
  - `sites create-deployment --site-id <id> --code <path> --activate <true|false> --output-directory <dir>` - Create and deploy a site
  - Use `sites --help` to see all available subcommands
- **Common deployment workflow**:
  1. Build your application locally (e.g., `pnpm build`)
  2. Update site configuration (first time or when changing settings)
  3. Create deployment with the built output directory

### Other Services
- **Users**: `users`, `teams`
- **Messaging**: `messaging`
- **Projects**: `projects`, `project`, `sites`
- **Other**: `health`, `locale`, `graphql`, `account`, `init`, `pull`, `push`, `deploy`, `run`, `update`, `console`, `migrations`, `vcs`, `tokens`, `proxy`

## Best Practices

### 1. Always Check Help First
When unsure about command parameters, always check the help documentation:
- Use `--help` or `-h` flag with any command
- Example: `databases list --help`
- Example: `functions create-execution --help`
- Example: `storage --help`

### 2. Command Format
- **DO**: Use `tables-db list` (without `appwrite` prefix)
- **DON'T**: Use `appwrite tables-db list` (will fail)

### 3. Output Format
- All commands automatically output JSON format
- No need to add `--json` flag manually

### 4. Configuration
- Always configure Appwrite connection before executing commands
- Use `mcp_appwrite-cli-mcp_appwrite_status` to verify configuration
- Configuration persists, so you don't need to reconfigure every time

### 5. Error Handling
- If a command fails, check:
  1. Is Appwrite properly configured? (use status tool)
  2. Are you using the correct command format? (no `appwrite` prefix)
  3. Are all required parameters provided?
  4. Check command help for correct parameter names

## Example Workflow

1. **Configure Appwrite** (if not already done):
   ```
   Use: mcp_appwrite-cli-mcp_appwrite_configure
   Parameters: endpoint, projectId, apiKey
   ```

2. **Verify Configuration**:
   ```
   Use: mcp_appwrite-cli-mcp_appwrite_status
   ```

3. **Execute Commands**:
   ```
   Use: mcp_appwrite-cli-mcp_appwrite
   Command: tables-db list
   ```

4. **Get Help** (when needed):
   ```
   Use: mcp_appwrite-cli-mcp_appwrite
   Command: tables-db --help
   ```

### Site Deployment Workflow

1. **Build your application** (local command, not via MCP):
   ```bash
   pnpm build
   ```

2. **Configure Site** (first deployment or when updating configuration):
   ```
   Use: mcp_appwrite-cli-mcp_appwrite
   Command: sites update --site-id react-app --name "React Appwrite App" --framework vite --adapter static --build-runtime node-20.0 --output-directory .
   ```

3. **Deploy Site**:
   ```
   Use: mcp_appwrite-cli-mcp_appwrite
   Command: sites create-deployment --site-id react-app --code "$(pwd)/dist" --activate true --output-directory .
   ```
   **Note**: The `--code` parameter should be an absolute path to your build output directory (e.g., `/path/to/project/dist`)

## Important Notes

- ⚠️ **All commands support rich option parameters** - The examples shown are only the most common use cases
- 📋 **Always use `--help`** to view complete help information for any command
- 🔍 **Output format**: Default output is JSON format (automatically added)
- 💡 **Tip**: When uncertain about command parameters, use `--help` first instead of guessing

