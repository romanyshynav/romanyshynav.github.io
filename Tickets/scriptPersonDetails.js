let host = 'http://localhost:8080';
const searchParams = new URLSearchParams(window.location.search);
let tableBody = $('#productTableRow');
let tableBodyCart = $('#cartTableRow');
let container = $('.container');


//========================================Вивід інформації про людину=========================================================
const appendPersonInfo = (person)=>{
    $('.title').html(person.fname)
        $('.container').append(`
        <img class="itemFoto" src="${host}/img/${person.imageFileName}" alt="no image">
        <div class="itemDescription">
        <p>ID - ${person.id}</p>
        <span>Money - </span><span>${person.money}</span></br>
        <span>Корзинка (ID) - </span><span class="cartId"></span></br>
<a class="btn" href="http://localhost:8080/productMarket?id=${person.id}" target="_blank">Обрати продукти</a>
        </div>    
`)};
let findPersonCart = (cartId) => {
              $.ajax({
                url: `${host}/cart/findOneById?id=${cartId}`,
                type: 'get',
                success: (res) =>{
                    $('.cartId').append(`
                    ${res.id}
            `);
                },
            error: logError() 
            }); 
    };    

//========================================Вивід списку ЛАЙКНУТИХ продуктів, опції з ними===============================================
let appendFavoriteProductsRow = (product) => {
    tableBody.append(`
    <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td><img  src="${host}/img/${product.imageFileName}" alt="no image"></td>
    <td>${product.price}</td>
    <td class="categoryId">${product.categoryId}</td>

       <td> <button data-id="${product.id}" class="deleteButton btn">Delete</button></td>
    
 </tr>
    `)
};    
let findFavoriteProduct = (productId) => {
              $.ajax({
                url: `${host}/product/findOneById?id=${productId}`,
                type: 'get',
                success: (res) =>{
                    appendFavoriteProductsRow(res);
                    actionOnDeleteButton();       
                },
            error: logError() 
            }); 
    };
let printFavoriteProductsTable = (productIdList) => {
        for (const productId of productIdList) {
            findFavoriteProduct(productId);   
        }            
    };
let findProductCategory = (categoryId) => {
              $.ajax({
                url: `${host}/category/findOneById?id=${categoryId}`,
                type: 'get',
                success: (res) =>{
                    $('.categoryId').append(`
                    ${res.name}
            `);
                },
            error: logError() 
            }); 
    };

//========================================Вивід списку КОРЗИНКИ продуктів, опції з ними===============================================
let appendCartProductsRow = (product) => {
    tableBodyCart.append(`
    <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td><img  src="${host}/img/${product.imageFileName}" alt="no image"></td>
    <td>${product.price}</td>
    <td class="categoryId">${product.categoryId}</td>

       <td> <button data-id="${product.id}" class="deleteCartButton btn">Delete</button></td>
    
 </tr>
    `)
};    
let findCartProduct = (productId) => {
              $.ajax({
                url: `${host}/product/findOneById?id=${productId}`,
                type: 'get',
                success: (res) =>{
                    appendCartProductsRow(res);
                    actionOnDeleteCartButton();
                },
            error: logError() 
            }); 
    };
let printCartProductsToTable = (productIdList) => {
        for (const productId of productIdList) {
            findCartProduct(productId);   
        }            
    };
let findCartProductList = (cartId) => {
              $.ajax({
                url: `${host}/cart/findOneById?id=${cartId}`,
                type: 'get',
                success: (res) =>{
                   printCartProductsToTable(res.cartProductIdList);
                },
            error: logError() 
            }); 
    };  

//=====================================================Кнопка ВИДАЛИТИ лайкнутий  продукт==================================
let actionOnDeleteButton = () => {
    $('.deleteButton').click((e) => {
        let productId = $(e.target).attr('data-id');
console.log('clickclickclickclick!!!!');
        $.ajax({
            url: `${host}/person/removeProductFromFavoriteList?personId=${searchParams.get('id')}&productId=${productId}`,
            type: 'post',
            success: () => {
                console.log('deleted some FavoriteProduct!!!!');
                $(e.target.parentElement.parentElement).hide();
            }
        });
    })
};

//=====================================================Кнопка ВИДАЛИТИ з КОРЗИНКИ  продукт==================================
let actionOnDeleteCartButton = () => {
    $('.deleteCartButton').click((e) => {
        let productId = $(e.target).attr('data-id');
console.log('clickclickclickclick!!!!');
        $.ajax({
            url: `${host}/cart/removeProductFromCart?cartId=${searchParams.get('id')}&productId=${productId}`,
            type: 'post',
            success: () => {
                console.log('deleted product from Cart!!!!');
                $(e.target.parentElement.parentElement).hide();
            }
        });
    })
};

//=========================================Запуск сторінки покупця==========================================================================
let printPersonInfo = ()=>{
    $.ajax({
        url: `${host}/person/findOneById?id=${searchParams.get('id')}`,
        type: 'get',
        success: (res) => {
            appendPersonInfo(res);
            findPersonCart(res.cartId);
            printFavoriteProductsTable(res.personFavoriteProductIdList);
            findCartProductList(res.cartId);
        },
        error: logError() 
    });
    };
printPersonInfo();

//===================================================================================================================
function logError(err) {
    console.log(err)
}