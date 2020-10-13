import { TypegooseClass } from './interfaces/typegoose.class';

export const NEST_MONGOOSE = 'NEST_MONGOOSE';
export const NEST_MONGOOSE_OPTIONS = 'NEST_MONGOOSE_OPTIONS';
export const NEST_MONGOOSE_CONNECTION = 'NEST_MONGOOSE_CONNECTION';

export const modelToken = (clazz: TypegooseClass): string => `${clazz.name}Model`;
