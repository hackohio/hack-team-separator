import React, { Component } from 'react';
import 'react-bulma-components/src/index.sass';
import Navbar from 'react-bulma-components/lib/components/navbar';
import hacklogo from '../img/hackohiologo.png';
import TeamSeparator from './TeamSeparator/TeamSeparator.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar
            color="dark"
        >
            <Navbar.Brand>
                <Navbar.Item renderAs="a" href="#">
                    <img
                        src={hacklogo}
                        alt="HackOhio Logo"
                    />
                </Navbar.Item>
            </Navbar.Brand>
            <Navbar.Menu active={Navbar.Menu.open}>
                <Navbar.Container>
                    <Navbar.Item href="#">Team Separator</Navbar.Item>
                </Navbar.Container>
                <Navbar.Container position="end">
                    <Navbar.Item>Alpha Testing</Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
        <TeamSeparator />
      </div>
    );
  }
}

export default App;
