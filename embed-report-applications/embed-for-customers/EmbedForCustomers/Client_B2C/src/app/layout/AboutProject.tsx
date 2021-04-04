import React from "react";
import { Segment } from "semantic-ui-react";

const AboutProject = () => {
  return (
    <React.Fragment>
      <h1>COVID Data Engineering</h1>
      <Segment style={{ marginBottom: "3rem" }}>
        <p>
          The objective is to identify the impact of different factors in the
          COVID-19 pandemic evolution and how its evolution is reflected in
          social networks, in this case Twitter. For this purpose, we collected,
          via public APIs, daily information on incoming flights, weather
          temperatures, traffic and mobility data, also tweets with the tag
          #covid and, of course, data on the pandemic spread (new cases and
          demises). All this for 5 main countries: Japan, Spain, France, United
          States and Brazil
        </p>
      </Segment>
    </React.Fragment>
  );
};

export default AboutProject;
