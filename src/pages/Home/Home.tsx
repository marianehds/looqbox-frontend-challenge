import { Button, Carousel, Col, Divider, Input, Radio, Row } from "antd";
import { slides } from "../../assets/images/slides";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import "./Home.css";

const options: CheckboxGroupProps<string>["options"] = [
  { label: "Name", value: "Name" },
  { label: "Type", value: "Type" },
  { label: "Species", value: "Species" },
];

const handleSearch = () => {
  console.log("search");
};

export function Home() {
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
                  <div>
                    <h2>{slide.name}</h2>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>
        <Col span={6}>
          <div className="search-container">
            <h3>Search by:</h3>
            <Input size="large" />
            <Divider variant="dashed" />
            <Radio.Group
              block
              options={options}
              defaultValue="Name"
              optionType="button"
            />
            <Divider variant="dashed" />
            <Button type="default" size="large" onClick={handleSearch} block>
              Search
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
