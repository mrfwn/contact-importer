import Papa from "papaparse";
import { readFileSync, unlinkSync } from "fs";
import { CsvRowCommon, FileInfo, GetFileInfo, OperationTrackStatus } from "../types";

export const parseCsv = (csv: string) => {
    const { data } = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });
    return (data as CsvRowCommon[]) || [];
  };
  
  export const removeBomEncode = (str: string) => str.trim();
  
  export const readLocalMulterFile = (filePath: string): CsvRowCommon[] => {
    const uploadFile = readFileSync(filePath, { encoding: "utf8" });
    const fileString = removeBomEncode(uploadFile);
    const PapaResponse = parseCsv(fileString);
    return PapaResponse;
  };

  
  export const getFileInfo = ({
    requestFile,
    operationId,
    user
}: GetFileInfo): FileInfo => ({
        id: operationId,
        author: user.email,
        errors: null,
        size: `${requestFile.size}`,
        filePath: requestFile.path,
        filename: requestFile.filename.trim(),
        originalname: requestFile.originalname,
        started_at: new Date(),
        finished_at: null,
        status: OperationTrackStatus.OnHold,
        additional_data: { rows: 0 }
})

export const removeMulterTempFile = (filePath: string) => unlinkSync(filePath);