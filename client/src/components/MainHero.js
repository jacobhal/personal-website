import React from 'react';

import { Hero, Heading, Container } from 'react-bulma-components/full';
import { NavBar } from './NavBar';

class MainHero extends React.Component {
  render() {
    return (
        <Hero color="black" className={this.props.background + ' ' + this.props.fullheight}>
          <Hero.Head>
            <NavBar />
          </Hero.Head>
          <Hero.Body>
            <Container className="has-text-centered">
              <Heading className="has-text-centered outline" subtitle size={6} id="hero-subtitle">
                {this.props.subtitle}
              </Heading>
              <Heading className="has-text-centered outline" id="hero-title">{this.props.title}</Heading>
              {this.props.button}
            </Container>
          </Hero.Body>
        </Hero>
    );
  }
}

export default MainHero;
