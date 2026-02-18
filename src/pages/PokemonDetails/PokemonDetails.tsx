import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tag, Spin, Row, Col, Typography, Image, Divider } from "antd";
import { Pie } from "@ant-design/charts";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectSearchedPokemon,
  selectLoading,
} from "../../store/pokemon/selectors";
import { searchPokemonByName } from "../../store/pokemon/thunks";
import { getEvolutionChain, getPokemonSpecies } from "../../services/pokeapi";
import { imageNotFound } from "../../assets/const/imageNotFound";
import type { EvolutionChainLink } from "../../store/pokemon/types";
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
  const navigate = useNavigate();
  const { name: nameParam } = useParams<{ name: string }>();
  const pokemon = useAppSelector(selectSearchedPokemon);
  const loading = useAppSelector(selectLoading);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [genus, setGenus] = useState<string | null>(null);
  const [habitat, setHabitat] = useState<string | null>(null);
  const [growthRate, setGrowthRate] = useState<string | null>(null);
  const [captureRate, setCaptureRate] = useState<number | null>(null);
  const [evolutionNames, setEvolutionNames] = useState<string[]>([]);

  useEffect(() => {
    if (nameParam && nameParam !== pokemon?.name) {
      dispatch(searchPokemonByName(nameParam));
    }
  }, [nameParam, dispatch, pokemon?.name]);

  useEffect(() => {
    const pokemonId = pokemon?.id;
    if (pokemonId === undefined) return;
    const currentPokemonId: number = pokemonId;

    let isCancelled = false;

    async function loadSpeciesData() {
      setSpeciesLoading(true);
      try {
        const species = await getPokemonSpecies(currentPokemonId);
        if (isCancelled) return;

        const englishFlavor = species.flavor_text_entries.find(
          (entry) => entry.language.name === "en",
        );
        const englishGenus = species.genera.find(
          (entry) => entry.language.name === "en",
        );

        setFlavorText(
          englishFlavor?.flavor_text.replace(/[\n\f]/g, " ") ??
            "No description available.",
        );
        setGenus(englishGenus?.genus ?? null);
        setHabitat(species.habitat?.name ?? null);
        setGrowthRate(species.growth_rate.name);
        setCaptureRate(species.capture_rate);

        const evolution = await getEvolutionChain(species.evolution_chain.url);
        if (isCancelled) return;

        const names: string[] = [];
        const walk = (node: EvolutionChainLink) => {
          names.push(node.species.name);
          node.evolves_to.forEach(walk);
        };
        walk(evolution.chain);
        setEvolutionNames(Array.from(new Set(names)));
      } catch {
        if (isCancelled) return;
        setFlavorText("No description available.");
        setGenus(null);
        setHabitat(null);
        setGrowthRate(null);
        setCaptureRate(null);
        setEvolutionNames([]);
      } finally {
        if (!isCancelled) {
          setSpeciesLoading(false);
        }
      }
    }

    loadSpeciesData();

    return () => {
      isCancelled = true;
    };
  }, [pokemon?.id]);

  if (loading) {
    return (
      <div className="pokemon-details-loading">
        <Spin size="large" />
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

  const statsPieData = pokemon.stats.map((s) => ({
    type: STAT_LABELS[s.stat.name] ?? s.stat.name,
    value: s.base_stat,
  }));

  const statsPieConfig = {
    data: statsPieData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    innerRadius: 0.6,
    height: 240,
    legend: {
      position: "bottom",
    },
    label: {
      text: (datum: { value: number }) => `${datum.value}`,
      position: "outside",
      style: {
        fontSize: 11,
        fontWeight: 700,
      },
    },
    tooltip: {
      items: [
        (datum: { type: string; value: number }) => ({
          name: datum.type,
          value: datum.value,
        }),
      ],
    },

    interactions: [{ type: "element-active" }],
  };

  const weightKg = (pokemon.weight / 10).toFixed(1);
  const heightM = (pokemon.height / 10).toFixed(1);

  const handleEvolutionClick = (pokemonName: string) => {
    navigate(`/pokemon/${pokemonName}`);
  };

  return (
    <div className="pokemon-details-container">
      <Row align="middle" className="pokemon-details-row">
        <Col>
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
          <Card
            className="pokemon-info-card"
            title="About"
            style={{ marginTop: 16 }}
          >
            {speciesLoading ? (
              <div className="pokemon-subloading">
                <Spin size="small" />
              </div>
            ) : (
              <div className="pokemon-about-grid">
                <div className="pokemon-about-item">
                  <span>Height</span>
                  <strong>{heightM} m</strong>
                </div>
                <div className="pokemon-about-item">
                  <span>Weight</span>
                  <strong>{weightKg} kg</strong>
                </div>
                <div className="pokemon-about-item">
                  <span>Base Exp</span>
                  <strong>{pokemon.base_experience}</strong>
                </div>
                <div className="pokemon-about-item">
                  <span>Capture Rate</span>
                  <strong>{captureRate ?? "-"}</strong>
                </div>
                <div className="pokemon-about-item">
                  <span>Habitat</span>
                  <strong>{habitat ?? "-"}</strong>
                </div>
                <div className="pokemon-about-item">
                  <span>Growth Rate</span>
                  <strong>{growthRate ?? "-"}</strong>
                </div>
                {genus && (
                  <div className="pokemon-about-item pokemon-about-item--full">
                    <span>Genus</span>
                    <strong>{genus}</strong>
                  </div>
                )}
              </div>
            )}

            <Divider style={{ margin: "12px 0" }} />
            <Text className="pokemon-flavor-text">{flavorText}</Text>

            <Divider style={{ margin: "12px 0" }} />
            <div className="pokemon-abilities">
              {pokemon.abilities.map((ability) => (
                <Tag key={ability.ability.name} className="ability-tag">
                  {ability.ability.name.toUpperCase()}
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
        </Col>
        <Col>
          <Card
            className="pokemon-info-card"
            title="Evolution Chain"
            style={{ marginTop: 16 }}
          >
            {speciesLoading ? (
              <div className="pokemon-subloading">
                <Spin size="small" />
              </div>
            ) : evolutionNames.length > 0 ? (
              <div className="pokemon-evolution-list">
                {evolutionNames.map((evolutionName) => (
                  <button
                    key={evolutionName}
                    type="button"
                    className={`evolution-chip ${evolutionName === pokemon.name ? "evolution-chip--active" : ""}`}
                    onClick={() => handleEvolutionClick(evolutionName)}
                  >
                    {evolutionName}
                  </button>
                ))}
              </div>
            ) : (
              <Text type="secondary">No evolution data available.</Text>
            )}
          </Card>
          <Card
            className="pokemon-info-card"
            title="Types"
            style={{ marginTop: 16 }}
          >
            <div className="pokemon-types">
              {pokemon.types.map((typeInfo) => (
                <Tag
                  key={typeInfo.type.name}
                  className={`type-tag type-${typeInfo.type.name}`}
                >
                  {typeInfo.type.name.toUpperCase()}
                </Tag>
              ))}
            </div>
          </Card>
          <Card
            className="pokemon-info-card"
            title="Status"
            style={{ marginTop: 16 }}
          >
            <Pie {...statsPieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
