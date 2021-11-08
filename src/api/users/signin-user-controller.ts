import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import Joi from 'joi';
import { AuthorizationError, ValidationError } from '../../middlewares/error';
import { decodeValue } from '../upload-file/resource/functions/file';
import { checkIfUserExist, RequestUser } from './create-user-controller';
import { APP_KEY } from '../../config/env';

const schemaSignIn = Joi.object<Omit<RequestUser,'username'>>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


export const validationSignIn = (inputBody: Omit<RequestUser,'username'>) => {
    const validation = schemaSignIn.validate(inputBody);
    if (validation.error) throw new ValidationError(validation.error.message);
}

export const signInController = async (request: Request, response: Response) => {
    const inputBody = request.body as Omit<RequestUser,'username'>

    validationSignIn(inputBody);

    const hasUser = await checkIfUserExist(inputBody.email);

    if(!hasUser.length){
        throw new AuthorizationError('Incorrect email/password combination.')
    }

    if(inputBody.password !== decodeValue(hasUser[0].password)){
        throw new AuthorizationError ('Incorrect email/password combination.')
    }
    const token = sign({}, APP_KEY ?? '', {
        subject: `${hasUser[0].id}`,
        expiresIn: '1d',
      });
    response.json({
        email: inputBody.email,
        token
    })
}