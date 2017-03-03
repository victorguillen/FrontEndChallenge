/*
Changed all the script to be ES6, created classes and changed
functions to fat arrow functions, changed "var" to "let".
Also changed the structure of the code by applying indentation to fit
within 80 characters (its easier to read)
*/
class Domobj {
  constructor() {
    this.products=[];
  }

  getproducts(url) {
    $.getJSON(url, (response) => {
        for(let i=0; i<response.sales.length ; i++){
          this.products.push( new Productobj(response.sales[i], i)  );
        }
    });
  }

  updateproducthtml() {
    for(let i=0; i< this.products.length ; i++){
      this.products[i].updatehtml();
    }
  }

  updatedom() {
    let thishtml='';
    for(let i=0; i< this.products.length ; i++){
      if (i % 3 == 0 ){
        thishtml += "<div class='row'>"; console.log("START")
      }
      thishtml += this.products[i].htmlview;
      if ((i % 3 == 2) || i == (this.products.length-1) ){
        thishtml += "</div>";console.log("FINISH")
      }
    }
    $("#content").append(thishtml)
  }
}

class Productobj {
  constructor(product, i) {
    this.photo        = product.photos.medium_half
    this.title        = product.name
    this.tagline      = product.tagline
    this.description  = product.description // added description
    this.url          = product.url
    this.htmlview     = ""
    this.index        = i
    this.custom_class = "col"+ ((i % 3) +1)
  }

  updatehtml() {
    //Added the description to the htmlview
    $.get('product-template.html', (template) => {
      this.htmlview = template.replace('{image}', this.photo)
        .replace('{title}', this.title)
        .replace('{description}', this.description)
        .replace('{tagline}', this.tagline)
        .replace('{url}', this.url);
        /*
        Took out the custom class and added a div in the product
        template to create columns.
        */
    });
  }
}

let $loading = $('.loading-div').show();
let page = new Domobj();
page.getproducts('data.json');
setTimeout("console.log('building html');page.updateproducthtml();",20);
setTimeout("page.updatedom(); loading(); ",5000)
/*
Changed the setTimeout timer up 5000ms because it wasnt
loading the images when I opened it on mobile, it might be
that I have a slow wifi connection.
*/

/*
Added this function to check that the document has completely
loaded hide the loading gif and make the body visible again
*/
let loading = () => {
  let interval = setInterval( () => {
    if(document.readyState === 'complete') {
      clearInterval(interval);
      $loading.hide();
      $('body').css("opacity", "1");
    }
  }, 100);
}
