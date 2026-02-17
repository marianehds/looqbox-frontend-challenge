import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { clearSearch } from "../../store/pokemon/slice";
import "./Header.css";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isDetailsPage = location.pathname.startsWith("/pokemon/");

  const handleGoBack = () => {
    dispatch(clearSearch());
    navigate("/");
  };

  return (
    <header className="app-header">
      {isDetailsPage && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className="header-back-button"
        >
          Back
        </Button>
      )}
      <h1 className="pokedex-title">Pokédex</h1>
    </header>
  );
}
