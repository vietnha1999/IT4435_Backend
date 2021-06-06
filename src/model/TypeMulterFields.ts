export interface OneMulterField {
    name: string,
    maxCount: number,
    outputName: "uuid" | "increment" | Array<string>
};

export interface FieldInfoMulter {
    buffer: any,
    mimetype: string,
    filename: string,
    originName: string
}

// export declare type TypeMulterFields = Array<OneMulterField>;