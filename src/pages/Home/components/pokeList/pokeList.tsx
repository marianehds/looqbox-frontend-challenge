import { Card, Col, Row, Spin, Image, Pagination } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchPokemonList,
  fetchPokemonByType,
} from "../../../../store/pokemon/thunks";
import { clearTypeFilter, setPage } from "../../../../store/pokemon/slice";
import {
  selectPage,
  selectPageSize,
  selectLoading,
  selectPokemonList,
  selectSelectedType,
  selectTotal,
  selectTypeList,
} from "../../../../store/pokemon/selectors";
import { types } from "../../../../assets/images/types";
import { imageNotFound } from "../../../../assets/const/imageNotFound";
import "./pokeList.css";

export const PokeList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectLoading);
  const page = useAppSelector(selectPage);
  const pageSize = useAppSelector(selectPageSize);
  const total = useAppSelector(selectTotal);
  const pokemonList = useAppSelector(selectPokemonList);
  const selectedType = useAppSelector(selectSelectedType);
  const typeList = useAppSelector(selectTypeList);
  const isTypeLoading = Boolean(selectedType) && loading;
  const isHomeListLoading = !selectedType && loading;

  const displayList = selectedType ? typeList : pokemonList;
  const offset = (page - 1) * pageSize;
  const pagedList = selectedType
    ? displayList.slice(offset, offset + pageSize)
    : displayList;
  const paginationTotal = selectedType ? displayList.length : total;

  useEffect(() => {
    if (!selectedType) {
      const offset = (page - 1) * pageSize;
      dispatch(fetchPokemonList({ limit: pageSize, offset }));
    }
  }, [dispatch, page, pageSize, selectedType]);

  const handlePokemonClick = (pokemonName: string) => {
    navigate(`/pokemon/${pokemonName}`);
  };

  const handleTypeClick = (typeName: string) => {
    if (selectedType === typeName) {
      dispatch(clearTypeFilter());
      dispatch(setPage(1));
    } else {
      dispatch(setPage(1));
      dispatch(fetchPokemonByType(typeName));
    }
  };

  const handlePageChange = (nextPage: number) => {
    dispatch(setPage(nextPage));
  };

  return (
    <div>
      <h3 className="search-title">Search by type:</h3>
      <div className="pokemon-types-section">
        {types.map((type) => (
          <div
            key={type.name}
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

      {isTypeLoading || isHomeListLoading ? (
        <div style={{ textAlign: "center", padding: "40px", height: "100vh" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} justify="center" className="pokemon-list-row">
            {pagedList.map((pokemon) => (
              <Col xs={12} sm={8} md={6} lg={4} key={pokemon.name}>
                <Card
                  hoverable
                  className="pokemon-list-card"
                  onClick={() => handlePokemonClick(pokemon.name)}
                  cover={
                    <div>
                      <Image
                        draggable={false}
                        alt={pokemon.name}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          pokemon.url.split("/")[6]
                        }.png`}
                        className="pokemon-list-image"
                        fallback={imageNotFound}
                        preview={false}
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

          <div className="pokemon-pagination-wrapper">
            <Pagination
              current={page}
              total={paginationTotal}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};
