import React, { useState } from 'react';

import Modal from './EditorModal';

const Editor = () => {
  const [modalState, setModalState] = useState({
    open: false,
  });
  const handleClick = () => {
    setModalState({ ...modalState, open: true });
  };
  return (
    <div>
      {modalState.open ? <Modal props={{ modalState, setModalState }} /> : ''}
      <div>
        <h2>에디터 모드</h2>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button type='button' onClick={handleClick}>
          +
        </button>
        <p>+를 눌러 새로운 요소를 추가해주세요.</p>
      </div>
    </div>
  );
};

export default Editor;
