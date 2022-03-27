import { Dexie, Table } from 'dexie';

export interface UploadLivestreamResponse {
    fileName: string;
    recordedOn: Date;
    id?: number;
}

export class UploadLivestreamResponseDb extends Dexie {
    uploadResponses!: Table<UploadLivestreamResponse, number>;

    constructor() {
        super('UploadLivestreamResponse');

        this.version(1).stores({
            uploadResponses: '++id'
        });
    }

    async resetDatabase() {
        await uploadLivestreamResponseDb.transaction('rw', 'uploadResponses', () => {
            this.uploadResponses.clear();
        });
    }

    async recordUploadLivestreamRepsonse(data: UploadLivestreamResponse) {
        await uploadLivestreamResponseDb
            .transaction('rw', 'uploadResponses', () => {
                this.uploadResponses.add(data);
            });
    }

    async retrieveFirstUploadLivestreamRepsonse() {
        return await this.uploadResponses
            .orderBy('id').first();
    }
}

export const uploadLivestreamResponseDb = new UploadLivestreamResponseDb();
