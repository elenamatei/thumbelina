const express=require('express');
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const url = require('url');
const session = require('express-session');
const formidable = require('formidable');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { exec } = require("child_process");
const ejs=require('ejs');
const serverNetwork = require('ip');
var requestIp= require('request-ip');
var app=express();//obiectul server-l am creat
var serverIp = serverNetwork.address();


app.use(["/produse_cos","/cumpara"],express.json({limit:'2mb'}));//obligatoriu de setat pt request body de tip json
//setez o sesiune
app.use(session({
  secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
  resave: true,
  saveUninitialized: false
}));

//---------------functie trimitere MAIL-------------------------
async function trimiteMail(username, email, nume){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{
			user:"proiect.tehniciweb21@gmail.com",
			pass:"proiecttw"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"proiect.tehniciweb21@gmail.com",
		to:email,
		subject:"Salut,stimate " + nume +"!",
		text:"Username-ul tau este " + username +" pe site-ul Thumbelina.",
		html:"<h1>Salut!</h1><p>Username-ul tau este " + username + " pe site-ul<b><i><u>Thumbelina</u></i></b>.</p>",
	});
	console.log("Am trimis mail");
}

async function trimitefactura(username, email,numefis){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{
      user:"proiect.tehniciweb21@gmail.com",
			pass:"proiecttw"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"proiect.tehniciweb21@gmail.com",
		to:email,
		subject:"Factură",
		text:"Stimate "+username+", aveți atașată factura",
		html:"<h1>Salut!</h1><p>Stimate "+username+", aveți atașată factura</p>",
        attachments: [
            {   
                filename: 'factura.pdf',
                content: fs.readFileSync(numefis)
            }]
	})
	console.log("Am trimis factura.");
}


const {Client}=require('pg');
const client = new Client({
  host: 'localhost', 
  user: 'elena',
  password: 'elena',
  database: 'postgres',
  port:5432
});

client.connect()

app.set("view engine","ejs");

app.get("/resurse/json/galerie.json",function(req,res){
  res.status(403).render("pagini/pagina403.ejs",{serverIp:serverIp});
});


console.log("Proiectul se afla la: ",__dirname);
app.use("/resurse", express.static(path.join(__dirname, "resurse")));

function verificaImagini(){
	var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect

	var caleGalerie=jsi.cale_galerie;
  let vectImagini=[];

	for (let im of jsi.imagini){
		var imVeche= path.join(caleGalerie, im.cale_fisier);//obtin calea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
		var ext = path.extname(im.cale_fisier);//obtin extensia
		var numeFisier =path.basename(im.cale_fisier,ext)//obtin numele fara extensie
		let imNoua=path.join(caleGalerie + "/mic/", numeFisier+"-mic"+".webp");//creez calea pentru imaginea noua; prin extensia wbp stabilesc si tipul ei
   vectImagini.push({mare:imVeche, mic:imNoua, descriere:im.text_descriere, luni:im.luni, cale:im.cale_fisier, titlu:im.titlu}); //adauga in vector un element
		if (!fs.existsSync(imNoua))//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imNoua, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imNoua, err);
		  });
    //imagini medii
    let imMedie=path.join(caleGalerie + "/mediu/", numeFisier+"-mediu"+".webp");
    //vectImagini.push({mediu:imMedie,}); 
    if (!fs.existsSync(imMedie))
		sharp(imVeche)
		.resize(250)
		  .toFile(imMedie, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imMedie, err);
		  });

	}
    return vectImagini;
}



app.get("/", function(req,res){
  /*  res.setHeader("Content.Type","text/html");
    res.write("BUNA!Vrei un buchet de flori?");
    res.end();*/
    var userIp=requestIp.getClientIp(req);
    let imagini = verificaImagini();//ca sa creeze imagini mici pentru eventuale imagini noi
    res.render("pagini/index.ejs",{imagini: imagini,userIp:userIp,serverIp:serverIp});//punem calea relativa la folderul special views

});
app.get("/produse",function(req,res){
  //console.log("URL: ", req.url);
  //console.log("Query:", req.query.categ);
  let conditie= req.query.categ ?  " and categorie='"+req.query.categ+"'" : "";
    client.query("select * from flori where 1=1", function(err,rez){
        console.log(err, rez);
        client.query("select unnest(enum_range( null::categorie_flori)) as categ", function(err,rezCateg){
            console.log(rezCateg);
            res.render("pagini/produse", {produse:rez.rows, categorii:rezCateg.rows, utilizator: req.session.utilizator});
            });
    });
    });
/*app.get("/produse", function(req,res){
  let conditie22= req.query.subcateg ?  " and tip_produs='"+req.query.subcateg+"'" : "";
  client.query("select * from flori where 1=1", function(err,rez){
      console.log(err, rez);
      client.query("select unnest(enum_range( null::categorie_scop)) as subcateg", function(err,rezSubcateg){
        console.log(rezSubcateg);
        res.render("pagini/produse", {produse:rez.rows,subcategorii:rezSubcateg.rows,});
    });

  });

});*/


app.get("/produs/:id_flori",function(req,res){
  console.log(req.params);
  const rezultate = client.query("select * from flori where id="+req.params.id_flori, function(err,rez){
    //console.log(err,rez);
    //console.log(rez.rows);
    res.render("pagini/produs",{prod:rez.rows[0], utilizator: req.session.utilizator});

  });
});



//---------inregistrare----------


let parolaServer="tehniciweb";
app.post("/inreg",function(req, res){ 
    console.log("Am primit date yaayy");
    var username;
    let formular= formidable.IncomingForm();
	
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);
		eroare ="";
		if(campuriText.username=="" || !campuriText.username.match("^[A-Za-z0-9]+$") ){
			eroare+="Username gresit. ";
		}
    if(campuriText.telefon=="" || !campuriText.telefon.match("^(\+4|)?(0[0-9]{9})+$)" ) ){
			eroare+="Telefon gresit. ";
		}
    if(campuriText.nume=="" ||  !campuriText.nume.match("^[A-Z][a-z0-9_-]{3,20}$" )){
			eroare+="Nume gresit. ";
		}
    if(campuriText.prenume=="" || !campuriText.prenume.match("^[A-Z][a-z0-9_-]{3,20}$" )){
			eroare+="Prenume gresit. ";
		}
		if(!eroare){
			let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
			let comanda= `insert into utilizatori (username, nume, prenume, parola, email, telefon) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.telefon}')`;
			console.log(comanda);
			client.query(comanda, function(err, rez){
				if (err){
					console.log(err);
					res.render("pagini/inregistrare",{err:"A aparut o eroare in baza de dat.Reveniti mai tarziu.", raspuns:"Datele nu au fost introduse."});
				}
				else{
					res.render("pagini/inregistrare",{err:"", raspuns:"Este ok!"});
					trimiteMail(campuriText.username,campuriText.email);
					console.log(campuriText.email);
				}
			});
		}
		else{
					res.render("pagini/inregistrare",{err:"Eroare formular. "+eroare, raspuns:""});
		}
    });
    	//nr ordine: 2
	formular.on("fileBegin", function(name,campFisier){
		console.log("inceput upload: ", campFisier);
		if(campFisier && campFisier.name!=""){
			//am  fisier transmis
			var cale=__dirname+"/poze_utilizatori/"+username
			if (!fs.existsSync(cale))
				fs.mkdirSync(cale);
			campFisier.path=cale+"/"+campFisier.name;
			console.log(campFisier.path);
		}
	});	
	
	
	//nr ordine: 1
	formular.on("field", function(name,field){
		if(name=='username')
			username=field;
		console.log("camp - field:", name)
	});
	
	//nr ordine: 3
	formular.on("file", function(name,field){
		console.log("final upload: ", name);
	});
	
});

//---------login-----------------

app.post("/login", function(req,res){
  let formular= formidable.IncomingForm();
  formular.parse(req, function(err, campuriText){
      let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
      let comanda_param= `select id,username,nume, email, telefon, rol from utilizatori where username= $1::text and parola=$2::text; `// and nume=$3::text and email=$4::text and telefon=$5::text`;
      client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
          if (!err){
              if (rez.rows.length == 1){
                  req.session.utilizator={
                      id:rez.rows[0].id,
                      username:rez.rows[0].username,
                      nume:rez.rows[0].nume,
                      email:rez.rows[0].email,
                      telefon:rez.rows[0].telefon,
                      rol:rez.rows[0].rol
                  }
              }
              
          }
          res.redirect("/index");
      });
  }); 
});
//-----------logout-------------------

app.get("/logout", function(req, res){
  req.session.destroy();
  res.render("pagini/logout");
});

//------------pentru admin-------------
app.get('/useri', function(req, res){
	
	if(req.session && req.session.utilizator && (req.session.utilizator.rol=="admin")){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
            console.log(rezultat);
            res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
        });
	} else{
		res.status(403).render('pagini/403',{mesaj:"Nu aveti acces aici!!!", utilizator:req.session.utilizator});
	}

});
/*
app.post("/schimba-rol",function(req, res){
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
	var formular= formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
		var comanda=`alter table utilizatori update column rol ="admin" where id='${campuriText.id_utiliz}'`;
		client.query(comanda, function(err, rez){
			// TO DO mesaj cu stergerea
		});
	});
	}

	res.redirect("/useri");
	
});
*/

//------------cos virtual--------------
app.post("/produse_cos",function(req, res){
    
	console.log("req.body: ",req.body);
    console.log(req.get("Content-type"));
    console.log("body: ",req.get("body"));

    /* prelucrare pentru a avea toate id-urile numerice si pentru a le elimina pe cele care nu sunt numerice */
    var iduri=[]
    for (let elem of req.body.ids_prod){
        let num=parseInt(elem);
        if (!isNaN(num))
            iduri.push(num);
    }
    if (iduri.length==0){
        res.send("eroare");
        return;
    }

    console.log("select id, nume, pret, nr_flori, culoare , categorie, imagine from flori where id in ("+iduri+")");
    client.query("select id, nume, pret, nr_flori, culoare , categorie, imagine from flori where id in ("+iduri+")", function(err,rez){
        console.log(err, rez);
        res.send(rez.rows);
       
       
    });

    
});


app.post("/cumpara",function(req, res){
    if(!req.session.utilizator){
        res.write("Nu puteti cumpara daca nu sunteti logat!");res.end();
        return;
    }
    console.log("select id, nume, pret, nr_flori, culoare , categorie, imagine from flori where id in ("+req.body.ids_prod+")");
    client.query("select id, nume, pret, nr_flori, culoare , categorie, imagine from flori where id in ("+req.body.ids_prod+")", function(err,rez){
        console.log(err, rez);
        console.log(req.session.utilizator);
        let rezFactura=ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf-8"),{utilizator:req.session.utilizator,produse:rez.rows});
        console.log(rezFactura);
        let options = { format: 'A4' };

        let file = { content: rezFactura };

        html_to_pdf.generatePdf(file, options).then(function(pdf) {
            var numefis="temp/test"+(new Date()).getTime()+".pdf";
            fs.writeFileSync(numefis,pdf);
            trimitefactura(req.session.utilizator.username, req.session.utilizator.email, numefis);
            res.write("Totul s-a procesat cu succes!");res.end();
        });
       
        
       
    });

    
});




//-----------------galerii------------

app.get("/GalerieStatica",function(req,res){
  res.render("pagini/GalerieStatica",{imagini: verificaImagini(), utilizator: req.session.utilizator});
});
app.get("/GalerieAnimata",function(req,res){
  res.render("pagini/GalerieAnimata",{imagini: verificaImagini(), utilizator: req.session.utilizator});
});


app.get(["/","/index"],function(req, res){//ca sa pot accesa pagina principala si cu localhost:8080 si cu localhost:8080/index

            /*generare evenimente random pentru calendar */
            var evenimente=[]
            var texteEvenimente=["Eveniment important", "Festivitate", "1 Martie", "Flori gratis"];
            dataCurenta=new Date();
            for(i=0;i<4;i++){
                evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*25) ), text:texteEvenimente[i]});
            }
            console.log(evenimente)
            res.render("pagini/index", {evenimente: evenimente, imagini: verificaImagini(), utilizator: req.session.utilizator});
            
});

         



/*app.get("/index",function(req,res){
  var userIp=requestIp.getClientIp(req);
  res.render("pagini/index",{imagini: imagini,userIp:userIp,serverIp:serverIp});
});*/
app.get("/", function(req,res){
  
    res.render("pagini/index");//punem calea relativa la folderul special views

}); 


//-----------------pagini erori------------
app.get("/*",function(req,res){
  console.log(req.url);
  res.render("pagini"+req.url,function(err,rezultatRender){
    if(err){
      if(err.message.includes("Failed to lookup view")){
        res.status(404).render("pagini/404",{utilizator: req.session.utilizator});
      }
      else
          throw err;

    }
    else
        res.send(rezultatRender);
  },{ utilizator: req.session.utilizator});
  
});

//-----------GALERIA STATICA--------------------
app.get("/GalerieStatica",function(req,res){
  var month = new Array();
  month[0] = "ianuarie";
  month[1] = "februarie";
  month[2] = "martie";
  month[3] = "aprilie";
  month[4] = "mai";
  month[5] = "iunie";
  month[6] = "iulie";
  month[7] = "august";
  month[8] = "septembrie";
  month[9] = "octombrie";
  month[10] = "noiembrie";
  month[11] = "decembrie";
  var d = new Date();
  var luna_curenta = month[d.getMonth()];

    var vector1 = []
    var aux = verificaImagini();
    for(let ima of aux)
    {
        if(ima.luni.includes(String(luna_curenta)))
            vector1.push(ima)
    }
    res.render("pagini/GalerieStatica",{imagini:vector1, });
    res.render("pagini/",{imagini:vector1, });
});

//---------------GALERIE ANIMATA------------------
app.get("*/galerie_animata_frag.css",function(req, res){
  res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
  let sirScss=fs.readFileSync("./resurse/scss/galerie_animata_frag.scss").toString("utf-8");//citesc scss-ul ca string
  //numere=[7,8,9,11];
 // let numarAleator =parseInt(numere[Math.floor(Math.random()*numere.length)]);
  //let rezScss=ejs.render(sirScss,{numar:numarAleator});// transmit numarul catre scss si obtin sirul cu scss-ul compilat
 // console.log(rezScss);
 // fs.writeFileSync("./temp/galerie_animata_frag.scss",rezScss);//scriu scss-ul intr-un fisier temporar
  exec("sass ./temp/galerie_animata_frag.scss ./temp/galerie_animata_frag.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
      if (error) {
          console.log(`error: ${error.message}`);
          res.end();//termin transmisiunea in caz de eroare
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.end();
          return;
      }
      console.log(`stdout: ${stdout}`);
      //totul a fost bine, trimit fisierul rezultat din compilarea scss
      res.sendFile(path.join(__dirname,"temp/galerie_animata_frag.css"));
  }); 
});

app.listen(8080);
console.log("Merge serverul!!!");
//verificaImagini();