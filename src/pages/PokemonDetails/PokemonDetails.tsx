import { Button, Card, Tag, Spin, Row, Col, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectSearchedPokemon, selectLoading } from "../../store/pokemon/selectors";
import { clearSearch } from "../../store/pokemon/slice";
import "./PokemonDetails.css";

const { Title, Text } = Typography;

export function PokemonDetails() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pokemon = useAppSelector(selectSearchedPokemon);
  const loading = useAppSelector(selectLoading);

  const handleGoBack = () => {
    dispatch(clearSearch());
    navigate("/");
  };

  if (loading) {
    return (
      <div className="pokemon-details-loading">
        <Spin size="large" tip="Loading Pokémon..." />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="pokemon-details-empty">
        <Title level={3}>No Pokémon found</Title>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          Back to Home
        </Button>
      </div>
    );
  }

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "";

  return (
    <div className="pokemon-details-container">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleGoBack}
        className="back-button"
      >
        Back to Search
      </Button>

      <Row gutter={[32, 32]} justify="center" align="middle">
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pokemon-card"
            cover={
              <div className="pokemon-image-container">
                <img
                  alt={pokemon.name}
                  src={imageUrl}
                  className="pokemon-image"
                />
              </div>
            }
          >
            <Title level={2} className="pokemon-name">
              {pokemon.name.toUpperCase()}
            </Title>
            <Text type="secondary" className="pokemon-id">
              #{pokemon.id.toString().padStart(3, "0")}
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card className="pokemon-info-card" title="Types">
            <div className="pokemon-types">
              {pokemon.types.map((typeInfo) => (
                <Tag
                  key={typeInfo.type.name}
                  color="blue"
                  className={`type-tag type-${typeInfo.type.name}`}
                >
                  {typeInfo.type.name.toUpperCase()}
                </Tag>
              ))}
            </div>
          </Card>

          <Card className="pokemon-info-card" title="Sprites" style={{ marginTop: 16 }}>
            <div className="pokemon-sprites">
              {pokemon.sprites.front_default && (
                <img
                  src={pokemon.sprites.front_default}
                  alt={`${pokemon.name} front`}
                  className="sprite"
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
  