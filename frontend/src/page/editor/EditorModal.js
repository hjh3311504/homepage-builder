// ! modalType에 따라 엘리먼트 구별해야함

import ReactModal from 'react-modal';

import { serverDomain } from '../../api/privateOptions';
import { isEmptyObject } from '../../api/globalMethod';
import { postLayout } from './api';
import axios from 'axios';

const EditorModal = ({ props }) => {
  const { modalState, setModalState, layoutState, setLayoutState } = props;

  const onClick = (contentType) => {
    switch (contentType) {
      case 'image':
        setLayoutState((oldState) => {
          let targetIndex = oldState.layoutData.layouts.findIndex(
            (element) => element.i === modalState.targetLayout.i
          );
          // console.log({ before: oldState.layouts[targetIndex] });
          oldState.layoutData.layouts[targetIndex] = {
            ...oldState.layoutData.layouts[targetIndex],
            contentType,
            contentOptions: {},
            contentData: {},
          };
          // console.log({ after: oldState.layouts[targetIndex] });
          setModalState({ opened: false, targetLayout: {}, contentType: '' });
          postLayout(oldState.layoutData);
          return { ...oldState };
        });
        break;
      default:
        break;
    }
  };

  const onChange = async (e) => {
    // console.log('input');
    // !! img 등록시 미리보기 기능 구현

    // console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append('edit_image', e.target.files[0]);

    const res = await axios.post(
      `${serverDomain}/cdn/images/upload`,
      formData,
      { credentials: 'include' }
    );

    // console.log(res);

    if (res.data.uploadResult) {
      (async () => {
        setLayoutState((oldState) => {
          const targetIndex = oldState.layoutData.layouts.findIndex(
            (element) => element.i === modalState.targetLayout.i
          );

          oldState.layoutData.layouts[targetIndex] = {
            ...oldState.layoutData.layouts[targetIndex],
            contentOptions: {},
            contentData: { imageUrl: res.data.imageUrl },
          };

          setModalState({
            ...modalState,
            targetLayout: oldState.layoutData.layouts[targetIndex],
          });

          return { ...oldState };
        });
      })().then(postLayout(layoutState.layoutData));
    }
  };

  /** @type {JSX.Element} */
  let element;

  switch (modalState.modalType) {
    case 'creation':
      element = (
        <div>
          <button
            type='button'
            onClick={(e) => {
              onClick('image');
            }}
          >
            이미지
          </button>
        </div>
      );
      break;
    case 'image':
      element = (
        <div>
          {isEmptyObject(modalState.targetLayout.contentData) ? (
            ''
          ) : (
            <>
              <img
                src={modalState.targetLayout.contentData.imageUrl}
                alt='등록된 이미지'
              />
              <p />
            </>
          )}
          <label htmlFor='image-upload' style={{ cursor: 'pointer' }}>
            이미지 업로드
          </label>
          <input
            id='image-upload'
            type='file'
            onChange={onChange}
            style={{ display: 'none' }}
          />
        </div>
      );
      break;
    default:
      break;
  }

  ReactModal.setAppElement('#root');
  return (
    <ReactModal isOpen={modalState.opened}>
      <span
        type='button'
        style={{
          position: 'absolute',
          right: '2px',
          top: 0,
          cursor: 'pointer',
        }}
        onClick={() => {
          setModalState({ ...modalState, opened: false });
        }}
      >
        X
      </span>
      {element}
    </ReactModal>
  );
};

export default EditorModal;
