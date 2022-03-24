export async function blobToArrayBuffer(blob: Blob) {
    if ('arrayBuffer' in blob) return await blob.arrayBuffer();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject;
        reader.readAsArrayBuffer(blob);
    });
}