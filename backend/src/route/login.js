const router = require('express').Router();
const passport = require('passport');

const { isReCaptchaVerified } = require('../api/reCaptcha');
const { serverDomain } = require('../api/serverOptions');
const memberModel = require('../model/member');
const memberData = { memberId: 'juno', memberPassword: 'qwe123' };

router.get('/', (req, res) => {
  res.send('get login');
});

router.post('/', async (req, res) => {
  // console.log({ loginRoute: 'entered' });
  const body = req.body;
  console.log(body);
  if (
    body.reCaptchaToken === undefined ||
    body.reCaptchaToken === '' ||
    body.reCaptchaToken === null
  ) {
    return res.json({ responseError: 'something goes to wrong' });
  }

  const reCaptchaResult = await isReCaptchaVerified(body.reCaptchaToken);
  //const reCaptchaResult = false;
  if (!reCaptchaResult) {
    return res.json({ reCaptchaResult });
  }

  // !! 로그인 기능 구현 220126

  if (
    body.memberId !== memberData.memberId ||
    body.memberPassword !== memberData.memberPassword
  ) {
    return res.json({ reCaptchaResult, loginResult: false });
  }
  return res.json({ reCaptchaResult, loginResult: true });
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', async (err, profile) => {
    if (err) {
      console.log(err);
      throw err;
    }
    // console.log(profile);

    let mysqlPromise = Promise.resolve(true);

    let memberData = await memberModel.findOne({
      med_email: profile.emails[0].value,
    });

    // 해당 메일로 생성된 계정이 없는 경우
    if (memberData === undefined) {
      mysqlPromise = memberModel.insertOne({
        med_email: profile.emails[0].value,
        med_member_name: profile.displayName,
        med_provider: profile.provider,
        med_provided_id: profile.id,
        med_register_ip: req.ip,
        med_lastlogin_ip: req.ip,
        med_cmm_remote_ip: req.ip,
        med_cmm_admin_id: 'juno',
      });
    }
    // 생성된 계정이 있을 경우
    else {
      // 처음 OAuth로 로그인하는 계정
      if (!memberData.med_provided_id) {
        mysqlPromise = memberModel.update(
          { med_no: memberData.med_no },
          {
            med_provider: profile.provider,
            med_provided_id: profile.id,
          }
        );
      } else if (memberData.med_provided_id !== profile.id) {
        // 유효하지 않은 아이디
        // console.log('not matched id');
        res.redirect('https://localhost:5000/login');
        return;
      }
    }

    const upsertResult = await mysqlPromise;

    if (!upsertResult) {
      // update or insert 실패
      res.redirect('https://localhost:5000/login');
      return;
    }

    /** !! access 토큰 refresh 토큰 만들기 */
    res.setHeader(
      'Set-Cookie',
      `TEST=test; Max-Age=${60 * 60 * 24}; Domain=${
        process.env.NODE_ENV === 'development' ? 'localhost' : 'api.4by4.kr'
      }; Path=/login/auth; SameSite=None; Secure; HttpOnly`
    );
    res.redirect('https://localhost:5000');
  })(req, res, next);
});

router.get('/auth', (req, res) => {
  return res.send('hi');
});

module.exports = router;
