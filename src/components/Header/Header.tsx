import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isDetailsPage = location.pathname.startsWith("/pokemon/");
  const handleGoBack = () => {
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
