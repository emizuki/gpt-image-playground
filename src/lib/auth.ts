import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { genericOAuth } from 'better-auth/plugins';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required authentication configuration: ${name}`);
    return value;
}

function createAuth() {
    const secret = required('BETTER_AUTH_SECRET');
    if (secret.length < 32) throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters');
    const baseURL = required('BETTER_AUTH_URL');
    const clientId = required('OIDC_CLIENT_ID');
    const clientSecret = required('OIDC_CLIENT_SECRET');
    const issuer = required('OIDC_ISSUER').replace(/\/$/, '');
    const issuerURL = new URL(issuer);
    if (issuerURL.protocol !== 'https:' && !(issuerURL.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(issuerURL.hostname))) {
        throw new Error('OIDC_ISSUER must use HTTPS except for a local development provider');
    }
    const dbPath = resolve(process.env.AUTH_DB_PATH || 'data/auth.sqlite');
    mkdirSync(dirname(dbPath), { recursive: true });
    const database = new DatabaseSync(dbPath);
    database.exec('PRAGMA busy_timeout = 5000');
    return betterAuth({
        baseURL,
        secret,
        database,
        plugins: [genericOAuth({
            config: [{
                providerId: 'oidc',
                discoveryUrl: `${issuer}/.well-known/openid-configuration`,
                clientId,
                clientSecret,
                scopes: ['openid', 'email', 'profile'],
                pkce: true,
                requireIdTokenVerification: true
            }]
        })]
    });
}

type Auth = ReturnType<typeof createAuth>;
const globalAuth = globalThis as typeof globalThis & { authInstance?: Promise<Auth> };

export function getAuth(): Promise<Auth> {
    if (!globalAuth.authInstance) {
        globalAuth.authInstance = (async () => {
            const auth = createAuth();
            const { runMigrations } = await getMigrations(auth.options);
            await runMigrations();
            return auth;
        })();
    }
    return globalAuth.authInstance;
}

export async function getSession(headers: Headers) {
    const auth = await getAuth();
    return auth.api.getSession({ headers });
}
