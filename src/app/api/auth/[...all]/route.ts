import { getAuth } from '@/lib/auth';

export const runtime = 'nodejs';

async function handle(request: Request) {
    const auth = await getAuth();
    return auth.handler(request);
}

export const GET = handle;
export const POST = handle;
