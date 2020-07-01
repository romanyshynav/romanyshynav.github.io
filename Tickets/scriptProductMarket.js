let host = 'http://localhost:8080';
const searchParams = new URLSearchParams(window.location.search);

let $pageNumber = $('.page-number');
let $pageSize = $('.page-size');
let $container = $('.container');
let pages = 0;
let $sortedField = $('.sortField');
let $orderBy = $('.orderBy');
let $filterByName = $('#productFilterName');
let $filterByPriceMin = $('#productFilterPriceMin');
let $filterByPriceMax = $('#productFilterPriceMax');
let $category;

//=====================================================КАТАЛОГ продуктів, реакція розбивки сторінок===================================
    let appendProductToContainer = (product) => {           
        $container.append(`
        <div class="item">
            <h4 class="productName">${product.name}</h4>
            <img  src="${host}/img/${product.imageFileName}" alt="no image">
            <p>ID - ${product.id}</p>
            <span>Price - </span><span class="productPrice">${product.price}</span></br>
            <span>Category - </span><span class="productCategory">${product.categoryId}</span></br></br>

    <button data-id="${product.id}" class="favoriteButton btn">Улюбене</button>

        <button data-id="${product.id}" class="cartButton btn">В кошик</button>
    
        </div>  
        `);
    };    
    let printProducts = (products) => {
        $container.html('');    
        for (const product of products) {
            appendProductToContainer(product);   
        }      
    };
    let printCatalog = () => {
        $.ajax({
            url: `${host}/product/findPageAndSortAndFilterByCriteria?page=${$pageNumber.html() - 1}&size=${$pageSize.val()}&field=${$sortedField.val()}&name=${$filterByName.val()}&priceMin=${$filterByPriceMin.val()}&priceMax=${$filterByPriceMax.val()}&direction=${$orderBy.val()}`,
            type: 'get',
            success: (res) => {
                console.log(res);
                pages = res.totalPages;
                if (+$pageNumber.html() === pages) {
                    $('.btn-next').attr('disabled', 'true');
                } else {
                    $('.btn-next').removeAttr('disabled');
                }
                printProducts(res.data);
                actionOnCartButton();
                actionOnFavoriteButton();
            }
        })
    };
   $(document).ready(function(){            
        $('select').formSelect();
            
        printCatalog();
        
        $('.btn-next').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage < pages) {
                $pageNumber.html(currentPage + 1);
                printCatalog();
            }
        });
        $('.btn-prev').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage > 1) {
                $pageNumber.html(currentPage - 1);
                printCatalog();
            }
        });
        $('.page-size').change(() => {
            printCatalog();
        });
                $('.sortField').change(() => {
            printCatalog();
        });
          $('.orderBy').change(() => {
            printCatalog();
        });
         $('#productFilterButton').click(() => {
            printCatalog();
        });
    });


//=====================================================Кнопка "В КОШИК"=========================================================
let actionOnCartButton = () => {
    $('.cartButton').click((e) => {
        let productId = $(e.target).attr('data-id');
        $.ajax({
            url: `${host}/cart/addProductToCart?cartId=${searchParams.get('id')}&productId=${productId}`,
            type: 'post',
            success: () => {
                console.log('added some product to cart!!!!');
            }
        });
    })
};

//=====================================================Кнопка "УЛЮБЛЕНЕ"=========================================================
let actionOnFavoriteButton = () => {
    $('.favoriteButton').click((e) => {
        let productId = $(e.target).attr('data-id');
        // запит на видалення поїзда
        $.ajax({
            url: `${host}/person/addProductToFavoriteList?personId=${searchParams.get('id')}&productId=${productId}`,
            type: 'post',
            success: () => {
                console.log('added some product to favoriteList!!!!');
            }
        });
    })
};

//======================================================Обробка помилки================================================================== 
function logError(err) {
    console.log(err)
}