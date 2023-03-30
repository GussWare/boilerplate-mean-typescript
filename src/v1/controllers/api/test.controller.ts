import {Request, Response} from "express"
import HttpStatus from "http-status";
import FakerService from "../../services/faker/FakerService"

class TestController {

    async faker(_req: Request, res: Response) {
        await FakerService.make();

        res.status(HttpStatus.OK).json({
            "message" : "Datos generados"
        });
    }
}

export default new TestController();