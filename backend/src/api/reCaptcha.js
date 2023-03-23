const axios = require('axios').default;
const { verificationURL } = require('../api/serverOptions');

exports.isReCaptchaVerified = async (reCaptchaToken) => {
  try {
    const response = await axios.post(verificationURL + reCaptchaToken);

    if (
      response.data.success === undefined ||
      !response.data.success ||
      response.data.score <= 0.5
    ) {
      return false;
    }
    return true;
  } catch (isReCaptchaVerifiedError) {
    console.log({ isReCaptchaVerifiedError });
    throw isReCaptchaVerifiedError;
  }
};
