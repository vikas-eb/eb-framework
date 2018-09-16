import { config } from './config';

export const constants = {
    
    //3343 stands for EDGE :)

    API_URL: config.RUNNING_MODE === 'dev' ? 'http://localhost:3343' : 'http://benapi.lets-dev.com'
};

