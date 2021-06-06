import bucket from "./uploadFirebase"

export default function uploadFirebaseSingleImage(filename: string, buffer: any, mimetype: any) {
    return new Promise((resolve: Function, reject: Function) => {
        const blob = bucket.file(filename);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: mimetype 
            }
        })
        blobWriter.on('error', (err) => {
            reject(err);
        })
        blobWriter.on('finish', () => {
            const url = `https://firebasestorage.googleapis.com/v0/b/facebook-aafc3.appspot.com/o/${filename}?alt=media`;
            resolve(url);
        });
        blobWriter.end(buffer);
    })
}