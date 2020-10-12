import { PaginateModel, Document } from 'mongoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
