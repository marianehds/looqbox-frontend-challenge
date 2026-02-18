import {
  Button,
  Carousel,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Alert,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { slides } from "../../assets/images/slides";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchPokemonByName,
  fetchPokemonList,
  fetchPokemonByType,
} from "../../store/pokemon/thunks";
import { setSearchValue, clearTypeFilter } from "../../store/pokemon/slice";
import {
  selectSearchValue,
  selectLoading,
  selectError,
  selectPokemonList,
  selectSelectedType,
  selectTypeList,
} from "../../store/pokemon/selectors";
import "./Home.css";
import { types } from "../../assets/images/types";

export function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchValue = useAppSelector(selectSearchValue);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const pokemonList = useAppSelector(selectPokemonList);
  const selectedType = useAppSelector(selectSelectedType);
  const typeList = useAppSelector(selectTypeList);

  const displayList = selectedType ? typeList : pokemonList;

  useEffect(() => {
    dispatch(fetchPokemonList({ limit: 20, offset: 0 }));
  }, [dispatch]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    const result = await dispatch(searchPokemonByName(searchValue));
    if (searchPokemonByName.fulfilled.match(result)) {
      navigate(`/pokemon/${result.payload.name}`);
    }
  };

  const handlePokemonClick = (pokemonName: string) => {
    dispatch(searchPokemonByName(pokemonName));
    navigate(`/pokemon/${pokemonName}`);
  };

  const handleTypeClick = (typeName: string) => {
    if (selectedType === typeName) {
      dispatch(clearTypeFilter());
    } else {
      dispatch(fetchPokemonByType(typeName));
    }
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
            <h3 className="search-title">Search by name:</h3>

            <Input
              size="large"
              placeholder="Type Pokémon name"
              value={searchValue}
              onChange={(e) => dispatch(setSearchValue(e.target.value))}
              onPressEnter={handleSearch}
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
        <h3 className="search-title">Search by type:</h3>
        <div className="pokemon-types-section">
          {types.map((type) => (
            <div
              className="type-badge"
              onClick={() => handleTypeClick(type.name)}
            >
              <span>
                <img
                  src={type.image}
                  alt={type.name}
                  draggable={false}
                  className="type-image"
              
                />
              </span>
            </div>
          ))}
        </div>

        {selectedType && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span className="type-filter-label">
              Showing <strong>{selectedType}</strong>
              <button
                className="type-filter-clear"
                onClick={() => dispatch(clearTypeFilter())}
              >
                ✕ Clear
              </button>
            </span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} justify="center" className="pokemon-list-row">
            {displayList.map((pokemon) => (
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
