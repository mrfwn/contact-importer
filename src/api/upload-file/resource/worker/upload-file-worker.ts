import { join } from "path";
import { workerData, parentPort } from "worker_threads";
import { encodeValue, readLocalMulterFile, removeMulterTempFile } from "../functions/file";
import { insertContacts } from "../functions/file-io";
import { CsvRowCommon, FileInfo, FileUploadStatus, OperationError } from "../types";
import { CSVFileContextRules } from "../validations/validation-context";
import { validateCSVCellsValues } from "../validations/validation-field";


export const validateFile = (csvLines: CsvRowCommon[]): OperationError => {

  const cellsValuesErrors = validateCSVCellsValues(csvLines);

  const CSVFileContextRulesErrors = CSVFileContextRules(csvLines);


  const consolidateMessages = [
    ...cellsValuesErrors.map(value => value.messages),
    ...CSVFileContextRulesErrors.map(value => value.message)
  ].flat();
  const consolidateLines = [
    ...cellsValuesErrors.map(value => value.line),
    ...CSVFileContextRulesErrors.map(value => value.lines)
  ].flat()
  return { 
    contentError: cellsValuesErrors ?? [] ,
    contextError: CSVFileContextRulesErrors ?? [],
    consolidateMessages,
    consolidateLines: [...new Set(consolidateLines)]
  };
}



const filterCorrectLines = (csvLines: CsvRowCommon[], consolidateLines:  number[]): CsvRowCommon[] => {
    return csvLines.filter((_,index) => !consolidateLines.includes(index));
}

type FranchiseRegExp = {
  [T: string]: RegExp
}

const franchises: FranchiseRegExp = {
  electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
  maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
  dankort: /^(5019)\d+$/,
  interpayment: /^(636)\d+$/,
  unionpay: /^(62|88)\d+$/,
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/
}



const generateFranchineInLines = (csvLines: CsvRowCommon[]): (CsvRowCommon & { Franchise: string})[] => {
  const lines = [] as any;
  csvLines.forEach(line=>{
    for (let key in franchises){
      if(franchises[key].test(line.CreditCard)){
        const cryptoCreditCard = encodeValue(line.CreditCard);
        lines.push({...line, Franchise: key, CreditCard: cryptoCreditCard})
      }
    }
  })
  
  return lines;
}

export const updateInsertPercent = (operationId: string, percent: number) => {
  parentPort!.postMessage({ type: FileUploadStatus.Insert, operationId, percent });
};

export const emitFinishInsert = (
  operationId: string,
  rows: number,
  error?: any,
) => {
  parentPort!.postMessage({ type: FileUploadStatus.Completed, operationId, error, rows });
};

const uploadFile = async () => {
  const data: FileInfo = workerData;
  const operationId = data.id;
  const multerPath = data.filePath;
  const filePath = join(process.cwd(),multerPath);
  const csvLines = readLocalMulterFile(filePath);

  const { consolidateMessages,consolidateLines } = validateFile(csvLines);
  
  if (consolidateMessages.length>0) {
    parentPort!.postMessage({ type: FileUploadStatus.Error, operationId, consolidateMessages });
  }
  
  const csvFilterLines = filterCorrectLines(csvLines, consolidateLines);

  const csvLineWithFranchise = generateFranchineInLines(csvFilterLines)
  
  await insertContacts(csvLineWithFranchise,operationId, updateInsertPercent,emitFinishInsert);

  parentPort!.postMessage({ type: FileUploadStatus.Completed, operationId });

  removeMulterTempFile(filePath);

  parentPort?.close();
  return;
};

uploadFile();
