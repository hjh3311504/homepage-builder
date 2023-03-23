import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Element from './Element';
import reCaptcha from '../../api/recaptcha';

const Login = () => {
  const [memberId, setMemberId] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    reCaptcha('/login', async (reCaptchaToken, url) => {
      try {
        const res = await fetch(`${url}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          method: 'POST',
          body: JSON.stringify({
            memberId,
            memberPassword,
            reCaptchaToken,
          }),
        });

        // server로부터 결과데이터 가져옴
        const body = await res.json();

        if (!body.reCaptchaResult) {
          alert('올바르지 않은 접근입니다.');
          setMemberId('');
          setMemberPassword('');
          return;
        }

        if (body.loginResult) {
          navigate('/');
        } else {
          alert('아이디 또는 비밀번호가 다릅니다.');
          setMemberId('');
          setMemberPassword('');
        }
      } catch (fetchError) {
        console.log('fetchError');
        throw fetchError;
      }
    });
  };

  const props = {
    memberId,
    setMemberId,
    memberPassword,
    setMemberPassword,
    handleSubmit,
  };

  return <Element props={props} />;
};

export default Login;
