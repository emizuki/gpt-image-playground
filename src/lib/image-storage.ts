import { createHash } from 'crypto';
import path from 'path';

export function imageDirectory(userId: string): string {
    const directory = createHash('sha256').update(userId).digest('hex');
    return path.resolve(process.cwd(), 'generated-images', directory);
}

export function isValidImageFilename(filename: string): boolean {
    return filename.length > 0 && filename !== '.' && !filename.includes('..') && !filename.includes('/') && !filename.includes('\\') && !filename.includes('\0');
}
