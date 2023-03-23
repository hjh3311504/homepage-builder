import { serverDomain } from '../../api/privateOptions';

const Element = ({ props }) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <label htmlFor="id">
            <input
              id="id"
              type="text"
              value={props.memberId}
              required
              onChange={(e) => {
                props.setMemberId(e.target.value);
              }}
            />{' '}
            아이디
          </label>
        </div>
        <div>
          <label htmlFor="password">
            <input
              id="password"
              type="password"
              value={props.memberPassword}
              required
              onChange={(e) => {
                props.setMemberPassword(e.target.value);
              }}
            />{' '}
            비밀번호
          </label>
        </div>
        <p />
        <button type="submit">로그인</button>
        {'  '}
        <a href={`${serverDomain}/login/google`}>구글 로그인</a>
      </form>
      <p />
    </div>
  );
};

export default Element;
