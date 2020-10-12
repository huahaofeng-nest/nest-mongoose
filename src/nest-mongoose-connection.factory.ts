import { Inject, Injectable, Optional } from '@nestjs/common';
import { connect, connection, ConnectionOptions } from 'mongoose';
import { getLogger, Logger } from 'log4js';
import { NestMongooseOptions } from './interfaces/nest-mongoose-options.interface';
import { NEST_MONGOOSE_OPTIONS } from './nest-mongoose.constants';

const DEFAULT_OPTIONS = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  promiseLibrary: global.Promise,
};

@Injectable()
export class NestMongooseConnectionFactory {
  private readonly uris: string;
  private readonly options?: ConnectionOptions;
  private readonly logger?: Logger;
  private readonly mailer?: any;

  constructor(
    @Inject(NEST_MONGOOSE_OPTIONS) mongooseOptions: NestMongooseOptions,
    @Optional() @Inject('NEST_MAILER') mailer?: any,
  ) {
    this.uris = mongooseOptions.uris;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...mongooseOptions.options,
    };
    this.logger = mongooseOptions.logger || getLogger('NestMongooseConnectionFactory');
    this.mailer = mailer;
  }

  async create() {
    connection.on('connecting', () => {
      this.logger.info('数据库连接中...');
    });

    connection.on('open', () => {
      this.logger.info('数据库连接成功！');
    });

    connection.on('disconnected', () => {
      this.logger.error(`数据库失去连接！`);
      this.sendMail('数据库失去连接！');
    });

    connection.on('error', error => {
      this.logger.error('数据库发生异常！', error);
      this.sendMail(String(error));
    });

    connection.on('reconnected', () => {
      this.logger.info('数据库重连成功！');
    });

    connection.on('reconnectFailed', () => {
      this.logger.info('数据库重连失败！');
    });

    return await connect(this.uris, this.options);
  }

  // 发送告警邮件
  sendMail(error: string) {
    try {
      if (this.mailer) {
        const from = this.mailer.options?.defaults?.from;
        const to = this.mailer.options?.defaults?.to;
        this.logger.info(`send mail from [${from}] to [${to}]`);
        if (from && to) {
          this.mailer.sendMail({
            subject: `数据库发生异常！`,
            text: error,
            html: `<pre><code>${error}</code></pre>`,
          });
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  };

}
