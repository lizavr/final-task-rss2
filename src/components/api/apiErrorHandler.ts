import { HttpErrorType, HttpStatusCodes } from '../../types/types';
import { showErrorToast } from '../../utils/toastUtils';

export function handleApiError(httpError: HttpErrorType) {
  switch (httpError.statusCode) {
    case HttpStatusCodes.BAD_REQUEST:
      showErrorToast('Invalid request. Please check the provided data and try again.');
      break;
    case HttpStatusCodes.UNAUTHORIZED:
      // TODO: redirect to login form
      break;
    case HttpStatusCodes.FORBIDDEN:
      showErrorToast('You don’t have permission to access this resource');
      break;
    case HttpStatusCodes.NOT_FOUND:
      // TODO: redirect to 404 page
      break;
    case HttpStatusCodes.CONFLICT:
      showErrorToast('There was an error. Please, try again later');
      break;
    case HttpStatusCodes.CONTENT_TOO_LARGE:
      showErrorToast('The request could not be completed because the request entity is too large.');
      break;
    case HttpStatusCodes.BAD_GATEWAY:
    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
    case HttpStatusCodes.SERVICE_UNAVAILABLE:
      showErrorToast('Something went wrong. Please, try again later');
      break;
    default:
      showErrorToast('An error occurred while processing your request. Please try again later.');
      break;
  }
}
