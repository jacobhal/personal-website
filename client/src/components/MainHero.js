import React from 'react';

import { Jumbotron, Container } from 'react-bootstrap';
import { NavBar } from './NavBar';

class MainHero extends React.Component {
  render() {
    return (
        <Jumbotron fluid color="black" style={{padding: '20px 50px', height: '500px'}} className={this.props.background + ' ' + this.props.fullheight}>
            <NavBar />
            <Container className="has-text-centered jumbotron-content">
              <h1 className="has-text-centered outline" subtitle size={6} id="jumbotron-subtitle">
                {this.props.subtitle}
              </h1>
              <h3 className="has-text-centered outline" id="jumbotron-title">{this.props.title}</h3>
              {this.props.button}
            </Container>
        </Jumbotron>
    );
  }
}

export default MainHero;
