import { Module } from '@nestjs/common';

import { FindSettingsByNameService } from '@x-spacy/balenciaga/settings/services/FindSettingsByNameService';

import { SettingsCache } from '@x-spacy/balenciaga/settings/cache/SettingsCache';

@Module({
  providers: [
    {
      provide: 'FindSettingsByNameService',
      useClass: FindSettingsByNameService
    },
    {
      provide: 'SettingsCache',
      useClass: SettingsCache
    }
  ],
  exports: [
    'SettingsCache'
  ]
})
export class SettingsModule {}

