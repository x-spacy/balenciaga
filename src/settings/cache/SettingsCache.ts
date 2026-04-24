import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { FindSettingsByNameService } from '@x-spacy/balenciaga/settings/services/FindSettingsByNameService';

import { Settings } from '@x-spacy/balenciaga/settings/schemas/Settings';

import { SettingsNotFoundException } from '@x-spacy/balenciaga/settings/exceptions/SettingsNotFoundException';

@Injectable()
export class SettingsCache {
  @Inject(CACHE_MANAGER)
  private readonly cache: Cache;

  @Inject('FindSettingsByNameService')
  private readonly findSettingsByNameService: FindSettingsByNameService;

  public async get(name: string) {
    let settings = await this.cache.get<Settings>(name);

    if (settings) {
      return settings;
    }

    settings = await this.findSettingsByNameService.execute(name);

    if (!settings) {
      throw new SettingsNotFoundException();
    }

    return this.cache.set(name, settings, 15_000);
  }
}
