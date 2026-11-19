import Dexie, { type EntityTable } from 'dexie';

export interface ImageRecord {
    filename: string;
    blob: Blob;
}

export class ImageDB extends Dexie {
    images!: EntityTable<ImageRecord, 'filename'>;

    constructor(userId: string) {
        super(`ImageDB:${userId}`);

        this.version(1).stores({
            images: '&filename'
        });

        this.images = this.table('images');
    }
}
