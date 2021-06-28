
window.addEventListener("load",function(){

    let btn=document.getElementById("filtrare");
    btn.onclick=function(){
      
        //let descr=document.getElementById("inp-descriere");
        //let descriereSel=descr.value

        let nme=document.getElementById("inp-nume");
        let numeSel=nme.value
        
        inp=document.getElementById("inp-pret");
        let maxPret=inp.value
    
        let sel=document.getElementById("inp-categorie");
        let categorieSel=sel.value
    
       // let selSub=document.getElementById("inp-subcategorie");
        //let subcategorieSel=selSub.value
    
        //let cul=document.getElementById("inp-culoare");
        //let culoareSel=cul.value
    
    
        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="none";
            
            let pret= parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML)
            let conditie1= pret<= maxPret
    
            let categorieArt= prod.getElementsByClassName("val-categorie")[0].innerHTML
            let conditie2= (categorieArt==categorieSel || categorieSel=="toate");

            let numeArt= prod.getElementsByClassName("val-nume")[0].innerHTML
            let conditie3= numeArt.includes(numeSel);
    
            //let subcategorieArt= prod.getElementsByClassName("val-subcategorie")[0].innerHTML
            //let conditie3= (subcategorieArt==subcategorieSel);
    
            //let descriereArt= prod.getElementsByClassName("val-descriere")[0].innerHTML
            //let conditie3=descriereArt.includes(descriereSel);
    
            //let culoareArt= prod.getElementsByClassName("val-culoare")[0].innerHTML
           // let conditie4=  (culoareArt==culoareSel || culoareSel=="oricare");
    
            //let subcateg= prod.getElementsByClassName("val-subcategorie")[0].innerHTML
            //let conditie4= subcategorieSel.checked;
    
            let conditieFinala=conditie1 && conditie2 && conditie3; 
            if (conditieFinala)
                prod.style.display="block";
        }
    }
    
    
    function sortArticole(factor){
        
        var produse=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            let nume1=art1.getElementsByClassName("val-nume")[0].innerHTML;
            let nume2=art2.getElementsByClassName("val-nume")[0].innerHTML;
            if(factor*nume1.localeCompare(nume2))
                return factor*nume1.localeCompare(nume2);
                
            else
            {
            let pret1=art1.getElementsByClassName("val-pret")[0].innerHTML;
            let pret2=art2.getElementsByClassName("val-pret")[0].innerHTML;
            if(parseInt(pret1)>parseInt(pret2))
                return art1;
            else
                return art2;
            }
    
        });
        console.log(arrayProduse); 
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }
    
    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }
    
    btn=document.getElementById("resetare");
    btn.onclick=function(){
        
        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="block";
        }
    }
    
    
    
    //-------buton suma--------------
        const butonSuma = document.getElementById("calculare");
       
        butonSuma.onclick = function(){
            //e.preventDefault();
            var produse=document.getElementsByClassName("produs");
            sumaArt=0;
            for (let prod of produse){
                sumaArt+=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            let infoSuma=document.createElement("p");
            infoSuma.innerHTML="Pretul total al produselor: "+sumaArt;
            infoSuma.className="info-produse";
            let p=document.getElementById("p-suma")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
        }
    


    cant_prod_init=localStorage.getItem("cantitate");
    if(cant_prod_init)
    cant_prod_init=cant_prod_init.split(",");
    else
        ids_produse_init=[]

    ids_produse_init=localStorage.getItem("produse_selectate");
    if(ids_produse_init)
        ids_produse_init=ids_produse_init.split(",");
    else
        ids_produse_init=[]

    var checkboxuri_cos = document.getElementsByClassName("select-cos");
    for (let ch of checkboxuri_cos){
        if (ids_produse_init.indexOf(ch.value)!=-1)
            ch.checked=true;
        ch.onchange=function(){
            ids_produse=localStorage.getItem("produse_selectate")
            if(ids_produse)
                ids_produse=ids_produse.split(",");
            else
                ids_produse=[]
            console.log(ids_produse);
          
            if(ch.checked){
                ids_produse.push(ch.value);
            }
            else{
                ids_produse.splice(ids_produse.indexOf(ch.value), 1)
            }
            console.log(ids_produse);
            localStorage.setItem("produse_selectate",ids_produse.join(","))
        }
    }

    var selectcantitate = document.getElementsByClassName("cantitate");
    for (let sc of selectcantitate){
        if (sc.value!=-1)
            sc.checked=true;
            sc.onchange=function(){
            cant_prod=localStorage.getItem("produse_selectate")
            if(cant_prod)
            cant_prod=cant_prod.split(",");
            else
            cant_prod=[]
            console.log(cant_prod);
          
            if(sc.checked){
                cant_prod.push(sc.value);
            }
            else{
                cant_prod.splice(sc.value, 1)
            }
            console.log(cant_prod);
            localStorage.setItem("produse_selectate",cant_prod.join(","))
        }
    }


    
    });
    
