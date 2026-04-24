import { Module } from '@nestjs/common';

import { UserHasPermissionService } from '@x-spacy/balenciaga/permissions/services/UserHasPermissionService';

@Module({
  providers: [
    {
      provide: 'UserHasPermissionService',
      useClass: UserHasPermissionService
    }
  ],
  exports: [
    'UserHasPermissionService'
  ]
})
export class PermissionsModule {}
