import React, { Component } from 'react';
import '../App.css'
import logo from '../image/bbva.png'

class Header extends Component {
    render() { 
        return ( <div className="App-header" style={{height: "10vh"}}>
            <img src={logo} height="70px" width="130px" className="logo"/>
        </div> );
    }
}
 
export default Header;