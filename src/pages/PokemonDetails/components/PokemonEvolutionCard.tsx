import { Card, Spin, Typography } from "antd";

const { Text } = Typography;

type Props = {
  loading: boolean;
  evolutionNames: string[];
  currentPokemonName: string;
  onEvolutionClick: (pokemonName: string) => void;
};

export function PokemonEvolutionCard({
  loading,
  evolutionNames,
  currentPokemonName,
  onEvolutionClick,
}: Props) {
  return (
    <Card className="pokemon-info-card" title="Evolution Chain" style={{ marginTop: 16 }}>
      {loading ? (
        <div className="pokemon-subloading">
          <Spin size="small" />
        </div>
      ) : evolutionNames.length > 0 ? (
        <div className="pokemon-evolution-list">
          {evolutionNames.map((evolutionName) => (
            <button
              key={evolutionName}
              type="button"
              className={`evolution-chip ${evolutionName === currentPokemonName ? "evolution-chip--active" : ""}`}
              onClick={() => onEvolutionClick(evolutionName)}
            >
              {evolutionName}
            </button>
          ))}
        </div>
      ) : (
        <Text type="secondary">No evolution data available.</Text>
      )}
    </Card>
  );
}
