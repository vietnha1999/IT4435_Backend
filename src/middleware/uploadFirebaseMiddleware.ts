import ERR_CODE from "../const/error"
import STATUS_CODE from "../const/status"
import CustomError from "../error/customError"
import { v4 as uuidv4} from "uuid"
import uploadFirebaseSingleImage from "../_base/file/uploadFirebaseSingleImage"
import logger from "../_base/log/logger4js"

export function uploadFirebaseSingleMiddleware(filename: string | null = null) {
    return async function upload(req: any, res: any, next: any) {
        try {
            if (!req.file) {
                throw new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.FIREBASE_UPLOAD_NEED_FILE);
            }

            if (!filename) {
                filename = uuidv4();
            }
            
            const url = await uploadFirebaseSingleImage(filename, req.file.buffer, req.file.mimetype);
            res.locals.pathImage = url;
            next();
        }
        catch(e) {
            logger.error(e);
            next(e);
        }
    }
}