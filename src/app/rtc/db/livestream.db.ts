import { Dexie, Table } from 'dexie';


export interface LiveStream {
    id?: number;
    blob: Blob;
    addedOn: number;
    sent: boolean;
    sentOn?: number;
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

    async markChunksAsSent(chunks: Array<LiveStream>) {
        await livestreamDb.transaction('rw', 'liveStreams', () => {
            this.liveStreams.bulkPut(chunks)
                .then()
                .catch(Dexie.BulkError, function (e) {
                    // Explicitely catching the bulkAdd() operation makes those successful
                    // additions commit despite that there were errors.
                    console.error("Some raindrops did not succeed. However,  they were added added successfully");
                });
        });
    }
}

export const livestreamDb = new LiveStreamDb();
