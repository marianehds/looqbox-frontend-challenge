import { Card, Divider, Spin, Tag, Typography } from "antd";
import type { Pokemon } from "../../../store/pokemon/types";

const { Text } = Typography;

export type SpeciesDetails = {
  loading: boolean;
  flavorText: string | null;
  genus: string | null;
  habitat: string | null;
  growthRate: string | null;
  captureRate: number | null;
};

type Props = {
  pokemon: Pokemon;
  speciesDetails: SpeciesDetails;
};

export function PokemonAboutCard({ pokemon, speciesDetails }: Props) {
  const { loading, flavorText, genus, habitat, growthRate, captureRate } = speciesDetails;
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const heightM = (pokemon.height / 10).toFixed(1);

  return (
    <Card className="pokemon-info-card" title="About" style={{ marginTop: 16 }}>
      {loading ? (
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
  );
}
