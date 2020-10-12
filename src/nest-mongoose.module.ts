import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NestMongooseOptions } from './interfaces/nest-mongoose-options.interface';
import { NEST_MONGOOSE_CONNECTION, NEST_MONGOOSE_OPTIONS } from './nest-mongoose.constants';
import { NestMongooseConnectionFactory } from './nest-mongoose-connection.factory';
import { getProviderByTypegooseClass } from './nest-mongoose.util';

@Module({})
export class NestMongooseModule {
  public static forRoot(options: NestMongooseOptions): DynamicModule {
    return this.register(options);
  }

  public static register(options: NestMongooseOptions): DynamicModule {
    const nestMongooseOptionsProvider: Provider = {
      provide: NEST_MONGOOSE_OPTIONS,
      useValue: options,
    };
    const nestMongooseConnectionProvider: Provider = {
      provide: NEST_MONGOOSE_CONNECTION,
      useFactory: async (factory: NestMongooseConnectionFactory) => {
        return await factory.create();
      },
      inject: [NestMongooseConnectionFactory]
    };
    const modelProviders = (options.classes || []).map(clazz => getProviderByTypegooseClass(clazz));
    return {
      module: NestMongooseModule,
      providers: [nestMongooseOptionsProvider, NestMongooseConnectionFactory, nestMongooseConnectionProvider, ...modelProviders],
      exports: [nestMongooseConnectionProvider, ...modelProviders]
    }
  }
}
