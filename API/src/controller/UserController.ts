import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import {SurveyRepository} from "../repositories/SurveyRepository";

class UserController {

    async create(request: Request, response: Response) {
        const {name, email} = request.body;

        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExist = await userRepository.findOne({
            email
        });

        if (userAlreadyExist) {
            return response.status(400).json({
                error: "This e-mail is already in use."
            })
        }

        const user = userRepository.create({
            name, email
        });

        await userRepository.save(user);

        return response.status(201).json(user);
    }
}

export {UserController};