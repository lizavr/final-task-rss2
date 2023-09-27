import { handleApiError } from '../src/components/api/apiErrorHandler';
import { HttpErrorType, HttpStatusCodes } from '../src/types/types';
import { showErrorToast } from '../src/utils/toastUtils';

jest.mock('../src/utils/toastUtils', () => ({
  showErrorToast: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handleApiError', () => {
  it('should handle BAD_REQUEST', () => {
    handleApiError({ statusCode: HttpStatusCodes.BAD_REQUEST } as HttpErrorType);
    expect(showErrorToast).toHaveBeenCalledWith('Invalid request. Please check the provided data and try again.');
  });

  it('should handle FORBIDDEN', () => {
    handleApiError({ statusCode: HttpStatusCodes.FORBIDDEN } as HttpErrorType);
    expect(showErrorToast).toHaveBeenCalledWith(`You don’t have permission to access this resource`);
  });

  it('should handle CONFLICT', () => {
    handleApiError({ statusCode: HttpStatusCodes.CONFLICT } as HttpErrorType);
    expect(showErrorToast).toHaveBeenCalledWith('There was an error. Please, try again later');
  });

  it('should handle CONTENT_TOO_LARGE', () => {
    handleApiError({ statusCode: HttpStatusCodes.CONTENT_TOO_LARGE } as HttpErrorType);
    expect(showErrorToast).toHaveBeenCalledWith(
      'The request could not be completed because the request entity is too large.'
    );
  });

  ['BAD_GATEWAY', 'INTERNAL_SERVER_ERROR', 'SERVICE_UNAVAILABLE'].forEach((codeName) => {
    it(`should handle ${codeName}`, () => {
      const code = codeName as keyof typeof HttpStatusCodes;
      handleApiError({ statusCode: HttpStatusCodes[code] } as HttpErrorType);
      expect(showErrorToast).toHaveBeenCalledWith('Something went wrong. Please, try again later');
    });
  });
});
