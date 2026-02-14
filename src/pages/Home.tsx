import { Carousel, Col, Input, Row } from "antd";
import { slides } from "../assets/images/slides";

const contentStyle: React.CSSProperties = {
  margin: 0,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  backgroundColor: "#fff",
};

export function Home() {
  return (
    <>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "90vh" }}
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      >
        <Col span={6}>
          <Carousel autoplay dots={false} effect="fade" autoplaySpeed={4000} >
            {slides.map((slide, index) => (
              <div key={index}>
                <div style={contentStyle}>
                  <img
                    src={slide.image}
                    alt={slide.name}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      height: "500px",
                    }}
                  />
                  <div>
                    <h2>{slide.name}</h2>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>
        <Col span={6}>coluna de pesquisa
        <Input size="large" />
        </Col>
      </Row>
    </>
  );
}
