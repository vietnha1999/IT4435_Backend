import admin from 'firebase-admin';

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./facebook-aafc3-firebase-adminsdk-hzdsp-20ca602e5a.json"),
  storageBucket: "facebook-aafc3.appspot.com"
})
// Cloud storage
const bucket = admin.storage().bucket()

export default bucket;