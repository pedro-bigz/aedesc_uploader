import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<any>) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      const fieldsWithError = error?.errors
        ?.map((error: any) => `${error.path.join('.')} - ${error.message}`)
        .join(', ');

      throw new BadRequestException(
        `O formulário apresenta um ou mais campos incorretos: ${fieldsWithError}`,
      );
    }
  }
}
