export function getFileName(fileExtension: string, prefix = '') {
    var nowMilli = Date.now();
    return prefix + nowMilli + "." + fileExtension;
}
