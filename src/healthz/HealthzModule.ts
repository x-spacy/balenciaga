import { Module } from '@nestjs/common';

import { HealthzController } from '@x-spacy/nest-template/healthz/controllers/http/HealthzController';

@Module({
  controllers: [
    HealthzController
  ]
})
export class HealthzModule {}
