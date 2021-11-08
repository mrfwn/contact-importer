import { CsvRowCommon, ErrorsFields } from "../types";
import moment from 'moment';

const validateName = (name: string) => (/^[a-zA-Zà-úÀ-Ú +_.-]*$/i).test(name);
const validateData = (data: string) => moment(data, moment.ISO_8601).isValid(); 
const validatePhone = (phone: string) => (/^[(][\+][0-9]{2}[)][-\s\.][0-9]{3}[-\s\.][0-9]{3}[-\s\.][0-9]{2}[-\s\.][0-9]{2}([-\s\.][0-9]{2})?$/im).test(phone) 
const validNotEmpty  = (value: string)=> value.trim() !== '';
export const validateCSVCellsValues = (csvLines: CsvRowCommon[]): ErrorsFields[]=> {
    const errors = [] as ErrorsFields[];
    csvLines.forEach((line,index) => {
        const errorsLine: string[] = [];
        !validateName(line.Name) && errorsLine.push(`Line ${index+2}: Name contains invalid characters - ${line.Name}`);
        !validNotEmpty(line.Name) && errorsLine.push(`Line ${index+2}: Name was empty`);
        !validateData(line.DataOfBirth) && errorsLine.push(`Line ${index+2}: Birthday date is in an invalid format - ${line.DataOfBirth}`);
        !validNotEmpty(line.DataOfBirth) && errorsLine.push(`Line ${index+2}: Date Of Bith was empty`);
        !validatePhone(line.Phone) && errorsLine.push(`Line ${index+2}: Phone is in an invalid format - ${line.Phone}`);
        !validNotEmpty(line.Phone) && errorsLine.push(`Line ${index+2}: Phone was empty`);
        !validNotEmpty(line.Address) && errorsLine.push(`Line ${index+2}: Address was empty`);
        !validNotEmpty(line.CreditCard) && errorsLine.push(`Line ${index+2}: CreditCard was empty`);
        errorsLine.length>0 && errors.push({ messages: errorsLine, line: index });
    });
    return errors
  }
  
  