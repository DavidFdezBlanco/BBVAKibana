
var categories = ['Atención al cliente', 'Cajeros', 'Esperas', 'Horarios', 'Operaciones Bancarias', 'Sucursal', 'Teléfonos']
var clusters_id = [8, 11, 7, 9, 4, 1, 10]
var countries = ['España', 'Argentina', 'Mexico', 'Peru', 'Colombia']
var data;

function get_category(id){
    switch (id) {
        case 6:
        case 8:
            return 'Atención al cliente'
        case 11:
        case 2:
        case 5:
            return 'Cajeros'
        case 7:
        case 0:
            return 'Esperas'
        case 9:
            return 'Horarios'
        case 4:
            return 'Operaciones Bancarias'
        case 1:
            return 'Sucursal'
        case 10:
            return 'Teléfonos'
        default:
            return 'Unclassified'
    }
}


function fetchData(){
    var country = countries[Math.floor(Math.random() * countries.length)];
    var category = categories[Math.floor(Math.random() * categories.length)];
    fetch('http://3.137.101.89:3000/api/ratings/comment?country='+ country +'&label=' + category)
        .then((res) => data = res)
        .then(res => {
            res.json().then(res => {
                data = res
                document.getElementById("review").value = data.comment
                document.getElementById("category").value = get_category(data.cluster_id)

            });
        } 
    )
}

fetchData()

function noButton(){
    document.getElementById("div_pregunta").style.display = "block";
}

function siButton(){
    document.getElementById("div_pregunta").style.display = "none";
    fetchData()
}

window.addEventListener( "load", function () {
    function sendData() {
      const XHR = new XMLHttpRequest();
  
      let cluster_id = clusters_id[document.getElementById("categoria_input").value]
      let id = data.id
      var output = JSON.stringify({ "id" : id, "cluster_id" : cluster_id })
  
      // Define what happens in case of error
      XHR.addEventListener( "error", function( event ) {
        alert( 'Oops! Something went wrong.' );
      } );
  
      // Set up our request
      XHR.open( "POST", "http://3.137.101.89:3000/api/ratings/comment" );

      // Set the request header i.e. which type of content you are sending 
      XHR.setRequestHeader("Content-Type", "application/json"); 
      // The data sent is what the user provided in the form
      
      XHR.send(output)
    }
   
    // Access the form element...
    const form = document.getElementById( "myForm" );
  
    // ...and take over its submit event.
    form.addEventListener( "submit", function ( event ) {
      event.preventDefault();
  
      sendData();
      document.getElementById("div_pregunta").style.display = "none";
    } );

    
  } );


