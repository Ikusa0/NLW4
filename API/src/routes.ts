import {Router} from "express";
import {UserController} from "./controller/UserController";
import {SurveyController} from "./controller/SurveyController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

export {router};