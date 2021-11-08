import { Request, Response } from 'express';
import moment from 'moment';
import { DatabaseError } from '../../middlewares/error';
import db from '../database/db-connection';
import { decodeValue } from '../upload-file/resource/functions/file';

export const getAllContacts = async ({ items = 20 , page = 1 }) => {
    const query = "select * from contacts order by id desc limit $1 offset $2"
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

export const countLinesGetAllContacts = async (): Promise<number> => {
    const query = 'select count(id) as "numberOfLines" from contacts';
    try{
        const { rows } = await db.query(query)
        return rows[0].numberOfLines;
    }catch(err){
        throw new DatabaseError(err.message)
    }
}


const formatCreditCard = (credit_card) =>  {
    const realNumber = decodeValue(credit_card);
    return realNumber.substring(0,realNumber.length-4).replace(/\d/g,'*')+ realNumber.substring(realNumber.length-4);
}

const formatContacts = (contacts) => {
    return contacts.map(line => {
        const dateOfBirth =  moment(line.date_of_birth).format("YYYY MMMM D");
        const creditCard = formatCreditCard(line.credit_card);
        return {
            name: line.name,
            dateOfBirth,
            phone: line.phone,
            creditCard,
            franchise: line.franchise,
            email: line.email,
            address: line.address
        }
    })
}
export const getAllContactsController = async (request: Request, response: Response): Promise<void> => {
    const params = request.query;
    
    const contacts = await getAllContacts(params);
    
    const formatedContacts = formatContacts(contacts)
    const numberOflines = await countLinesGetAllContacts();

    const pages = numberOflines / Number.parseInt(params.items as never ?? 20, 10);

    response.json({ 
        status: 'success', 
        data:{
            items: formatedContacts,
            totalItems: Number.parseInt(`${numberOflines}`, 10), 
            pages: Math.ceil(pages)
        }
    });
}