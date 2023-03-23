import { Route, Routes } from 'react-router-dom';
import Editor from './page/editor/Editor';
import GridEditor from './page/editor/GridEditor';

import Home from './page/home/Home';
import Login from './page/login/Login';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/grideditor" element={<GridEditor props={{}} />} />
    </Routes>
  );
};

export default Routers;
