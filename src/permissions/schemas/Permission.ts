import { Expose, Type } from 'class-transformer';

export class Permission {
  @Expose({ name: 'id' })
  public readonly id: string;

  @Expose({ name: 'userId' })
  public readonly userId: string;

  @Expose({ name: 'name' })
  public readonly name: string;

  @Type(() => Date)
  @Expose({ name: 'createdAt' })
  public readonly createdAt: Date;

  @Type(() => Date)
  @Expose({ name: 'updatedAt' })
  public readonly updatedAt: Date;
}
