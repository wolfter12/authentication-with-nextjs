const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        MONGODB_CONNECTION_URL: "mongodb+srv://<username>:<password>@<db>_dev",
        MONGODB_CONNECTION_SCHEMA: "connection_schema",
        MONGODB_USER_NAME: "username_dev",
        MONGODB_PASSWORD: "password_dev",
        MONGODB_CLUSTERNAME: "cluster_name_dev",
        MONGODB_DATABASE: "db_name_dev",
      },
    };
  }

  return {
    reactStrictMode: true,
    env: {
      MONGODB_CONNECTION_URL: "mongodb+srv://<username>:<password>@<db>_dev",
      MONGODB_CONNECTION_SCHEMA: "connection_schema_dev",
      MONGODB_USER_NAME: "username_dev",
      MONGODB_PASSWORD: "password_dev",
      MONGODB_CLUSTERNAME: "cluster_name_dev",
      MONGODB_DATABASE: "db_name_dev",
    },
  };
};
