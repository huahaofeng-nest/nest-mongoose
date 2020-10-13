import { Provider } from '@nestjs/common';
import { TypegooseClass } from './interfaces/typegoose.class';
import { Connection } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { modelToken, NEST_MONGOOSE_CONNECTION } from './nest-mongoose.constants';


// 根据 Class 获取 Provider
export function getProviderByTypegooseClass(clazz: TypegooseClass): Provider {
  return {
    provide: modelToken(clazz),
    useFactory: (connection: Connection) => {
      return getModelForClass(clazz, { existingConnection: connection });
    },
    inject: [NEST_MONGOOSE_CONNECTION]
  }
}
