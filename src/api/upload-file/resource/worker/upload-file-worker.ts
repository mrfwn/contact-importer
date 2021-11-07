import { join } from "path";
import { workerData, parentPort } from "worker_threads";
import { readLocalMulterFile, removeMulterTempFile } from "../functions/file";
import { CsvRowCommon, FileInfo, FileUploadStatus } from "../types";
import { CSVFileContextRules } from "../validations/validation-context";
import { validateCSVCellsValues } from "../validations/validation-field";

type OperationError = {
  contentError: string[];
  contextError: string[]
}

export const validateFile = (csvLines: CsvRowCommon[]): OperationError => {

  const { error: cellsValuesErrors } = validateCSVCellsValues(csvLines);

  const { error: CSVFileContextRulesErrors } = CSVFileContextRules(csvLines);

  return { 
    contentError: cellsValuesErrors ?? [] ,
    contextError: CSVFileContextRulesErrors ?? []
  };
}

const uploadFile = async () => {
  const data: FileInfo = workerData;
  const operationId = data.id;
  const multerPath = data.filePath;
  const filePath = join(process.cwd(),multerPath);
  const csvLines = readLocalMulterFile(filePath);

  const { contentError, contextError } = validateFile(csvLines);

  /*
  if (error) {
    parentPort!.postMessage({ type: FileUploadStatus.Error, operationId, error });
    parentPort?.close();
    return;
  }*/
  
  parentPort!.postMessage({ type: FileUploadStatus.ValidatedUpload, operationId });

  //await saveCSVFile(filePath, data.productVersion, data.productName, data.blobId);

  parentPort!.postMessage({ type: FileUploadStatus.Completed, operationId });

  removeMulterTempFile(filePath);

  parentPort?.close();
  return;
};

uploadFile();
