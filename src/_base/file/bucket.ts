import admin from 'firebase-admin';
import env from '../../env';

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "facebook-aafc3",
    clientEmail: "firebase-adminsdk-hzdsp@facebook-aafc3.iam.gserviceaccount.com",
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  // credential: admin.credential.cert({
  //   projectId: "facebook-aafc3",
  //   privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgBGoc5gTLVz0S\nnu3wbO2Ov45wrp6OPA2cZmtKMdzaJYzKH57x7vYdrHpN/liQSCDUd31qT6vp1Bqe\nzXIjjfKZ1xCg1Njhn+V86gySImEy81S1dN21ULuajK/W9Nqxs+AtgIullWaVzr3c\nIwvJYtW6EKYrWRy73cGYjj53bLyP4kiTwq3DDid4FpD+b2Y5jU1FvHA6iPjrUV5C\nMx1+9ky9MCpl8NqGbYn8+Hcfzsw4F5ANDOwMyV2CEU4AzJNa+PYDJXVGlekd82E4\nvGMzb6y+HoDJnW55UDXtaQBstEpKFoTSkvniJmsjFm6xNOND6tBsTz0wgyscbIYq\n9ndBYJ19AgMBAAECggEABhaE6JqO8VZdWkY2EuEIdldIlqlRTcoJ61RkncsHdjxz\n5QP094sG5022zYOkYCdOXUCg9eV+fepci1D3sboza7HCATLeTLjZPoczeTym0NoI\nwNEBPZlXueNcx7BDJ2JxLTbOmVTCaJqxoIMSblQJtTpWIboSaZdgFGswNznDQGbl\nKIuT2POOgXeT+9frDFv+QpujlII4CwtCuRgnKtONTLCEKRHhcUzP1ZXIzbbA5sDu\nEYYw1xWBeKriH76wOIR8hXycCzOHCaMZvEZAchLYuu3lAX4iV2lXn8R0O2PAC7zn\nYXEkMWSmwegVID3F0xNcfj69jfmAiszsfS+oES/XQQKBgQDPgfaf1SNxw8IBWbN+\n/AAV4vHb92jzno/52/LL8HHsQrzSpQd9xVhvtPS/zwRuOz9hVNhtmjv4hzRYjqry\nOxDdHrUzazd2Ak3bQXfPG6QRSH2XBAaf5iP48IlZ1pD4bt5MLMOlbSoW/1lPogxL\nUrtY85vXxlgGR0nSfSnYnG+EEQKBgQDFaVyN7SgZ6K8XWhTo4A4bipjTc4t7LiYY\naCx0ptvB7e7u3cIHG6c7GGTNkIh4po52YN3yJmrCAK3QJx5eM/pjo74HBnkj3r+a\nxQWg+b6MD7G3gWFvXQP3jOR/ModBkEuibMtc/EKvFwYjPEhaaqrRovTrvNqeA9LV\ny6Qe6sR+rQKBgH357artL56CdMZzGbjO7pJa+/BJzKqSKeBLuqQ7Lj576byMOfcO\nFvmCR1AnMw5k476ITviDOUNReeMFghya5UsIuIMl5T68eV3R6hWPN1TSyIQlCoyK\noG4iQZCL5ekdDdH7Hy/QDUx261agD4yvBlQjWQpvPMNbBiNGn2AE4OKxAoGBAKJQ\nMA5tyUQMQjJkGb8jwdW5TlDFtxBv8FivBqZfL18zf/ockVUA0q5PL0qppNv2rjn9\nCV/5YFvk7QSxtVFlUWGtlyf1lZL9qfLaPfeOgLJukQO9uFw1UXav/IvtArLQrq98\n3nS04StPNfewsBjPjWXSo6hUXjgAEtFAn8/f3fH9AoGAX9r/ga1qOqdno8Unwr4H\nF2JLqJ1vYV9Bko84n+5lJ0jRwYm+nZMPm4SZCPo3pDh3VnvYPHE43Cw1wrW9ZIgW\njvWJ+aNh5962EIZWcdTmP3CteAPRRnsoHJitJ7rNE2BZ6hexLC7JqAVm6q4IyBjv\nQrpY+3YvivYMnQWM2CYuXGs=\n-----END PRIVATE KEY-----\n",
  //   clientEmail: "firebase-adminsdk-hzdsp@facebook-aafc3.iam.gserviceaccount.com"
  // }),
  // credential: admin.credential.cert("../facebook-aafc3-firebase-adminsdk-hzdsp-20ca602e5a.json"),
  storageBucket: "facebook-aafc3.appspot.com"
})
// Cloud storage
const bucket = admin.storage().bucket()

export default bucket;