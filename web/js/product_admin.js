var baseURL = "http://localhost:8080/Workshop3/webresources";
var selectedProduct;

$(document).ready(function () {
    showAllProducts();

    $("#addProduct").click(function (event) {
        event.preventDefault();
        $("#buttons").hide(500);
        $("#newProduct").show(500);
        $(".edit_instruction").hide(500);
    });

    $("#editProductButton").click(function (event) {
        event.preventDefault();
        $(".edit_instruction").show(500);
    });
    
    $("#cancelEditProduct").click(function (event) {
        event.preventDefault();
        $("#buttons").show(500);
        $("#editProduct").hide(500);
    });
    
    

    $("#submitEditProduct").click(function (event) {
        event.preventDefault();
        editProduct();
    });

    $("#submitNewProduct").click(function (event) {
        event.preventDefault();
        saveProduct();
    });

    $("#cancelNewProduct").click(function (event) {
        event.preventDefault();
        $("#buttons").show(500);
        $("#newProduct").hide(500);
    });



});

function showAllProducts() {
    $.ajax({
        method: "GET",
        url: baseURL + "/product",
        dataType: "json",
        error: function () {
            console.log("error");
        },
        success: function (data) {
            data.sort(compare);
            $("#productTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Naam", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs/stuk", field: "price", align: "right"},
                    {title: "Voorraad", field: "stock"},
                    {title: "Productstatus", field: "productStatus", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    
                    selectedProduct = row.getData();
                    fillEditProductForm();

                    $("#buttons").hide(500);
                    $(".edit_instruction").hide(500);
                    $("#newProduct").hide(500);
                    $("#editProduct").show(500);
                }
            });
            $("#productTable").tabulator("setData", data);
        }
    });
}

function fillEditProductForm() {
    console.log("Selected product: " + selectedProduct.name);
    $('#editProduct').find('#product_name').val(selectedProduct.name);
    $('#editProduct').find('#product_price').val(selectedProduct.price);
    $('#editProduct').find('#product_stock').val(selectedProduct.stock);
    $('#editProduct').find('#product_status').val(selectedProduct.productStatus);
}

function editProduct() {

    var newProduct = {
        "id": selectedProduct.id,
        "name": $("#product_name").val(),
        "price": $("#product_price").val(),
        "stock": $("#product_stock").val(),
        "productStatus": $("#product_status").val()
    };

    console.log("Making json");
    var productJson = JSON.stringify(newProduct);

    console.log("Entering ajax method");
    $.ajax({
        method: "PUT",
        url: baseURL + "/product/" + selectedProduct.id,
        data: productJson,
        contentType: "application/json",
        error: function () {
            console.log("error");
        },
        success: function () {
            console.log("Product edited succesfully");
            window.location.href = "http://localhost:8080/product_admin.html";
        }
    });
}

function deleteProduct(product) {
    if (confirm("Product verwijderen?")) {
        $.ajax({
            method: "DELETE",
            url: baseURL + "/product/" + product.id,
            error: function () {
                alert("Dit product kon niet verwijderd worden");
            },
            success: function () {
                window.location.href = "http://localhost:8080/product.html";
            }
        });
    }
}

function saveProduct() {

    var product = {
        "name": $("#product_name_new").val(),
        "price": $("#product_price_new").val(),
        "stock": $("#product_stock_new").val(),
        "productStatus": $("#product_status_new").val()
    };

    var productJson = JSON.stringify(product);

    $.ajax({
        method: "POST",
        url: baseURL + "/product",
        data: productJson,
        contentType: "application/json",
        error: function () {
            console.log("error");
        },
        success: function () {
            window.location.href = "http://localhost:8080/product_admin.html";
        }
    });
}

function hideAll() {
    $("#productTable").hide(500);
    $("#showOneProduct").hide(500);
    $("#addNewProduct").hide(500);
    $("#editProduct").hide(500);
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
