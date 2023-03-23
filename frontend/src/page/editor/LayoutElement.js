import React from 'react';
import { isEmptyObject } from '../../api/globalMethod';

const contentStyle = {
  fontSize: '24px',
  textAlign: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  height: '24px',
  cursor: 'pointer',
};

const removeStyle = {
  position: 'absolute',
  right: '2px',
  top: 0,
  cursor: 'pointer',
};

const LayoutElement = ({ props }) => {
  const { layout, setModalState, setLayoutState, layoutState } = props;

  // console.log(layout);

  const onCallModal = (layout, modalType) => {
    // setModalState({ ...modalState, opened: true, targetIndex: i });
    // console.log(layout);
    setModalState((oldState) => {
      oldState.opened = true;
      oldState.targetLayout = layout;
      oldState.modalType = modalType;
      return { ...oldState };
    });
  };

  const onRemoveItem = (i) => {
    // console.log(`removing ${i}`);
    setLayoutState((oldState) => {
      const layouts = oldState.layoutData.layouts.filter((element) => {
        return element.i !== i;
      });

      return { ...oldState, layoutData: { ...oldState.layoutData, layouts } };
    });
    // console.log(`deleted`);
  };

  /** @type {JSX.Element} */
  let element;

  // console.log(layout);
  switch (layout.contentType) {
    case 'image':
      element = (
        <div
          key={layout.i}
          data-grid={{ ...layout }}
          style={{
            backgroundImage:
              isEmptyObject(layout.contentData) || !layout.contentData.imageUrl
                ? ``
                : `url(${layout.contentData.imageUrl})`,
            backgroundSize: '100% 100%',
          }}
        >
          <span
            style={contentStyle}
            onClick={(e) => {
              onCallModal(layout, 'image');
            }}
          >
            {isEmptyObject(layout.contentData) ? (
              // 이미지 등록이 되어 있지 않으면 기본 카메라 이미지 로드
              <img
                style={contentStyle}
                src='https://img.icons8.com/ios/50/000000/camera--v3.png'
                alt='이미지를 등록해주세요'
              />
            ) : (
              ''
            )}
          </span>
          <span
            style={removeStyle}
            /* onClick={onRemoveItem.bind(this, layout.i)} */
            onClick={(e) => {
              onRemoveItem(layout.i);
            }}
            role='button'
            tabIndex={0}
          >
            X
          </span>
        </div>
      );

      break;
    case 'none':
    default:
      element = (
        <div key={layout.i} data-grid={{ ...layout }}>
          <span
            style={contentStyle}
            /* onClick={onCreateContent.bind(this, layout.i)} */
            onClick={(e) => {
              onCallModal(layout, 'creation');
            }}
            role='button'
            tabIndex={0}
          >
            +
          </span>
          <span
            style={removeStyle}
            /* onClick={onRemoveItem.bind(this, layout.i)} */
            onClick={(e) => {
              onRemoveItem(layout.i);
            }}
            role='button'
            tabIndex={0}
          >
            X
          </span>
        </div>
      );
      break;
  }

  return element;
};

export default LayoutElement;
