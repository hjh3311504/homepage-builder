import { serverDomain } from '../../api/privateOptions';
import axios from 'axios';

export const postLayout = (layoutData, action = 'POST', currentId = '') => {
  let restUrl;
  switch (action) {
    case 'POST':
      restUrl = '/layout';
      break;

    case 'REDO':
      restUrl = '/layout/redo';
      break;

    default:
      break;
  }

  axios.post(
    `${serverDomain}${restUrl}`,
    { layoutData },
    {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      credentials: 'include',
    }
  );
  /* .then(console.log('postLayout success')); */
};

export const getLayoutData = async (action) => {
  let restUrl;

  switch (action) {
    case 'GET':
      restUrl = '/layout';
      break;

    default:
      break;
  }

  const res = await axios(`${serverDomain}${restUrl}`);
  // console.log(res);

  return res.data;
};
