let host = 'http://localhost:8080';
let tableBody = $('#categoryTableRow');
    let $pageNumber = $('.page-number');
    let $pageSize = $('.page-size');
    let pages = 0;
let $sortedField = $('.sortField');
let $orderBy = $('.orderBy');
let $filterByName = $('#categoryFilterName');



//=====================================================Елементи посторіночної розбивки та сортування=====================================-->
let printCategoryRow = () => {
    tableBody.html('');
        $.ajax({
            url: `${host}/category/findPageAndSort?page=${$pageNumber.html() - 1}&size=${$pageSize.val()}&field=${$sortedField.val()}&direction=${$orderBy.val()}`,
            type: 'get',
            success: (res) => {
                console.log(res);
                pages = res.totalPages;
                if (+$pageNumber.html() === pages) {
                    $('.btn-next').attr('disabled', 'true');
                } else {
                    $('.btn-next').removeAttr('disabled');
                }
                 for (let category of res.data) {
                appendCategoryToTable(category);
            }
            actionOnDeleteButton();
            actionOnUpdateButton();
            }
        })
    };
let printPageSortFilCategoryRow = () => {
    tableBody.html('');
        $.ajax({
            url: `${host}/category/findPageAndSortAndFilterByCriteria?page=${$pageNumber.html() - 1}&size=${$pageSize.val()}&field=${$sortedField.val()}&direction=${$orderBy.val()}&name=${$filterByName.val()}`,
            type: 'get',
            success: (res) => {
                console.log(res);
                pages = res.totalPages;
                if (+$pageNumber.html() === pages) {
                    $('.btn-next').attr('disabled', 'true');
                } else {
                    $('.btn-next').removeAttr('disabled');
                }
                 for (let category of res.data) {
                appendCategoryToTable(category);
            }
            actionOnDeleteButton();
            actionOnUpdateButton();
            }
        })
    };

    $(document).ready(function(){

        $('select').formSelect();
        printPageSortFilCategoryRow();

        $('.btn-next').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage < pages) {
                $pageNumber.html(currentPage + 1);
                printPageSortFilCategoryRow();
            }
        });

        $('.btn-prev').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage > 1) {
                $pageNumber.html(currentPage - 1);
                printPageSortFilCategoryRow();
            }
        });

        $('.page-size').change(() => {
            printPageSortFilCategoryRow();
        });
        $('.sortField').change(() => {
            printPageSortFilCategoryRow();
        });
          $('.orderBy').change(() => {
            printPageSortFilCategoryRow();
        });
         $('#categoryFilterButton').click(() => {
            printPageSortFilCategoryRow();
        });
    });

//=====================================================Розмітка рядка таблички з поїздами===================================================
let appendCategoryToTable = (category) => {
    tableBody.append(`
    <tr>
    <td>${category.id}</td>
    <td class="categoryName">${category.name}</td>
  <td>
    <button data-id="${category.id}" data-target="categoryUpdateModal" class="updateButton btn modal-trigger">
            Update
            </button>
        <button data-id="${category.id}" class="deleteButton btn">Delete</button>
    </td>
</tr>
    `)
};

//=====================================================СТВОРИТИ рандомно новий продукт=======================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#categoryRandomCreateButton').click(() => {

        let quantity = $('#categoryInputQuantity').val();

        $.ajax({
            url: `${host}/category/createRandomCategory?quantity=${quantity}`,
            type: 'post',
            success: () => {
                console.log('created random category!!!!');
                printPageSortFilCategoryRow();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================СТВОРИТИ вручну новий продукт========================================================

$(document).ready(function () {
    $('.modal').modal();

    $('#categoryCreateButton').click(() => {
        if ($('#categoryInputName').val().length < 3) {
            alert('min 3 symbols')
            return;
        }

        let categoryRequest = {
            name: $('#categoryInputName').val()           
        };

        $.ajax({
            url: `${host}/category`,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(categoryRequest),
            success: () => {
                console.log('created some category!!!!');
                printPageSortFilCategoryRow();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================РЕДАГУВАТИ продукт==================================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#categoryUpdateButton').click(() => {

        let categoryRequest = {
            name: $('#categoryUpdateInputName').val()
        };

        let id = $('#categoryUpdateInputName').attr('data-id');

        $.ajax({
            url: `${host}/category?id=${id}`,
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify(categoryRequest),
            success: () => {
                console.log('Updated some category!!!!');
                printPageSortFilCategoryRow();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});
//=====================================================Кнопка РЕДАГУВАТИ один продукт АВТОЗАПОВНЕННЯ ПОЛІВ====================================

let actionOnUpdateButton = () => {
    $('.updateButton').click((e) => {
        let $btn = $(e.target);
        let id = $btn.attr('data-id');
        $('#categoryUpdateInputName').val($btn.parent().siblings('.categoryName').html());
        $('#categoryUpdateInputName').attr('data-id', id);
    })
};

//=====================================================Кнопка ВИДАЛИТИ один продукт=========================================================
let actionOnDeleteButton = () => {
    $('.deleteButton').click((e) => {
        let id = $(e.target).attr('data-id');
        
        $.ajax({
            url: `${host}/category?id=${id}`,
            type: 'delete',
            success: () => {
                console.log('deleted some category!!!!');
                $(e.target.parentElement.parentElement).hide();
            }
        });
    })
};

//=====================================================Кнопка ВИДАЛИТИ всі категорії=========================================================
$(document).ready(function () {
    $('#categoryDeleteAllButton').click(() => {
        $.ajax({
            url: `${host}/category/deleteAll`,
            type: 'delete',
            success: () => {
                console.log('deleted All category!!!!');
                printPageSortFilCategoryRow();
            }
        });
    })
});

function logError(err) {
    console.log(err)
}