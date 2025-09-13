import serverless from "serverless-http";
import { createServer } from "../server";

// Export a Vercel-compatible handler that wraps the Express app
export default serverless(createServer());
