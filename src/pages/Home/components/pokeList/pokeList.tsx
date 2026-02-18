import { Card, Col, Row, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchPokemonList,
  fetchPokemonByType,
} from "../../../../store/pokemon/thunks";
import { clearTypeFilter } from "../../../../store/pokemon/slice";
import {
  selectLoading,
  selectPokemonList,
  selectSelectedType,
  selectTypeList,
} from "../../../../store/pokemon/selectors";
import { types } from "../../../../assets/images/types";
import "./pokeList.css";

export const PokeList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectLoading);
  const pokemonList = useAppSelector(selectPokemonList);
  const selectedType = useAppSelector(selectSelectedType);
  const typeList = useAppSelector(selectTypeList);
  const isListLoading = selectedType && loading;

  const displayList = selectedType ? typeList : pokemonList;

  useEffect(() => {
    if (pokemonList.length === 0) {
      dispatch(fetchPokemonList({ limit: 20, offset: 0 }));
    }
  }, [dispatch, pokemonList.length]);

  const handlePokemonClick = (pokemonName: string) => {
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

      {isListLoading ? (
        <div style={{ textAlign: "center", padding: "40px", height: "100vh" }}>
          <Spin size="large" />
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
  );
};
