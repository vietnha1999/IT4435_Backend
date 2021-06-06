import express, {Express} from 'express';
import responseTime from 'response-time';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import STATUS_CODE from './const/status';
import ERR_CODE from "./const/error";
import logger from './_base/log/logger4js';
import sendResAppJson from './dto/response/sendResAppJson';
import globalErrorMiddleware from './error/globalErrorMiddleware';
import CustomError from './error/customError';
import employeeRoute from './route/employeeRoute';
import accountRoute from './route/accountRoute';
import productRoute from './route/productRoute';
import orderRoute from './route/orderRoute';
import transactionRoute from './route/transactionRoute';
import serverConfig from './config/serverConfig';
import statRoute from './route/statRoute';
import bucket from './_base/file/uploadFirebase';
import { v4 as uuidv4 } from 'uuid';
import uploadMemory from './_base/file/uploadMemory';
import { uploadFirebaseManyMiddleware, uploadFirebaseSingleMiddleware } from './middleware/uploadFirebaseMiddleware';

const app: Express = express();

/**
 * Library Middleware
 */
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// logger.debug("DIR" + path.relative(__dirname, '/static'));
/**
 * TODO: Could be fail when deploy
 */
app.use('/static',express.static("static"));
app.use('/public',express.static("public"));

/**
 * Log response time
 */
app.use(responseTime((req: any, res: any, time: number) => {
  logger.info(req.method + " " + serverConfig?.urlPrefix.replace(/.$/,"") + req.url + " in " + time.toFixed(3) + "ms");
}))

/**
 * Business logic
 */
app.use(employeeRoute);
app.use(accountRoute);
app.use(productRoute);
app.use(orderRoute);
app.use(transactionRoute);
app.use(statRoute);

/**
 * For testing
 */
app.get('/testok', (req, res) => {
  sendResAppJson(res, STATUS_CODE.OK, ERR_CODE.OK);
})
app.get('/testerror', (req, res) => {
  throw new CustomError(STATUS_CODE.INTERNAL_SERVER_ERROR, ERR_CODE.INTERNAL_SERVER_ERROR, "testerror", {"name": 2, 3: 111}, 2);
})

app.post('/up', uploadMemory.single("file"), async function(req: any, res: any, next: any) {
  if (!req.file) {
    next(new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.FIREBASE_UPLOAD_NEED_FILE));
  }

  const filename = uuidv4();
  const blob = bucket.file(filename);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype 
    }
  })
  
  blobWriter.on('error', (err) => {
    logger.error(err);
    next(new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.FIREBASE_UPLOAD_ERROR_UPLOAD));
  })
  
  blobWriter.on('finish', () => {  
    const url = `https://firebasestorage.googleapis.com/v0/b/facebook-aafc3.appspot.com/o/${filename}?alt=media`;
    sendResAppJson(res, STATUS_CODE.OK, ERR_CODE.OK, {
      url: url
    });
  })
  
  blobWriter.end(req.file.buffer)
});

app.post('/up1',
  uploadMemory.single("file"),
  uploadFirebaseSingleMiddleware(),
  function (req: any, res: any) {
    logger.debug("URL" + res.locals.pathImage);
    sendResAppJson(res, STATUS_CODE.OK, ERR_CODE.OK, {
      url: res.locals.pathImage
    });
  }
);

app.post('/up2',
  uploadMemory.fields([
    {
      name: 'avatar',
      maxCount: 1
    },
    {
      name: 'cover',
      maxCount: 2
    }
  ]),
  uploadFirebaseManyMiddleware([
    {
      name: 'avatar',
      maxCount: 1
    },
    {
      name: 'cover',
      maxCount: 2
    }
  ]),
  function (req: any, res: any) {
    logger.debug("URL" + JSON.stringify(res.locals.urls));
    sendResAppJson(res, STATUS_CODE.OK, ERR_CODE.OK, {
      urls: res.locals.urls
    });
  }
);

/**
 * Handle Global Error (Custom Error and Uncontrollable Error)
 */
app.use(globalErrorMiddleware);
/**
 * Handle route that is not in router
 */
app.all('*', (req, res) => {
  sendResAppJson(res, STATUS_CODE.NOT_FOUND, ERR_CODE.NOT_FOUND);
})

export default app;