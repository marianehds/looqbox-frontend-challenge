import { Card, Typography, Image } from "antd";
import type { Pokemon } from "../../../store/pokemon/types";
import { imageNotFound } from "../../../assets/const/imageNotFound";

const { Title, Text } = Typography;

type Props = {
  pokemon: Pokemon;
};

export function PokemonHeroCard({ pokemon }: Props) {
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "";

  return (
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
  );
}
