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
import env from './env';
import employeeRoute from './route/employeeRoute';
import accountRoute from './route/accountRoute';
import productRoute from './route/productRoute';
import orderRoute from './route/orderRoute';
import transactionRoute from './route/transactionRoute';
import * as path from 'path';
import serverConfig from './config/serverConfig';
import statRoute from './route/statRoute';
import uploadDisk from './_base/file/uploadDisk';
import bucket from './_base/file/uploadFirebase';
import { v4 as uuidv4 } from 'uuid';

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

app.post('/up', uploadDisk.single("file"), async function(req: any, res: any, next: any) {
  if (!req.file || !req.file.path) {
    throw new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.EMPLOYEE_UPLOAD_AVA_ERROR);
  }

  const filename = uuidv4() + ".jpeg";
  const blob = bucket.file(filename);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype 
    }
  })
  
  blobWriter.on('error', (err) => {
    logger.error(err);
    throw new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.PRODUCT_UPLOAD_PREVIEW_ERROR);
  })
  
  blobWriter.on('finish', () => {  
    const url = `https://firebasestorage.googleapis.com/v0/b/facebook-aafc3.appspot.com/o/${filename}?alt=media`;
    sendResAppJson(res, STATUS_CODE.OK, ERR_CODE.OK, {
      url: url
    });
  })
  
  blobWriter.end(req.file.buffer)
});

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