import { getFileName } from "./get-file-name.util";

export const blobToFile = (theBlob: Blob, fileNamePrefix = 'file'): File => {
    const SPLIT_FILE_TYPE = theBlob.type
        .split(';')[0].split('/');

    const FILE_EXTENSION = SPLIT_FILE_TYPE[SPLIT_FILE_TYPE.length - 1];

    const FILE_NAME = getFileName(FILE_EXTENSION, 'file');

    return new File([theBlob], FILE_NAME, { lastModified: new Date().getTime(), type: theBlob.type })
}