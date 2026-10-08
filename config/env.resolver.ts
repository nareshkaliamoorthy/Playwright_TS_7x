
import { EnvConfig } from "./env.type";
import { qaConfig } from "./qa.config";

const environments: Record<string, EnvConfig> = {
    qa: qaConfig,
    //uat: uatConfig
};

export function getEnvironmentConfig() {
    const environment = process.env.TEST_ENV || "qa";
    const config = environments[environment];
    console.log(config);
    return config;
}