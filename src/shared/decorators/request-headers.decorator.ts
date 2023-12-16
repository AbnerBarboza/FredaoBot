import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

export const RequestHeaders = createParamDecorator(
  async (property: string | number | symbol, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const value =
      typeof property === 'string'
        ? headers[property] || headers[property.toLowerCase()]
        : headers[property];

    if (value) return value;

    throw new BadRequestException(
      `Request header ${String(property)} was not present`,
    );
  },
);
