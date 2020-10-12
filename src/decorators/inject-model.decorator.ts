import { TypegooseClass } from '../interfaces/typegoose.class';
import { modelToken } from '../nest-mongoose.constants';
import { Inject } from '@nestjs/common';

export function InjectModel(clazz: TypegooseClass) {
  return Inject(modelToken(clazz.name));
}
