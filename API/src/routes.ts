import {Router} from "express";
import {UserController} from "./controller/UserController";
import {SurveyController} from "./controller/SurveyController";
import {SendMailController} from "./controller/SendMailController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMailController.execute);

export {router};