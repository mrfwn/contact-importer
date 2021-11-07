export type CsvRowCommon = {
    Name: string;
    DataOfBirth: string;
    Phone: string;
    Address: string;
    CreditCard: string;
    Email: string;
}

export type FileUploadReport = {
    errors?: any | null;
    percent: number;
    status: FileUploadStatus;
};
  
export enum FileUploadStatus {
    Sent = "Sent",
    ValidatedUpload = "ValidatedUpload",
    ValidateInsert = "ValidateInsert",
    ValidatedInsert = "ValidatedInsert",
    Saved = "Saved",
    Insert = "Insert",
    NotExist = "NotExist",
    Completed = "Completed",
    Error = "Error"
}

export type RequestFile = {
    originalname: string;
    path: string;
    filename: string;
    size: number;
};

export type UploadTracker = {
    id: string;
    filePath: string;
    fileName: string;
    fileSize: number;
    userFileName: string;
    initDate: Date;
    user: string;
};

export enum OperationTrackStatus {
    OnHold = "OnHold",
    Processing = "Processing",
    Failed = "Failed",
    Terminated = "Terminated"
}