import {
  Button,
  Carousel,
  Card,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Alert,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { slides } from "../../assets/images/slides";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchPokemonByName,
  fetchPokemonList,
} from "../../store/pokemon/thunks";
import { setSearchValue, setSearchType } from "../../store/pokemon/slice";
import {
  selectSearchValue,
  selectSearchType,
  selectLoading,
  selectError,
  selectSearchedPokemon,
  selectPokemonList,
} from "../../store/pokemon/selectors";
import "./Home.css";

const options: CheckboxGroupProps<string>["options"] = [
  { label: "Name", value: "Name" },
  { label: "Type", value: "Type", disabled: true },
  { label: "Species", value: "Species", disabled: true },
];

export function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchValue = useAppSelector(selectSearchValue);
  const searchType = useAppSelector(selectSearchType);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const searchedPokemon = useAppSelector(selectSearchedPokemon);
  const pokemonList = useAppSelector(selectPokemonList);

  useEffect(() => {
    dispatch(fetchPokemonList({ limit: 20, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (searchedPokemon && !loading) {
      navigate(`/pokemon/${searchedPokemon.name}`);
    }
  }, [searchedPokemon, loading, navigate]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    if (searchType === "Name") {
      dispatch(searchPokemonByName(searchValue));
    }
  };

  const handlePokemonClick = (pokemonName: string) => {
    dispatch(searchPokemonByName(pokemonName));
    navigate(`/pokemon/${pokemonName}`);
  };

  return (
    <>
      <Row
        justify="center"
        align="middle"
        className="home-row"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      >
        <Col span={6}>
          <Carousel autoplay dots={false} effect="fade" autoplaySpeed={4000}>
            {slides.map((slide, index) => (
              <div key={index}>
                <div className="carousel-content">
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="carousel-image"
                  />
                  <h2>{slide.name}</h2>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>

        <Col span={6}>
          <div className="search-container">
            <h3>Search by:</h3>

            <Input
              size="large"
              placeholder="Type Pokémon name"
              value={searchValue}
              onChange={(e) => dispatch(setSearchValue(e.target.value))}
              onPressEnter={handleSearch}
              disabled={loading}
            />

            <Divider variant="dashed" />

            <Radio.Group
              block
              options={options}
              value={searchType}
              onChange={(e) => dispatch(setSearchType(e.target.value))}
              optionType="button"
              disabled={loading}
            />

            <Divider variant="dashed" />

            <Button
              type="default"
              size="large"
              onClick={handleSearch}
              block
              loading={loading}
            >
              Start
            </Button>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginTop: "20px" }}
              />
            )}
          </div>
        </Col>
      </Row>

      <div>
        <h2 style={{ textAlign: "center" }}>Pokémon List</h2>

        {loading && pokemonList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} justify="center" className="pokemon-list-row">
            {pokemonList.map((pokemon) => (
              <Col xs={12} sm={8} md={6} lg={4} key={pokemon.name}>
                <Card
                  hoverable
                  onClick={() => handlePokemonClick(pokemon.name)}
                  cover={
                    <div>
                      <img
                        draggable={false}
                        alt={pokemon.name}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          pokemon.url.split("/")[6]
                        }.png`}
                        className="pokemon-list-image"
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={pokemon.name}
                    description={`#${pokemon.url.split("/")[6].padStart(3, "0")}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
