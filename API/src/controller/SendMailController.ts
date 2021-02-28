import {Request, Response} from "express";
import {resolve} from 'path';
import {UserRepository} from "../repositories/UserRepository";
import {getCustomRepository} from "typeorm";
import {SurveyRepository} from "../repositories/SurveyRepository";
import {SurveyUserRepository} from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";
import {AppError} from "../../errors/AppError";

class SendMailController {

    async execute(request: Request, response: Response) {

        const {email, survey_id} = request.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await userRepository.findOne({email});
        if (!user) {
            throw new AppError("User does not exist.");
        }

        const survey = await surveyRepository.findOne({id: survey_id});
        if (!survey) {
            throw new AppError("Survey does not exist.");
        }

        const surveyUserAlreadyExist = await surveyUserRepository.findOne({
            where: {user_id: user.id, survey_id: survey.id},
            relations: ["user", "survey"]
        })

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExist) {
            variables.id = surveyUserAlreadyExist.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExist);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        });
        await surveyUserRepository.save(surveyUser);
        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }

}

export {SendMailController};