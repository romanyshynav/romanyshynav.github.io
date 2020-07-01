let host = 'http://localhost:8080';
let tableBody = $('#personTableRow');
    let $pageNumber = $('.page-number');
    let $pageSize = $('.page-size');
    let pages = 0;
let $sortedField = $('.sortField');
let $orderBy = $('.orderBy');
let $filterByName = $('#personFilterName');
let $filterByMoneyMin = $('#personFilterMoneyMin');
let $filterByMoneyMax = $('#personFilterMoneyMax');



//=====================================================Елементи посторіночної розбивки та сортування=====================================-->
let printPageSortFilPersonRow = () => {
    tableBody.html('');
        $.ajax({
            url: `${host}/person/findPageAndSortAndFilterByCriteria?page=${$pageNumber.html() - 1}&size=${$pageSize.val()}&field=${$sortedField.val()}&direction=${$orderBy.val()}&fname=${$filterByName.val()}&moneyMin=${$filterByMoneyMin.val()}&moneyMax=${$filterByMoneyMax.val()}`,
            type: 'get',
            success: (res) => {
                console.log(res);
                pages = res.totalPages;
                if (+$pageNumber.html() === pages) {
                    $('.btn-next').attr('disabled', 'true');
                } else {
                    $('.btn-next').removeAttr('disabled');
                }
                 for (let person of res.data) {
                appendPersonToTable(person);
            }
            actionOnDeleteButton();
            actionOnUpdateButton();
            }
        })
    };

    $(document).ready(function(){

        $('select').formSelect();
        printPageSortFilPersonRow();

        $('.btn-next').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage < pages) {
                $pageNumber.html(currentPage + 1);
                printPageSortFilPersonRow();
            }
        });

        $('.btn-prev').click(() => {
            let currentPage = +$pageNumber.html();
            if (currentPage > 1) {
                $pageNumber.html(currentPage - 1);
                printPageSortFilPersonRow();
            }
        });

        $('.page-size').change(() => {
            printPageSortFilPersonRow();
        });
        $('.sortField').change(() => {
            printPageSortFilPersonRow();
        });
          $('.orderBy').change(() => {
            printPageSortFilPersonRow();
        });
         $('#personFilterButton').click(() => {
            printPageSortFilPersonRow();
        });
    });

//=====================================================Розмітка рядка таблички з поїздами===================================================
let appendPersonToTable = (person) => {
    tableBody.append(`
    <tr>
    <td>${person.id}</td>
    <td class="personName">${person.fname}</td>
    <td><img  src="${host}/img/${person.imageFileName}" alt="no image"></td>
    <td class="personMoney">${person.money}</td>
  <td>
    <button data-id="${person.id}" data-target="personUpdateModal" class="updateButton btn modal-trigger">
            Update</button>
    <button data-id="${person.id}" class="deleteButton btn">Delete</button>
    <a class="btn details" href="http://localhost:8080/personDetails?id=${person.id}" target="_blank">Details</a>
  </td>

</tr>
    `)
};

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
        //work with data as src of file
        $('#personInputImageB64Format').val(data);
    });
};
document.getElementById("sendFileUpdate").onclick = function () {
    var file = document.getElementById("getFileUpdate").files[0];
    getBase64(file).then(data => {
        //work with data as src of file
        $('#persoUpdateInputImageB64Format').val(data);
    });
};

//=====================================================СТВОРИТИ рандомно новий продукт=======================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#personRandomCreateButton').click(() => {

        let quantity = $('#personInputQuantity').val();

        $.ajax({
            url: `${host}/person/createRandomPersons?quantity=${quantity}`,
            type: 'post',
            success: () => {
                console.log('created random person!!!!');
                printPageSortFilPersonRow();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================СТВОРИТИ вручну новий продукт========================================================
$(document).ready(function () {
    $('.modal').modal();

    $('#personCreateButton').click(() => {
        if ($('#personInputName').val().length < 3) {
            alert('min 3 symbols')
            return;
        }

        let personRequest = {
            fname: $('#personInputName').val(),
            imageB64Format: $('#personInputImageB64Format').val() ,
            money: $('#personInputMoney').val()
        };

        $.ajax({
            url: `${host}/person`,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(personRequest),
            success: () => {
                console.log('created some person!!!!');
                printPageSortFilPersonRow();
                $('.modal').modal('close');
            },
            error: logError()
        });
    });
});

//=====================================================РЕДАГУВАТИ продукт==================================================================
$(document).ready(function () {
    $('.modal').modal();
    $('#personUpdateButton').click(() => {

        let personRequest = {
            fname: $('#personUpdateInputName').val(),
            imageB64Format: $('#persoUpdateInputImageB64Format').val() ,
            money: $('#persoUpdateInputMoney').val()
        };

        let id = $('#personUpdateInputName').attr('data-id');

        $.ajax({
            url: `${host}/person?id=${id}`,
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify(personRequest),
            success: () => {
                console.log('Updated some person!!!!');
                printPageSortFilPersonRow();
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
        $('#personUpdateInputName').val($btn.parent().siblings('.personName').html());
        $('#persoUpdateInputMoney').val($btn.parent().siblings('.personMoney').html());
        $('#personUpdateInputName').attr('data-id', id);
    })
};

//=====================================================Кнопка ВИДАЛИТИ один продукт=========================================================
let actionOnDeleteButton = () => {
    $('.deleteButton').click((e) => {
        let id = $(e.target).attr('data-id');
        $.ajax({
            url: `${host}/person?id=${id}`,
            type: 'delete',
            success: () => {
                console.log('deleted some person!!!!');
                $(e.target.parentElement.parentElement).hide();
            }
        });
    })
};

//=====================================================Кнопка ВИДАЛИТИ всі категорії=========================================================
$(document).ready(function () {
    $('#personDeleteAllButton').click(() => {
        $.ajax({
            url: `${host}/person/deleteAll`,
            type: 'delete',
            success: () => {
                console.log('deleted All person!!!!');
                printPageSortFilPersonRow();
            }
        });
    })
});

//========================================================================================================================================
function logError(err) {
    console.log(err)
}