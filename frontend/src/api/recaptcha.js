/* global grecaptcha */

import { reCaptchaSiteKey, serverDomain } from './privateOptions';

export default async (url, callback) => {
  grecaptcha.ready(async () => {
    try {
      const reCaptchaToken = await grecaptcha.execute(reCaptchaSiteKey, {
        action: 'submit',
      });
      callback(reCaptchaToken, serverDomain + url);
    } catch (reCaptchaError) {
      console.log('reCaptchaError');
      throw reCaptchaError;
    }
  });
};
