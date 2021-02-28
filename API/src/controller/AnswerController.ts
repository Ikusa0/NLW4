import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {SurveyUserRepository} from "../repositories/SurveyUserRepository";
import {AppError} from "../../errors/AppError";

class AnswerController {
    async execute(request: Request, response: Response) {
        const {value} = request.params;
        const {u} = request.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveyUserRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppError("SurveyUser does not exist.");
        }

        surveyUser.value = Number(value);

        await surveyUserRepository.save(surveyUser);

        return response.json(surveyUser);

    }
}

export {AnswerController};