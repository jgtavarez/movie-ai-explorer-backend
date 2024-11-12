import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export interface CurrentUserType {
  id: string;
}

export const CurrentUser = createParamDecorator((context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: CurrentUserType = request.user;

  if (!user) {
    throw new InternalServerErrorException(
      `No user inside the request, use @AuthGuard`,
    );
  }

  throw new ForbiddenException();
});
