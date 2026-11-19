import Playground from '@/lib/auth-playground';
import { getSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type { HistoryMetadata } from '@/lib/auth-playground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const session = await getSession(await headers());
    if (!session) redirect('/login');
    return <Playground />;
}
