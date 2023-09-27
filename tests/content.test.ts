import { ApiClient } from '../src/components/api/client';
import { Content } from '../src/components/pageComponents/content/content';
import { Login } from '../src/components/pages/login/login';
import { Main } from '../src/components/pages/main/main';
import { NotFound } from '../src/components/pages/notFound/notFound';
import { ProductContent } from '../src/components/pages/product/product';
import { Registration } from '../src/components/pages/registration/registration';
import { PathObj } from '../src/types/types';

beforeEach(() => {
  const url = 'http://localhost';

  Reflect.deleteProperty(global.window, 'location');
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
    writable: true,
  });
});

describe('when we have a certain location', () => {
  it('content return content from corresponding page', () => {
    const arr = [
      {
        pathname: PathObj.mainPath,
        instance: Main,
      },
      {
        pathname: PathObj.loginPath,
        instance: Login,
      },
      {
        pathname: PathObj.registrationPath,
        instance: Registration,
      },
      {
        pathname: '/sldlk7677YUHMn',
        instance: NotFound,
      },
    ];

    arr.forEach((obj) => {
      window.location.pathname = obj.pathname;
      const content = new Content();

      expect(content.content instanceof obj.instance).toBe(true);
    });
  });
});
