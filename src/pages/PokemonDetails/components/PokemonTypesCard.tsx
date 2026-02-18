import { Card, Tag } from "antd";
import type { Pokemon } from "../../../store/pokemon/types";

type Props = {
  pokemon: Pokemon;
};

export function PokemonTypesCard({ pokemon }: Props) {
  return (
    <Card className="pokemon-info-card" title="Types" style={{ marginTop: 16 }}>
      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => (
          <Tag key={typeInfo.type.name} className={`type-tag type-${typeInfo.type.name}`}>
            {typeInfo.type.name.toUpperCase()}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
