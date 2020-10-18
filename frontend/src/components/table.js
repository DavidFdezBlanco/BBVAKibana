import React, { Component } from 'react';
import HappyFace from '../image/HappyFace.png'
import SuperHappyFace from '../image/SuperHappyFace.png'
import NeutralFace from '../image/NeutralFace.png'
import AngryFace from '../image/AngryFace.png'
import SuperAngryFace from '../image/SuperAngryFace.png'

class Table extends Component {

  state = {
    data: []
  }

  countryList = ["Colombia","España", "Peru", "Argentina", "Mexico"]

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

  createData( name, avg, clusterAvg, commentcounts) {
    let categories = {};
    for (const category in clusterAvg) {
        if (clusterAvg.hasOwnProperty(category)) {
            categories[category] = {
                rating: clusterAvg[category],
                avg: commentcounts.results[category] / commentcounts.total
            }
        }
    }
    return {
        name: name,
        avg: avg.toFixed(0),
        categories: categories
    };
}

  fetchData() {
    let clusters = []
    let i = 0;
    return new Promise((res,rej) => {
        this.countryList.forEach(country => {
            console.log("country", country);
            fetch("http://3.137.101.89:3000/api/ratings?country=" + country)
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log("result", result);
                        let clusterAvg = result.cluster_avg;
                        let globalSum = 0;
                        for (const category in clusterAvg) {
                            if (clusterAvg.hasOwnProperty(category)) {
                                const element = clusterAvg[category];
                                globalSum += element
                            }
                        }
                        let avg = globalSum / Object.keys(clusterAvg).length;
                        clusters.push(this.createData(country, avg, result.cluster_avg, result.comments_count))
                        this.setState({
                            data: this.state.data.concat([this.createData(country, avg, result.cluster_avg, result.comments_count)])
                        });
                        i++;
                        if (i == 5) {
                            res(true);
                        }
                    },
                    (error) => {
                        this.setState({});
                    }
                );
        });
    });
}
async componentDidMount() {
    await this.fetchData();
    console.log("fddfd",this.state.data)
    // const itemsFinal = []
    // let clusterAvg = this.state.data;
    // console.log("here")
    // for (const id in this.state.data){
    //   console.log(this.state.data[id])
    //   if (this.state.data[id].hasOwnProperty(id)) {
    //     const element = clusterAvg[id];
        


    //     const face = this.getFace(element.toFixed(0))
    //     var obj={
    //       // country,
    //       {// category,
    //       face,
    //       element
    //     }  
    //     }
    //     itemsFinal.push(obj)
    //   }
    // }
}
  render() {

    if(this.state.data.length<5){
      return null
    }

    //hacer con select
    var country = this.countryList[0]
    console.log("geee")
    console.log(this.state.data)
    for( const i in this.state.data){
      console.log(this.state.data[i])
      if(this.state.data[i].name == country){
        var avg = this.state.data[i].avg
        this.finalObject =this.state.data[i]
      }
    }
    let cqt = Object.keys(this.finalObject.categories);
    console.log('grgrgr', this.finalObject.categories)
    return ( 
  <div className="limiter">
    <div className="resultMean">Sector de Calificacion: <br></br>
    {avg}
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
            cqt.map((value, index) => {
              console.log('ddd',this.finalObject)
              var toReturn = <div className="row"><div className="cell" data-title="Categoria">{value}</div><div className="cell" data-title="Puntuaje"><img src={this.getFace(Number(this.finalObject.categories[value].rating).toFixed(0))} height="20px" width="20px"/></div><div className="cell" data-title="%">{this.finalObject.categories[value].rating.toFixed(2)}</div></div>

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