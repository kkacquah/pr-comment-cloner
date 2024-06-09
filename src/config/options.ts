import dotEnv from "dotenv";

dotEnv.config();

function getMandatoryEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${varName} is not set.`);
  }
  return value;
}

export const config = {
  github: {
    token: getMandatoryEnvVar("GITHUB_TOKEN"),
    owner: getMandatoryEnvVar("GITHUB_OWNER"),
    repo: getMandatoryEnvVar("GITHUB_REPO"),
  },
  openai: {
    apiKey: getMandatoryEnvVar("OPENAI_API_KEY"),
    embeddingModel: "text-embedding-3-large",
  },
  commentEmbedding: {
    maxConcurrency: 10,
    pageBreakSize: 400,
  },
  postgres: {
    user: getMandatoryEnvVar("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: getMandatoryEnvVar("DB_DATABASE"),
  },
  vectorDb: {
    port: getMandatoryEnvVar("VECTOR_DB_PORT"),
  },
};

export type Config = typeof config;
