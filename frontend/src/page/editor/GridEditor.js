import React, { useState, useEffect, useCallback } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import axios from 'axios';

import EditorModal from './EditorModal';
import LayoutElement from './LayoutElement';
import { serverDomain } from '../../api/privateOptions';
import './styles.css';
import './example-styles.css';
import { postLayout } from './api';
import { getLayoutData } from './api';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const GridEditor = ({ props }) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [layoutState, setLayoutState] = useState({
    layoutData: {
      layouts: [],
      counter: 0,
    },
    breakpoint: 'lg',
    cols: 12,
    state: 'WAIT',
    currentId: '',
  });

  let keyDown = false;
  const handleKeyDown = (e) => {
    if (keyDown) return;

    let charCode = String.fromCharCode(e.which).toLowerCase();
    if (e.ctrlKey && charCode === 'z') {
      console.log('Ctrl + z');
      keyDown = true;
      getLayoutData('REDO').then((data) => {
        // console.log(data);
        if (data.dataLoadingResult) {
          /* 
            레이아웃 좌표를 변경하면 react-grid-layout이 알아먹지를 못한다~~
            내가 생각해낸 최선의 해결책
            레이아웃 삭제해서 없앤 다음에 다시 받아와서 새로 그린다.
            비효율적이지만 다른 방법은 없는듯하다
           */
          setLayoutState({
            ...layoutState,
            layoutData: { layouts: [], counter: 0 },
            currentId: data.layoutDataId,
            state: 'WAIT',
          });
          setLayoutState({
            ...layoutState,
            layoutData: data.layoutData,
            currentId: data.layoutDataId,
            state: 'REDO',
          });
        }
      });
    }
  };

  const handleKeyUp = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();
    if (e.ctrlKey && charCode === 'z') {
      // console.log('key up');
      keyDown = false;
    }
  };

  useEffect(() => {
    // 페이지 마운트 시에 저장된 레이아웃 데이터 로딩
    getLayoutData('GET')
      .then((data) => {
        // console.log('getData');
        if (data.dataLoadingResult) {
          setLayoutState({
            ...layoutState,
            layoutData: data.layoutData,
            state: 'GET',
          });
          // setMountState(true);
        } else {
          setLayoutState({ ...layoutState, state: 'DEFAULT' });
        }
      })
      .catch((err) => {
        if (err) console.error('layoutData loading failed error');
      });

    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
      document.removeEventListener('keyup', handleKeyUp, false);
    };
  }, []);

  const [modalState, setModalState] = useState({
    opened: false,
    targetLayout: {},
    modalType: '',
  });

  const layoutOptions = {
    className: 'layout',
    cols: props.cols || { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
    margin: [0, 0],
    compactType: null,
    resizeHandles: ['s', 'e', 'se'],
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    preventCollision: true,
    onBreakpointChange: (breakpoint, cols) => {
      // console.log('breakpointChange');
      setLayoutState({
        ...layoutState,
        breakpoint,
        cols,
      });
    },
    onLayoutChange: (changedLayouts, allLayouts) => {
      switch (layoutState.state) {
        case 'GET':
          console.log('get');
          setLayoutState({ ...layoutState, state: 'DEFAULT' });
          break;

        case 'WAIT':
          console.log('wait');
          setLayoutState({ ...layoutState, state: 'DEFAULT' });
          break;

        case 'REDO':
          console.log('redo');
          /* setLayoutState((oldState) => {
            return { ...oldState, state: 'DEFAULT' };
          }); */
          setLayoutState({ ...layoutState, state: 'DEFAULT' });

          break;

        case 'DEFAULT':
        default:
          console.log('default');
          const layouts = layoutState.layoutData.layouts.map(
            (element, index) => {
              if (element.i !== changedLayouts[index].i)
                throw new Error('unvalid index');

              element.x = changedLayouts[index].x;
              element.y = changedLayouts[index].y;
              element.w = changedLayouts[index].w;
              element.h = changedLayouts[index].h;
              return element;
            }
          );
          setLayoutState(
            {
              ...layoutState,
              layoutData: { ...layoutState.layoutData, layouts },
              state: 'DEFAULT',
            },
            postLayout(layoutState.layoutData)
          );
          break;
      }
    },
  };

  const onAddItem = (event) => {
    setLayoutState((oldState) => {
      const layouts = oldState.layoutData.layouts.concat({
        i: oldState.layoutData.counter.toString(),
        x: (oldState.layoutData.layouts.length * 2) % (oldState.cols || 12),
        y: 0,
        w: 2,
        h: 1,
        contentType: 'none',
        contentOptions: {},
        contentData: {},
      });
      const counter = oldState.layoutData.counter + 1;

      return { ...oldState, layoutData: { layouts, counter } };
    });

    // console.log(layoutState);
  };

  const stringifyLayout = () => {
    return layoutState.layoutData.layouts.map((l) => {
      const name = l.i === '__dropping-elem__' ? 'drop' : l.i;
      return (
        <div className='layoutItem' key={l.i}>
          <b>{name}</b>
          {`: [${l.x}, ${l.y}, ${l.w}, ${l.h}]`}
        </div>
      );
    });
  };

  console.log(layoutState.state);
  return (
    <div>
      <div className='layoutJSON'>
        <div className='columns'>{stringifyLayout()}</div>
      </div>
      <div>
        <button type='button' onClick={onAddItem}>
          Add item
        </button>
        <button
          type='button'
          onClick={(e) => {
            setLayoutState({
              ...layoutState,
              layoutData: { layouts: [], counter: 0 },
            });
          }}
        >
          Delete All
        </button>
        <button type='button' onClick={forceUpdate}>
          Re Render
        </button>
      </div>
      <ResponsiveReactGridLayout
        className={layoutOptions.className}
        cols={layoutOptions.cols}
        rowHeight={layoutOptions.rowHeight}
        onLayoutChange={layoutOptions.onLayoutChange}
        breakpoints={layoutOptions.breakpoints}
        onBreakpointChange={layoutOptions.onBreakpointChange}
        margin={layoutOptions.margin}
        resizeHandles={layoutOptions.resizeHandles}
        compactType={layoutOptions.compactType}
        preventCollision={layoutOptions.preventCollision}
      >
        {layoutState.layoutData.layouts.map((element) => {
          return LayoutElement({
            props: {
              layout: element,
              setModalState,
              setLayoutState,
              layoutState,
            },
          });
        })}
      </ResponsiveReactGridLayout>
      {modalState.opened ? (
        <EditorModal
          props={{ modalState, setModalState, layoutState, setLayoutState }}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default GridEditor;
