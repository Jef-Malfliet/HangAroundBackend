import * as activity from './modules/activity/model';
import * as person from './modules/person/model';
import * as role from './modules/role/model';

export type Models = typeof models;

const models = {
    activity,
    person,
    role
};

export default models;
