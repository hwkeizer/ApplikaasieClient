var baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).ready(function () {
    $("#addNewProductLink").click(function (event) {
        event.preventDefault();
        hideAll();
        $("#addNewProduct").show(500);
        addNewProduct();

    });

    showAllProducts();
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
            $("#productTable").tabulator({
                layout: "fitColumns",
                columns: [
                    {title: "Naam", field: "name", headerFilter: "input"},
                    {formatter: "money", title: "Prijs", field: "price", align: "right"},
                    {title: "Voorraad", field: "stock"},
                    {title: "Productstatus", field: "productStatus", headerFilter: "input"}
                ],
                rowClick: function (e, row) {
                    hideAll();
                    $("#showOneProduct").show(500);
                    showOneProduct(row.getData());
                }
            });
            $("#productTable").tabulator("setData", data);
        }
    });
}

function showOneProduct(product) {

    $("#showOneProduct").html("");
    $("#showOneProduct").append("<button id='backToAllProducts1'>Terug naar overzicht</button>");
    $("#showOneProduct").append("<br/><br/><button id='editProductButton'>Product wijzigen</button>");
    $("#showOneProduct").append("<br/><br/><button id='deleteProductButton'>Product verwijderen</button>");
    $("#showOneProduct").append("<ul>" +
            "<li>Naam: " + product.name + "</li>" +
            "<li>Prijs: " + product.price + "</li>" +
            "<li>Voorraad: " + product.stock + "</li>" +
            "<li>Productstatus: " + product.productStatus + "</li>" +
            "</ul>");

    $("#backToAllProducts1").click(function (event) {

        hideAll();
        $("#productTable").show(500);
    });

    $("#editProductButton").click(function (event) {

        hideAll();
        $("#editProduct").show(500);
        editProduct(product);
    });

    $("#deleteProductButton").click(function (event) {
        deleteProduct(product);
    });
}

function editProduct(product) {

    $("#editProduct").find('#productName').val(product.name);
    $("#editProduct").find('#productPrice').val(product.price);
    $("#editProduct").find('#productStock').val(product.stock);
    $("#editProduct").find('#productStatus').val(product.productStatus);

    $("#editButton").click( function (event) {
        var newProduct = {
            "id": product.id,
            "name": $("#productName").val(),
            "price": $("#productPrice").val(),
            "stock": $("#productStock").val(),
            "productStatus": $("#productStatus").val()
        };

        var productJson = JSON.stringify(newProduct);
        updateProduct(newProduct.id, productJson);

    });

    function updateProduct(id, product) {
        $.ajax({
            method: "PUT",
            url: baseURL + "/product/" + id,
            data: product,
            contentType: "application/json",
            error: function () {
                console.log("error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/product.html";
            }
        })
    }

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

function addNewProduct() {
    $("#addNewProduct").html("");
    $("#addNewProduct").append("<button id='backToAllProducts'>Terug naar overzicht</button><br/><br/>");


    $("#addNewProduct").append("" +
            "<form id='newProduct'>" +
            "<label>Naam: </label><input type='text' id='inputName'></input><br/>" +
            "<label>Prijs: </label><input type='text' id='inputPrice'></input><br/>" +
            "<label>Voorraad: </label><input type='number' id='inputStock'></input><br/>" +
            "<label>Productstatus: </label><input type='text' id='inputProductStatus'></input><br/>" +
            "<br/><br/><button id='saveProduct' type='submit'>Submit</button>" +
            "</form>"
            );

    $("#backToAllProducts").click(function (event) {
        hideAll();
        $("#productTable").show(500);
    });


    $("#saveProduct").click(function (event) {
        saveProduct();
    });
}

function saveProduct() {
    if (confirm("Product opslaan?")) {
        $(document).on("submit", "form#newProduct", function (event) {
            event.preventDefault();
            var product = {
                "name": $("#inputName").val(),
                "price": $("#inputPrice").val(),
                "stock": $("#inputStock").val(),
                "productStatus": $("#inputProductStatus").val()
            };
            var productJson = JSON.stringify(product);
            createProduct(productJson);
        });

        function createProduct(product) {
            $.ajax({
                method: "POST",
                url: baseURL + "/product",
                data: product,
                contentType: "application/json",
                error: function () {
                    console.log("error");
                },
                success: function () {
                    window.location.href = "http://localhost:8080/product.html";
                }
            });
        }
    }
}

// Utility method to hide all elements. Can be called in methods, followed by showX to show just 1 element

function hideAll() {
    $("#productTable").hide(500);
    $("#showOneProduct").hide(500);
    $("#addNewProduct").hide(500);
    $("#editProduct").hide(500);
}
