import React, { Component } from 'react';


class Table extends Component {
   
    render() { 
        return ( <table >
        <thead>
          <tr>
            <th scope="col">Section</th>
            <th scope="col">Rating</th>
            <th scope="col">Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Atencion al Cliente</th>
            <td>;(</td>
            <td>30%</td>
          </tr>
          <tr>
            <th scope="row">Operaciones</th>
            <td>;)</td>
            <td>10%</td>
          </tr>
          <tr>
            <th scope="row">Locales</th>
            <td>;)</td>
            <td>40%</td>
          </tr>
        </tbody>
      </table> );
    }
}
 
export default Table;