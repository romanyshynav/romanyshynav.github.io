let host = 'http://localhost:8080';
let $pageNumber = $('.page-number');
let $pageSize = $('.page-size');
let $container = $('.container');
let pages = 0;
let $sortedField = $('.sortField');
let $orderBy = $('.orderBy');
let $filterByName = $('#productFilterName');
let $filterByPriceMin = $('#productFilterPriceMin');
let $filterByPriceMax = $('#productFilterPriceMax');
let $filterByCategoryId = $('#productFilterCategoryId');


//=====================================================Вибір КАТЕГОРІЇ для ПРОДУКТУ ===================================
let $categorySelect = $('.categorySelect');
let appendCategoryToSelect = (category) => {           
        $categorySelect.append(`
        <option value="${category.id}">${category.name}</option>
        `);
    }; 
let printCategoriesToSelect = (categories) => {
        for (const category of categories) {
            appendCategoryToSelect(category);
        }  
    $('select').formSelect();
    };
//=====================================================КАТАЛОГ продуктів, реакція розбивки сторінок===================================
    let appendProductToContainer = (product) => {           
        $container.append(`
        <div class="item">
            <h4 class="productName">${product.name}</h4>
            <img  src="${host}/img/${product.imageFileName}" alt="no image">
            <p>ID - ${product.id}</p>
            <span>Price - </span><span class="productPrice">${product.price}</span></br>
            <span>Category - </span><span id="productCategory_id">${product.categoryId}</span></br></br>

    <button data-id="${product.id}" data-target="productUpdateModal" class="updateButton btn modal-trigger">
            Update
            </button>

        <button data-id="${product.id}" class="deleteButton btn">Delete</button>
    
        </div>  
        `);
    };    
    let printProducts = (products) => {
        $container.html('');    
        for (const product of products) {
            appendProductToContainer(product); 
        }
    };
    let printProductCatelog = () => {
        $.ajax({
            url: `${host}/product/findPageAndSortAndFilterByCriteria?page=${$pageNumber.html() - 1}&size=${$pageSize.val()}&field=${$sortedField.val()}&direction=${$orderBy.val()}&name=${$filterByName.val()}&priceMin=${$filterByPriceMin.val()}&priceMax=${$filterByPriceMax.val()}&categoryId=${$filterByCategoryId.val()}`,
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
                actionOnDeleteButton();
                 actionOnUpdateButton();
            }
        })
    };
   $(document).ready(function(){            
           $.ajax({
            url: `${host}/category`,
            type: 'get',
            success: printCategoriesToSelect,
            error: logError()
        });
                
        
        printProductCatelog();
        
        $('.btn-next').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage < pages) {
                $pageNumber.html(currentPage + 1);
                printProductCatelog();
            }
        });
        $('.btn-prev').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage > 1) {
                $pageNumber.html(currentPage - 1);
                printProductCatelog();
            }
        });
        $('.page-size').change(() => {
            printProductCatelog();
        });
        $('.sortField').change(() => {
            printProductCatelog();
        });
        $('.orderBy').change(() => {
            printProductCatelog();
        });
         $('#productFilterButton').click(() => {
            printProductCatelog();
        });
    });

//=====================================================ЗАВАНТАЖЕННЯ файлів========================================================
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
document.getElementById("sendFileCreate").onclick = function () {
    var file = document.getElementById("getFileCreate").files[0];
    getBase64(file).then(data => {
        $('#productInputImageB64Format').val(data);
    });
};
document.getElementById("sendFileUpdate").onclick = function () {
    var file = document.getElementById("getFileUpdate").files[0];
    getBase64(file).then(data => {
        //work with data as src of file
        $('#productUpdateInputImageB64Format').val(data);
    });
};

//=====================================================СТВОРИТИ вручну новий продукт========================================================
$(document).ready(function () {
    $('.modal').modal();

    $('#productCreateButton').click(() => {
        if ($('#productInputName').val().length < 3) {
            alert('min 3 symbols')
            return;
        }

        let productRequest = {
            name: $('#productInputName').val()   ,        
            price: $('#productInputPrice').val() ,
            imageB64Format: $('#productInputImageB64Format').val() ,
            categoryId: $('.categorySelect').val()
        };

        $.ajax({
            url: `${host}/product`,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(productRequest),
            success: () => {
                console.log('created some product!!!!');
                printProductCatelog();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================СТВОРИТИ рандомно новий продукт=======================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#productRandomCreateButton').click(() => {

        let quantity = $('#productInputQuantity').val();

        $.ajax({
            url: `${host}/product/createRandomProducts?quantity=${quantity}`,
            type: 'post',
            success: () => {
                console.log('created random product!!!!');
                printProductCatelog();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================Кнопка ВИДАЛИТИ ВСІ продукти=========================================================
$(document).ready(function () {
    $('#productDeleteAllButton').click(() => {
        $.ajax({
            url: `${host}/product/deleteAll`,
            type: 'delete',
            success: () => {
                console.log('deleted All product!!!!');
                printProductCatelog();
            }
        });
    })
});

//=====================================================Кнопка ВИДАЛИТИ ОДИН продукт=========================================================
let actionOnDeleteButton = () => {
    $('.deleteButton').click((e) => {
        let id = $(e.target).attr('data-id');
        $.ajax({
            url: `${host}/product?id=${id}`,
            type: 'delete',
            success: () => {
                console.log('deleted some product!!!!');
                $(e.target.parentElement).hide();
            }
        });
    })
};
//=====================================================РЕДАГУВАТИ продукт==================================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#productUpdateButton').click(() => {

        let productRequest = {
            name: $('#productUpdateInputName').val()   ,        
            price: $('#productUpdateInputPrice').val() ,
            imageB64Format: $('#productUpdateInputImageB64Format').val() ,
            categoryId: $('#productUpdateInputCategoryId').val() 
        };

        let id = $('#productUpdateInputName').attr('data-id');

        $.ajax({
            url: `${host}/product?id=${id}`,
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify(productRequest),
            success: () => {
                console.log('Updated some product!!!!');
                printProductCatelog();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================Кнопка РЕДАГУВАТИ ОДИН продукт АВТОЗАПОВНЕННЯ ПОЛІВ====================================
let actionOnUpdateButton = () => {
    $('.updateButton').click((e) => {
        let $btn = $(e.target);
        let id = $btn.attr('data-id');
        $('#productUpdateInputName').val($btn.siblings('.productName').html());
        $('#productUpdateInputPrice').val($btn.siblings('.productPrice').html());
        $('#productUpdateInputCategoryId').val($btn.siblings('.productCategory').html());
        $('#productUpdateInputName').attr('data-id', id);
    })
};

//======================================================Обробка помилки================================================================== 
function logError(err) {
    console.log(err)
}