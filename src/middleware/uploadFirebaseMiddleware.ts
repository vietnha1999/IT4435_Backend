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
        if (Array.isArray(field.outputName) && field.maxCount !== field.outputName.length) {
            return false;
        }

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
                /**
                 * decision output filename
                 */
                let outName: string;
                if (field.outputName === "uuid") {
                    outName = uuidv4();
                }
                else if (field.outputName === "increment") {
                    outName = field.name + currFileId;
                }
                else {
                    outName = field.outputName[currFileId];
                }

                result.push({
                    buffer: input.buffer,
                    filename: outName,
                    mimetype: input.mimetype,
                    originName: field.name
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
            const dump = validateDumpFields(req.files, fields);
            if (!dump) {
                throw new CustomError(STATUS_CODE.BAD_REQUEST, ERR_CODE.FIREBASE_UPLOAD_NEED_FILE);
            }

            const urls = await Promise.all(dump.map((file: FieldInfoMulter) => uploadFirebaseSingleImage(file.filename, file.buffer, file.mimetype)));
            
            // Create result
            const result: any = {};
            for (let i = 0; i < fields.length; i++) {
                result[fields[i].name] = [];
            }

            if (dump.length !== urls.length) {
                logger.error(`Something error, urls.length=${urls.length} can not mapping to dump.length=${dump.length}`)
            }

            for (let urlId = 0; urlId < urls.length; urlId++) {
                const url = urls[urlId];
                result[dump[urlId].originName].push(url);
            }
            res.locals.urls = result;
            next();
        }
        catch(e) {
            logger.error(e);
            next(e);
        }
    }
}