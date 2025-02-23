import { INestApplication, UnauthorizedException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

/**
 * Defines the application config variables
 * @returns the Application config variables
 */
export function constants(): {
  port: number;
  databaseUrl: string;
  allowedOrigins: string[];
  jwt: {
    secret: string;
    expiresIn: string;
  };
} {
  return {
    port: +process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  };
}

/**
 * Generates obj for the app's CORS configurations
 * @returns CORS configurations
 */
export function corsConfig(): CorsOptions {
  const appConfiguration = constants();
  return {
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, Cookies",
    credentials: true,
    origin: (origin, callback) => {
      const { allowedOrigins } = appConfiguration;
      const canAllowUndefinedOrigin =
        origin === undefined && process.env.NODE_ENV !== "production";

      if (allowedOrigins.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
        callback(null, true);
      } else {
        callback(
          new UnauthorizedException(
            `Not allowed by CORS for origin:${origin} on ${process.env.NODE_ENV}`,
          ),
        );
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  };
}

/**
 * Configure app instance
 * @param {INestApplication} app - Application instance
 */
export function configure(app: INestApplication): void {
  app.setGlobalPrefix("api");
  app.enableCors(corsConfig());
}