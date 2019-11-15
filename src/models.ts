import * as activity from './modules/activity/model';
import * as person from './modules/person/model';

export type Models = typeof models;

const models = {
    activity,
    person
};

export default models;
