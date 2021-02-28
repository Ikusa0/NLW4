import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import * as yup from 'yup';
import {AppError} from "../../errors/AppError";

class UserController {

    async create(request: Request, response: Response) {
        const {name, email} = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        try {
            await schema.validate(request.body, {abortEarly: false});
        } catch (err) {
            throw new AppError(err);
        }

        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExist = await userRepository.findOne({
            email
        });

        if (userAlreadyExist) {
            throw new AppError("This e-mail is already in use.");
        }

        const user = userRepository.create({
            name, email
        });

        await userRepository.save(user);

        return response.status(201).json(user);
    }
}

export {UserController};