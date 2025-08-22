import serverless from "serverless-http";
import { createServer } from "../../server";

let app: any;

const getApp = () => {
  if (!app) {
    app = createServer();
  }
  return app;
};

export const handler = serverless(getApp(), {
  binary: ["image/*", "application/octet-stream"],
});
