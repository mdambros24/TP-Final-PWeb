var peliculas = [];
var pagina = 1;
var favoritas = [];

function cargarFavoritas(){
    var datos = localStorage.getItem("favoritas");
    if(datos !==null){
        favoritas = JSON.parse(datos);
    }
}

function vincularElementos(){
    
    $("#boton-buscar").click(function(){
        var busqueda = $("#buscar").val().toLowerCase();        
        var parametros = {

        url: "http://www.omdbapi.com/?s="+busqueda+"&page="+pagina+"&apikey=f148d123"
        
        
        };
        
        $.ajax(parametros).done(function(peliculas){
        
                        
            for (var i = 0; i<peliculas.Search.length; i++){

                dibujarPelicula(peliculas.Search[i]);
                
                

            }      
        });  
    });
    $("#link-paginator").click(function(){
        var busqueda = $("#buscar").val().toLowerCase();
        pagina = pagina + 1;
    
        var parametros = {

            url: "http://www.omdbapi.com/?s="+busqueda+"&page="+pagina+"&apikey=f148d123"
            
            
        };
            
        $.ajax(parametros).done(function(peliculas){
                       
            
            for (var i = 0; i<peliculas.Search.length; i++){

                dibujarPelicula(peliculas.Search[i]);
                
            }      
        });    
    });
    
    $("#nav-favoritos").click(function(){
        /*var datos = localStorage.getItem("favoritas");
        if(datos !==null){
            favoritas = JSON.parse(datos);
        }*/
        for(var i=0; i<favoritas.length; i++){

            dibujarFavorita(favoritas[i]);            
        }
        $("#link-paginator").hide();
    });

    $("#nav-home").click(function(){
        //borra buscar
        $("#link-paginator").show();
        $("#favoritos").empty();
        $("#boton-buscar").trigger("click");
        
    });
}
     

function dibujarPelicula(pelicula){
    $("#favoritos").empty();    
    var movieCard = $("#movie-card").html();
    var div = $(movieCard);
    div.attr("id", pelicula.imdbID);
    div.find(".movie-header").css('background-image', 'url("' + pelicula.Poster + '")');
    div.find("h3").text(pelicula.Title);
    div.find("span#movie-release-date").text(pelicula.Year);
    div.find("span#movie-type").text(pelicula.Type);
    div.appendTo("#movies");
    
    div.on("click",function(){
        
        mostrarDetalle(pelicula);     
    });
    
};
function dibujarFavorita(favorita){
    $("#movies").empty();
    var movieCard = $("#movie-card").html();
    var div = $(movieCard);
    div.attr("id", favorita.imdbID);
    div.find(".movie-header").css('background-image', 'url("' + favorita.Poster + '")');
    div.find("h3").text(favorita.Title);
    div.find("span#movie-release-date").text(favorita.Year);
    div.find("span#movie-type").text(favorita.Type);
    div.appendTo("#favoritos");    

    div.on("click",function(){
        
        mostrarDetalle(favorita);     
    });
};

function mostrarDetalle(pelicula){
        
    var parametros = {

        url: "http://www.omdbapi.com/?i="+ pelicula.imdbID +"&plot=full&apikey=f148d123"
        
        
    };
        
    $.ajax(parametros).done(function(data){            
        completarModal(data);          
    });
};

function completarModal(detallePelicula) {
    
    $("#modal-title").text(detallePelicula.Title);
    $("#modal-year").text(detallePelicula.Year);
    $("#modal-poster").attr("src",detallePelicula.Poster);
    $("#modal-rating").text(detallePelicula.Ratings);
    $("#modal-votes").text(detallePelicula.imdbVotes);
    $("#modal-metascore").text(detallePelicula.Metascore);
    $("#modal-plot").text(detallePelicula.Plot);
    $("#modal-released").text(detallePelicula.Released);
    $("#modal-runtime").text(detallePelicula.Runtime);
    $("#modal-rated").text(detallePelicula.Rated);
    $("#modal-director").text(detallePelicula.Director);
    $("#modal-actors").text(detallePelicula.Actors);
    $("#modal-writer").text(detallePelicula.Writer);
    $("#modal-awards").text(detallePelicula.Awards);
    $('#myModal').modal('show');
    $("#modal-add-to-favorite").off("click");
    $("#modal-add-to-favorite").on("click", function(){

        agregarFavorita(detallePelicula);
        $('#myModal').modal('hide'); 
    });

    $("#modal-remove-from-favorite").off("click");
    $("#modal-remove-from-favorite").on("click", function(){

        sacarFavorita(detallePelicula);
         
    });
};

function agregarFavorita(pelicula){
    var favorita = pelicula;
    favoritas.push(favorita);
    localStorage.setItem("favoritas", JSON.stringify(favoritas));
    
      
    
}

function sacarFavorita(pelicula){

    var encontrado = false;
    for(var i=0; i<favoritas.length && encontrado ==false;i++){        
        if(favoritas[i].imdbID == pelicula.imdbID){
            encontrado = true;                   
           
            favoritas.splice(i,1);
            localStorage.setItem("favoritas", JSON.stringify(favoritas));
            $("#"+pelicula.imdbID).remove();
            
        }   
            
            
    }
    $('#myModal').modal('hide');
};



function iniciarPagina(){
    
    cargarFavoritas();    
    vincularElementos();
}

$(document).ready(iniciarPagina);