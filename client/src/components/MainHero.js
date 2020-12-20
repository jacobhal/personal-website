import React from 'react';

import { Jumbotron, Container } from 'react-bootstrap';
import { NavBar } from './NavBar';

class MainHero extends React.Component {
  render() {
    return (
        <Jumbotron fluid color="black" style={{padding: '20px 50px'}} className={this.props.background + ' ' + this.props.fullheight}>
            <NavBar />
            <Container className="has-text-centered">
              {this.props.button}
            </Container>
        </Jumbotron>
    );
  }
}

export default MainHero;
