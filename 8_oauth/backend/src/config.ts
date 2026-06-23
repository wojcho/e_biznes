export const SECRET = "mockMOCK";
export const TOKEN_COOKIE_NAME = "token";
export const TOKEN_EXPIRES_IN = "1h";
export const TOKEN_EXPIRES_IN_MILLISECONDS = 60 * 60 * 1000;
export const SERVER_PORT = 4567;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = "http://localhost:4567/api-public/oauth/google/callback";
export const CLIENT_REDIRECT_URI = "http://localhost:5173/";
