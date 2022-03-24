import { Dexie, Table } from 'dexie';


export interface LiveStream {
    id?: number;
    blob: Blob;
    addedOn: number;
    sent: boolean;
}

export class LiveStreamDb extends Dexie {
    liveStreams!: Table<LiveStream, number>;

    constructor() {
        super('LiveStreamBlob');

        this.version(1).stores({
            liveStreams: '++id'
        });

    }

    async resetDatabase() {
        await livestreamDb.transaction('rw', 'liveStreams', () => {
            this.liveStreams.clear();
        });
    }
}

export const livestreamDb = new LiveStreamDb();
