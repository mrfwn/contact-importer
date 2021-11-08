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



export type GetFileInfo = {
    requestFile: RequestFile,
    operationId: string,
    user: { id: number }
}

export type FileInfo = {
    id: string;
    author: number;
    errors: string[] | null;
    size: string;
    filePath: string;
    filename:string;
    originalname: string;
    started_at: Date;
    finished_at: Date | null;
    status: OperationTrackStatus;
    additional_data: { rows: number };
}


export type UploadFileWorkerResponseData = {
    type: FileUploadStatus;
    operationId: string;
    error?: any;
};

export type ErrorsContexts = {
    message: string, 
    lines: number[]
  }

  export type ErrorsFields = {
    messages: string[], 
    line: number
  }

  export type OperationError = {
    contentError: ErrorsFields[];
    contextError: ErrorsContexts[];
    consolidateMessages: string[];
    consolidateLines: number[];
  }