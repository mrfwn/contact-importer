import { getFileInfo } from "../../../src/api/upload-file/resource/functions/file"
import { GetFileInfo } from "../../../src/api/upload-file/resource/types"

describe('Upload File - Pure Functions Unit Test', ()=>{
    it('1) - Should be able return correct information for getFileInfo', ()=>{
        const requestTest: GetFileInfo = {
            requestFile: {
                originalname: 'test-originalname',
                path: 'test-path',
                filename: 'test-filename',
                size: 1000
            },
            operationId: 'test-operationId',
             user: { id: 1 }
        }

        const result = getFileInfo(requestTest);
        
        const expectedResult = {
           additional_data: {
             rows: 0,
           },
           author: 1,
           errors: null,
           filePath: "test-path",
           filename: "test-filename",
           finished_at: null,
           id: "test-operationId",
           originalname: "test-originalname",
           size: "1000",
           started_at: result.started_at,
           status: "OnHold",
        }

        expect(result).toEqual(expectedResult);
    })
})