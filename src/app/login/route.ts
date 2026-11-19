import { getAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const auth = await getAuth();
    const { headers, response } = await auth.api.signInSocial({
        headers: request.headers,
        body: { provider: 'oidc', callbackURL: '/' },
        returnHeaders: true
    });

    if (!response.url) {
        return new Response('Unable to start sign-in.', { status: 500 });
    }

    const redirectHeaders = new Headers({ Location: response.url, 'Cache-Control': 'no-store' });
    for (const cookie of headers.getSetCookie()) {
        redirectHeaders.append('Set-Cookie', cookie);
    }
    return new Response(null, { status: 302, headers: redirectHeaders });
}
