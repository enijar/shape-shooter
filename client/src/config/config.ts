import env from "../env";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  serverUrl: env.serverUrl ?? "http://localhost:3000",
};
