import { getSession } from '@/lib/auth';
import { imageDirectory, isValidImageFilename } from '@/lib/image-storage';
import fs from 'fs/promises';
import { lookup } from 'mime-types';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';


export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const session = await getSession(request.headers);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { filename } = await params;

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (!isValidImageFilename(filename)) {
        return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filepath = path.join(imageDirectory(session.user.id), filename);

    try {
        await fs.access(filepath);

        const fileBuffer = await fs.readFile(filepath);

        const contentType = lookup(filename) || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'private, no-store'
            }
        });
    } catch (error: unknown) {
        console.error(`Error serving image ${filename}:`, error);
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
