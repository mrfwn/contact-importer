import { Request, Response } from 'express';
import Joi from "joi";
import { DatabaseError, ValidationError } from '../../middlewares/error';
import db from '../database/db-connection';
import { encodeValue } from '../upload-file/resource/functions/file';

export type RequestUser = {
    username: string;
    email: string;
    password: string;
}

const schemaCreateUser = Joi.object<RequestUser>().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


export const validationCreateUser = (inputBody: RequestUser) => {
    const validation = schemaCreateUser.validate(inputBody);
    if (validation.error) throw new ValidationError(validation.error.message);
}

export const checkIfUserExist = async (email: string) => {
    const query = 'select * from users where email = $1'
    try {
        const { rows } = await db.query(query,[email]);
        return rows;
    }catch(err){
        throw new DatabaseError(err.message);
    }
}

export const insertUser = async (user: RequestUser) => {
    try{
        const query = 'INSERT INTO users (email, username, password) VALUES ($1,$2,$3)'
        await db.query(query,[user.email,user.username,encodeValue(user.password)])
    }catch(err){
        throw new DatabaseError(err.message);
    }
}

export const createUserController = async (request: Request, response: Response) => {
    const inputBody = request.body as RequestUser;
    
    validationCreateUser(inputBody);

    const hasUser = await checkIfUserExist(inputBody.email);

    if(hasUser.length>0){
        throw new ValidationError('User already exist');
    }

    await insertUser(inputBody);

    response.json({ status: "success" , data:{}}) 
}