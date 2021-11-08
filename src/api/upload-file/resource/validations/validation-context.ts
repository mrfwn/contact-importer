import { CsvRowCommon, ErrorsContexts } from "../types"

export const CSVFileContextRules = (csvLines: CsvRowCommon[]): ErrorsContexts[]=> {
    
    const countLines = csvLines.reduce((acc,cur,index)=> {
        return {
            ...acc,
            [cur.Email] : acc[cur.Email] ? {
                email: cur.Email,
                lines: [...acc[cur.Email].lines,index],
                count: acc[cur.Email].count++
            }: {
                email: cur.Email,
                lines: [index],
                count: 1
            }
        }
    }, {} as  {[T: string]: {
        email: string,
        lines: number[],
        count: number
    }});
    const errors = [] as ErrorsContexts[];
    for(let value in countLines){
        if(countLines[value].count > 1){
            const { lines ,email} = countLines[value];
            const linesCSV = lines.map(x => x+2);
            errors.push({ 
                message: `Lines ${linesCSV.join()}: Duplicate email ${email}`,
                lines 
            })
        }
    }
    return errors
  }
  