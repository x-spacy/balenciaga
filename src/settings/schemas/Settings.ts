import { Expose } from 'class-transformer';

export class Settings {
  @Expose({ name: 'name' })
  public readonly name: string;

  @Expose({ name: 'value' })
  public readonly value: string;
}
