const { check, validationResult } = require("express-validator");

let NeDB = require('nedb');
let db = new NeDB({
    filename : 'clients.db',
    autoload: true
});

module.exports = app => {

    let route = app.route('/clients');

    route.get((req, res) =>{

        db.find({}).sort({name:1}).exec((err, clients)=>{

            if(err){
               app.utils.error.send(err, req, res);
            }else{

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    clients
                });
            }
            

        });
    });

    route.post([check("nome", "O nome é obrigatório.").notEmpty(),
               check("endereco", "O endereço é obrigatório.").notEmpty()],
               (req, res) =>{
        let erros = validationResult(req);

        if(!erros.isEmpty()){
            app.utils.error.send(erros, req, res);
            return false;
        }

        db.insert(req.body, (err, clients) =>{

            if(err){
                app.utils.error.send(err, req, res);  
            }else{
                res.status(200).json(clients);
            }
        });
    });

    let routeId = app.route('/clients/:id');

    routeId.get((req, res) =>{

        db.findOne({_id: req.params.id}).exec((err, clients) =>{
            if(err){
                app.error.send(err, req, res);
            }else{
                res.status(200).json(clients);
            }
        });
    });

    routeId.put((req, res) =>{

        db.update({_id: req.params.id}, req.body, err =>{

            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });
    });

    routeId.delete((req, res)=>{

        db.remove({_id: req.params.id}, {}, err =>{

            if(err){
                app.error.send(err, req, res);
            }else{
                res.status(200).json(req.params);
            }
        });
    });


};
