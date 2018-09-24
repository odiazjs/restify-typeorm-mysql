import { CustomerController } from './customerController';
import { HealthCheckController } from './healthcheckController';
import { IController } from './controllerInterface';

export const controllers: Array<IController<any>> = [
    new CustomerController(),
    new HealthCheckController()
];