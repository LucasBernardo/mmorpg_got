function UsuariosDAO(connection){
	this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			collection.insert(usuario);

			mongoclient.close();
		});
	});
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			collection.find(usuario).toArray(function(err, result){
				
				//Mensagem para quando o usuário informar um login e/ou senha errados
				let errorValues = [{
					param: "",
					msg: "Usuário e ou senha inválidos", 
					value: ""
				}];
				
				if(result[0] != undefined){

					req.session.autorizado = true;

					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}

				if(req.session.autorizado){
					res.redirect("jogo");
				} else {
					var dadosForm = req.body;
					res.render("index", {validacao: errorValues, dadosForm: dadosForm});
				}
			});
			mongoclient.close();
		});
	});
}


module.exports = function(){
	return UsuariosDAO;
}