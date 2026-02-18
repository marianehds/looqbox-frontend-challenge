import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Tag, Spin, Row, Col, Typography, Image } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectSearchedPokemon,
  selectLoading,
} from "../../store/pokemon/selectors";
import { searchPokemonByName } from "../../store/pokemon/thunks";
import { imageNotFound } from "../../assets/const/imageNotFound";
import "./PokemonDetails.css";

const { Title, Text } = Typography;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP. ATK",
  "special-defense": "SP. DEF",
  speed: "SPD",
};

export function PokemonDetails() {
  const dispatch = useAppDispatch();
  const { name: nameParam } = useParams<{ name: string }>();
  const pokemon = useAppSelector(selectSearchedPokemon);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (nameParam && nameParam !== pokemon?.name) {
      dispatch(searchPokemonByName(nameParam));
    }
  }, [nameParam, dispatch, pokemon?.name]);

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
        <Text type="secondary">
          Use the back button to return to the home page
        </Text>
      </div>
    );
  }

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "";

  return (
    <div className="pokemon-details-container">
      <Row gutter={[32, 32]} justify="center" align="middle">
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pokemon-card"
            cover={
              <div className="pokemon-image-container">
                <Image
                  alt={pokemon.name}
                  src={imageUrl}
                  className="pokemon-image"
                  preview={false}
                  fallback={imageNotFound}
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

          <Card
            className="pokemon-info-card"
            title="Sprites"
            style={{ marginTop: 16 }}
          >
            <div className="pokemon-sprites">
              {!pokemon.sprites.front_default &&
              !pokemon.sprites.back_default ? (
                <span>No sprites available</span>
              ) : (
                <>
                  {pokemon.sprites.front_default && (
                    <Image
                      src={pokemon.sprites.front_default}
                      alt={`${pokemon.name} front`}
                      className="sprite"
                      draggable={false}
                      preview={false}
                    />
                  )}
                  {pokemon.sprites.back_default && (
                    <Image
                      src={pokemon.sprites.back_default}
                      alt={`${pokemon.name} back`}
                      className="sprite"
                      draggable={false}
                      preview={false}
                    />
                  )}
                </>
              )}
            </div>
          </Card>

          <Card
            className="pokemon-info-card"
            title="Status"
            style={{ marginTop: 16 }}
          >
            <div className="pokemon-status-container">
              {pokemon.stats.map((statItem) => {
                const statName =
                  STAT_LABELS[statItem.stat.name] ?? statItem.stat.name;
                const statValue = statItem.base_stat;

                return (
                  <div key={statItem.stat.name}>
                    <div className="pokemon-status-box">
                      <span>{statName}</span>
                      <span className="pokemon-stat-value">{statValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
