
let productRow = document.querySelector(".product-row");

let productBaskets = document.getElementsByClassName("product-shop-btn");

let basketNumber = document.querySelector(".basket-number");

let basketContainer = document.querySelector(".basket-container");

let productAboutContainer = document.querySelector(".product-container");

let basketTotalCount = document.querySelector(".totalCount");

let basketTotalPrice = document.querySelector(".totalPrice");


let baskets = JSON.parse(localStorage.getItem("basket")) || [];

let products = getProductsFromApi();

document.addEventListener("DOMContentLoaded", function(){
    products.then((data) => Showproducts(data));
    products.then((data) => Showbaskets(data));
})



function Showproducts(products){
    
    productRow.innerHTML = "";

    products.forEach(product => {

        let hasBasket = baskets.some((basket) => basket.id == product.id);

        productRow.innerHTML+= ` <div class="col-xl-4">
                    <div class="card product-card">
                        <img src="${product.image}" class="card-img-top product-img" alt="${product.title}">
                        <div class="card-body">
                          <h5 class="card-title">${getTitle(product.title, 20)}</h5>
                          <b class="card-text">Price: ${product.price} AZN</b>
                          <p class="card-text">${getTitle(product.description, 60)}</p>
                          <button class="btn btn-primary btn-detail" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id = '${product.id}'>Open Details</button>
                        </div>
                        <button class='product-shop-btn ${hasBasket ? "active" : ""}' data-id = '${product.id}'><i class="fa-solid fa-cart-plus"></i></button>
                      </div>
                </div>`
        
    });


    AddEventsToBasketBtn();
    ShowProductDetail();

}



function ShowProductDetail(){
    let btnDetails = document.getElementsByClassName("btn-detail");

    for (const btn of btnDetails) {
        
        btn.addEventListener("click", function (e) {
            let id = e.currentTarget.getAttribute("data-id");

            // API-dən məhsul məlumatlarını almaq
            fetch(`https://fakestoreapi.com/products/${id}`)
                .then(response => response.json())
                .then(product => {

                    productAboutContainer.innerHTML = `
                        <div class="product-about">
                            <img src="${product.image}" alt="${product.title}" style="width: 200px;">
                            <h2>${product.title}</h2>
                            <span>${product.price} AZN</span>
                            <p>${product.description}</p>
                        </div>
                    `;
                })
                .catch(error => console.error('Error:', error));
            })
    }
}


function AddEventsToBasketBtn(){

    for (const btn of productBaskets) {

        btn.addEventListener("click", function(e){
            let thisElem = e.currentTarget;

           let id = Number(thisElem.getAttribute("data-id"));

           if(thisElem.classList.contains("active")){
            baskets = baskets.filter((basket) => basket.id !== id)
           }
           else{
            baskets.push({
                id: id,
                count: 1,
            });
           }

            thisElem.classList.toggle("active");

            // console.log(baskets);

            localStorage.setItem("basket", JSON.stringify(baskets));

            products.then((data) => Showbaskets(data))

        })
        
    }

}


function Showbaskets(products){
    let totalCount = 0;
    let TotalPrice = 0;
    basketContainer.innerHTML = "";

    baskets.forEach((basket) => {
        let product = products.find(p => p.id == basket.id);

        basketContainer.innerHTML+= `  <div class="basket-elemet">
                    <h2>${getTitle(product.title, 20)}</h2>
                    <span class="basket-price">${product.price} AZN</span>
                    <div class="basket-btn">
                        <button class='decrement-count' data-id='${basket.id}'><i class="fa-solid fa-minus"></i></button>
                        <span>X ${basket.count}</span>
                        <button class='inceremt-count' data-id='${basket.id}'><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <span>${(basket.count * product.price).toFixed(2)} AZN</span>
                    <button class="delete-btn" data-id=${basket.id}><i class="fa-solid fa-trash"></i></button>
                </div>
        `
        totalCount += basket.count;
        TotalPrice += (basket.count * product.price);
    });
    

    basketTotalCount.textContent = `Total ${totalCount}:`;

    basketTotalPrice.textContent = `Total amount: ${TotalPrice.toFixed(2)} AZN`

    AddeventsToBasket();


    basketNumber.textContent = baskets.length;

}

function getTitle(title,count){
    return title.length > count ? title.substring(0,count).concat("...") : title;
}


function getProductsFromApi(){
    return fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())

}

function AddeventsToBasket(){

    let minusBtns = document.getElementsByClassName("decrement-count");
    let plusBtns = document.getElementsByClassName("inceremt-count");
    let deleteBtns = document.getElementsByClassName("delete-btn");


    for (const btn of minusBtns) {

        btn.addEventListener("click", function(e){

            OperacitonCount(e, -1,((count) => count > 1));

        }) 
    }


    for (const btn of plusBtns) {

        btn.addEventListener("click", function(e){

            OperacitonCount(e, 1,((count) => count < 10));

        }) 
    }



    for (const btn of deleteBtns) {

        btn.addEventListener("click", function(e){

            let id = Number(e.currentTarget.getAttribute("data-id"));

            baskets = baskets.filter((basket) => basket.id !== id);

            localStorage.setItem("basket", JSON.stringify(baskets));

            products.then((data) => Showbaskets(data));

            products.then((data) => Showproducts(data));


        }) 
    }

   
}



function OperacitonCount(e, count, callback){
    let id = Number(e.currentTarget.getAttribute("data-id"));

    let basketObj = baskets.find((b) => b.id === id)

    baskets = baskets.map((basket) => {
       if(callback(basket.count)){
        return {
            ...basket,
            count: basket.id === basketObj.id ? basket.count + count : basket.count
        }
       }
       else{
        return basket;
       }
    })

    localStorage.setItem("basket", JSON.stringify(baskets));

    products.then((data) => Showbaskets(data))

}