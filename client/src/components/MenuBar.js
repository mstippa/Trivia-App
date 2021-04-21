import { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { authContext } from "../context/auth";
import { Link } from "react-router-dom";

function MenuBar() {
  const { logout, user } = useContext(authContext);

  const pathName = window.location.pathname;

  const path = pathName === "/" ? "home" : pathName.substring(1);

  const [activeItem, setActiveItem] = useState(path);

  const onClick = (event, { name }) => {
    setActiveItem(name);
  };

  return user ? (
    <Menu secondary>
      <Menu.Item
        name={user.username}
        active={activeItem === "home"}
        as={Link}
        to="/"
        size="massive"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="Leaderboard"
          as={Link}
          to="/leaderboard"
          onClick={onClick}
          active={activeItem === "Leaderboard"}
        />
        <Menu.Item name="Logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu secondary></Menu>
  );
}

export default MenuBar;
