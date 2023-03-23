import { Link } from 'react-router-dom';

const liStyle = { float: 'left', padding: 10 };

const TopNavBar = () => {
  return (
    <div>
      <ul
        style={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <li style={liStyle}>
          <Link to="/">Home</Link>
        </li>

        <li style={liStyle}>
          <select defaultValue="20fts&w">
            <option value="20ftcafe">20ftcafe</option>
            <option value="20fts&w">20fts&w</option>
          </select>
        </li>
        <li style={liStyle}>
          <Link to="/login">Login</Link>
        </li>
        <li style={liStyle}>
          <Link to="/editor">Editor</Link>
        </li>
        <li style={liStyle}>
          <Link to="/editor/grideditor">Grid Editor</Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNavBar;
