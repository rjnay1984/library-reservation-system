import { describe, it, expect } from 'vitest';
import { paramsSchema } from './page-params-schema';

describe('PageParamsSchema', () => {
  it('should validate correct page parameters', () => {
    const validParams = { page: '1', perPage: '10' };

    const result = paramsSchema.parse(validParams);
    expect(result).toEqual({
      page: 1,
      perPage: 10,
    });
  });

  it('should correct invalid page parameters', () => {
    const invalidParams = { page: '-1', perPage: '0' };
    const result = paramsSchema.parse(invalidParams);
    expect(result).toEqual({
      page: 1,
      perPage: 20,
    });
  });

  it('should handle missing parameters', () => {
    const params = { perPage: '10' };
    const result = paramsSchema.parse(params);
    expect(result).toEqual({
      page: 1,
      perPage: 10,
    });
  });
});
