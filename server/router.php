<?php
    $request = $_SERVER['REQUEST_URI'];
    require_once __DIR__ . '/controller/product_controller.php';
    require_once __DIR__ . '/controller/category_controller.php';
    require_once __DIR__ . '/controller/homeList_controller.php';
    require_once __DIR__ . '/controller/validation_controller.php';
    require_once __DIR__ . '/controller/login_controller.php';
    require_once __DIR__ . '/middleware.php';
   
    switch ($request) {
        case '/server.php/product_getList' :
            product_getList();
            break;
        case '/server.php/product_insertToList':
            middleware(product_insertToList);
            break;
        case '/server.php/category_getList':
            category_getList();
            break;
        case '/server.php/homeList_getList':
            homeList_getList();
            break;
        case '/server.php/category_insertToList':
            middleware(category_insertToList);
            break;
        case '/server.php/category_insertSubCateToList':
            middleware(category_insertSubCateToList);
            break;
        case '/server.php/category_updateToList':
            middleware(category_updateToList);
            break;
        case '/server.php/category_updateSubCateToList':
            middleware(category_updateSubCateToList);
            break;
        case '/server.php/product_updateToList':
            middleware(product_updateToList);
            break;
        case '/server.php/category_updateIconToList':
            middleware(category_updateIconToList);
            break;
        case '/server.php/product_deleteFromList':
            middleware(product_deleteFromList);
            break;
        case '/server.php/category_deleteSubCateFromList':
            middleware(category_deleteSubCateFromList);
            break;
        case '/server.php/category_deleteFromList':
            middleware(category_deleteFromList);
            break;
        case '/server.php/login':
            login();
            break;
        case '/server.php/test':
            echo letter_number_space_only("hi guys");
            break;
        default:
            header('Location:../');
            break;
    }
?>