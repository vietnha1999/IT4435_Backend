import ERR_CODE from "../const/error"
import STATUS_CODE from "../const/status"
import CustomError from "../error/customError"
import { v4 as uuidv4} from "uuid"
import uploadFirebaseSingleImage from "../_base/file/uploadFirebaseSingleImage"
import logger from "../_base/log/logger4js"
import { FieldInfoMulter, OneMulterField } from "../model/TypeMulterFields"

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

/**
 * @param inputFields: input object needed be test
 * @param expectFields: list of expect field
 * @returns if fields valid
 */
function validateDumpFields(inputFields: any, expectFields: Array<OneMulterField>) {
    if (!inputFields || typeof inputFields !== "object") {
        return false;
    }
    let result: Array<FieldInfoMulter> = [];
    for (let fieldIndex = 0; fieldIndex < expectFields.length; fieldIndex++) {
        const field: OneMulterField = expectFields[fieldIndex];
        const now = inputFields[field.name];
        /**
         * test if curr field valid
         */
        if (!now || !Array.isArray(now) || now.length <= 0) {
            return false;
        }
        /**
         * dump curr field
         */
        for (let currFileId = 0; currFileId < now.length; currFileId++) {
            const input = now[currFileId];
            /**
             * dump curr file in curr field
             */
            if (input && input.buffer && input.mimetype) {
                result.push({
                    buffer: input.buffer,
                    filename: field.name,
                    mimetype: input.mimetype
                })
            }
            else {
                return false;
            }
        }
    }
    if (result.length <= 0) {
        return false;
    }
    return result;
}

export function uploadFirebaseManyMiddleware(fields: Array<OneMulterField>) {
    return async function upload(req: any, res: any, next: any) {
        try {
            const dump = validateDumpFields(req.fields, fields);
            if (!dump) {
                throw new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.FIREBASE_UPLOAD_NEED_FILE);
            }

            // const promises = dump.map((file: FieldInfoMulter) => uploadFirebaseSingleImage(file.filename, file.buffer, file.mimetype));
            const urls = await Promise.all(dump.map((file: FieldInfoMulter) => uploadFirebaseSingleImage(file.filename, file.buffer, file.mimetype)));
            logger.debug("URLS" + JSON.stringify(urls));
            
            // Create result
            const result: any = {};
            for (let i = 0; i < fields.length; i++) {
                result[fields[i].name] = [];
            }
            logger.debug("result" + JSON.stringify(result));

            if (dump.length !== urls.length) {
                logger.error("Something error urls can not mapping to dump")
            }

            // for (let dumpId = 0; dumpId < urls.length; dumpId++) {
            //     const url = urls[dumpId];
            //     result[fields]
            // }
            res.locals.urls = urls;
            next();
        }
        catch(e) {
            logger.error(e);
            next(e);
        }
    }
}