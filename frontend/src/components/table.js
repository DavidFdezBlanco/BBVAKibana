import React, { Component } from 'react';
import HappyFace from '../image/HappyFace.png'
import SuperHappyFace from '../image/SuperHappyFace.png'
import NeutralFace from '../image/NeutralFace.png'
import AngryFace from '../image/AngryFace.png'
import SuperAngryFace from '../image/SuperAngryFace.png'

class Table extends Component {

  getFace(number){
    switch (Number(number)) {
        case 5:
            return SuperHappyFace;
        case 4:
            return HappyFace;
        case 3:
            return NeutralFace;
        case 2:
            return AngryFace;
        case 1:
            return SuperAngryFace;
        default:
            return "No face"
          //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
          break;
      }
  }
  render() {

    //neededInputs
    const country = "Colombia"
    const data = {"cluster_avg":{"Atención al cliente":1.8722222222222222,"Cajeros":2.0970149253731343,"Esperas":1.3267326732673268,"Horarios":1.0757575757575757,"Operaciones Bancarias":1.3831775700934579,"Sucursal":1.610655737704918,"Teléfonos":1.1958762886597938,"Unclassified":2.2618556701030927},"comments_count":{"results":{"Atención al cliente":180,"Cajeros":134,"Esperas":202,"Horarios":66,"Operaciones Bancarias":214,"Sucursal":244,"Teléfonos":97,"Unclassified":485},"total":1908}} 
        
    const itemsFinal = []
    let clusterAvg = data.cluster_avg;

    for (const category in data.cluster_avg){
      if (clusterAvg.hasOwnProperty(category)) {
        const element = clusterAvg[category];
        const face = this.getFace(element.toFixed(0))
        var obj={
          category,
          face,
          element
        }
        itemsFinal.push(obj)
      }
    }
    
    //callc average
    let globalSum = 0;
    for (const category in clusterAvg) {
        if (clusterAvg.hasOwnProperty(category)) {
            const element = clusterAvg[category];
            globalSum += element
        }
    }
    let avg = globalSum / Object.keys(clusterAvg).length;

    return ( 
  <div className="limiter">
    <div className="resultMean">Sector de Calificacion: <br></br>
    {avg.toFixed(2)}
    </div>
    <div className="resultMean">Pais: <br></br>
    {country}
    </div>
		<div className="container-table100">
			<div className="wrap-table100">
					<div className="table">
						<div className="row header">
							<div className="cell">
								Categoria
							</div>
							<div className="cell">
								Puntuaje
							</div>
							<div className="cell">
								%
							</div>
						</div>

      
            {
            
            itemsFinal.map((value, index) => {
              
                var toReturn = <div className="row"><div className="cell" data-title="Categoria">{value.category}</div><div className="cell" data-title="Puntuaje"><img src={value.face} height="12px" width="12px"/></div><div className="cell" data-title="%">{value.element.toFixed(2)}</div></div>

                return toReturn
              })
              
              }

					</div>
			</div>
		</div>
	</div>
       );
    }
}
 
export default Table;