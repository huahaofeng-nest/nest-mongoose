import { ConnectionOptions } from 'mongoose';
import { TypegooseClass } from './typegoose.class';
import { Logger } from 'log4js';

export interface NestMongooseOptions {
  uris: string,
  options?: ConnectionOptions,
  classes?: TypegooseClass[],
  logger?: Logger
}
