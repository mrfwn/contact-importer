import { Request, Response } from 'express';
import moment from 'moment';
import { DatabaseError } from '../../middlewares/error';
import db from '../database/db-connection';

export const getAllFiles = async ({ items = 20 , page = 1 }) => {
    const query = `select 
            b.originalname,
            b.errors,
            b.size,
            b.status,
            b.started_at,
            b.finished_at,
            u.email 
            from batch_execution_status as b
            join users as u on u.id = b.id_author
            order by b.id desc limit $1 offset $2`
    try{
        const { rows } = await db.query(query,[
            items,
            (page - 1) * items
        ])
        return rows
    }catch(err){
        throw new DatabaseError(err.message)
    }
}

export const countLinesGetAllFiles = async (): Promise<number> => {
    const query = 'select count(id) as "numberOfLines" from batch_execution_status';
    try{
        const { rows } = await db.query(query)
        return rows[0].numberOfLines;
    }catch(err){
        throw new DatabaseError(err.message)
    }
}

const formatContacts = (files) => {
    return files.map(line => {
        return {
            fileName: line.originalname,
            author: line.email,
            errors: line.errors ?? [],
            size: line.size,
            status: line.status,
            started_at: moment(line.started_at).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            finished_at: moment(line.finished_at).format("dddd, MMMM Do YYYY, h:mm:ss a")
        }
    })
}
export const getAllFilesController = async (request: Request, response: Response): Promise<void> => {
    const params = request.query;

    const files = await getAllFiles(params);
    
    const formatedFiles = formatContacts(files)
    const numberOflines = await countLinesGetAllFiles();

    const pages = numberOflines / Number.parseInt(params.items as never ?? 20, 10);

    response.json({ 
        status: 'success', 
        data:{
            items: formatedFiles,
            totalItems: Number.parseInt(`${numberOflines}`, 10), 
            pages: Math.ceil(pages)
        }
    });
}