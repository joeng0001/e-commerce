<?php
    $request = $_SERVER['REQUEST_URI'];
    require_once __DIR__ . '/controller/product_controller.php';
    require_once __DIR__ . '/controller/category_controller.php';
    require_once __DIR__ . '/controller/homeList_controller.php';
    require_once __DIR__ . '/controller/validation_controller.php';
    require_once __DIR__ . '/controller/login_controller.php';
    require_once __DIR__ . '/controller/order_controller.php';
    require_once __DIR__ . '/middleware.php';
   
    switch ($request) {
        case '/server.php/product_getList' :
            product_getList();
            break;
        case '/server.php/product_insertToList':
            cookie_and_nonce_middleware(product_insertToList);
            break;
        case '/server.php/category_getList':
            category_getList();
            break;
        case '/server.php/homeList_getList':
            homeList_getList();
            break;
        case '/server.php/category_insertToList':
            cookie_and_nonce_middleware(category_insertToList);
            break;
        case '/server.php/category_insertSubCateToList':
            cookie_and_nonce_middleware(category_insertSubCateToList);
            break;
        case '/server.php/category_updateToList':
            cookie_and_nonce_middleware(category_updateToList);
            break;
        case '/server.php/category_updateSubCateToList':
            cookie_and_nonce_middleware(category_updateSubCateToList);
            break;
        case '/server.php/product_updateToList':
            cookie_and_nonce_middleware(product_updateToList);
            break;
        case '/server.php/category_updateIconToList':
            cookie_and_nonce_middleware(category_updateIconToList);
            break;
        case '/server.php/product_deleteFromList':
            cookie_and_nonce_middleware(product_deleteFromList);
            break;
        case '/server.php/category_deleteSubCateFromList':
            cookie_and_nonce_middleware(category_deleteSubCateFromList);
            break;
        case '/server.php/category_deleteFromList':
            cookie_and_nonce_middleware(category_deleteFromList);
            break;
        case '/server.php/login':
            login();
            break;
        case '/server.php/logout':
            logout();
            break;
        case '/server.php/change_pw':
            change_pw();
            break;
        case '/server.php/signup':
            signup();
            break;
        case '/server.php/create_order':
            nonce_middleware(create_order);
            break;
        case '/server.php/save_order':
            nonce_middleware(save_order);
            break;
        case '/server.php/get_order_for_client':
            nonce_middleware(get_order_for_client);
            break;
        case '/server.php/get_order_for_admin':
            cookie_and_nonce_middleware(get_order_for_admin);
            break;  
        case '/server.php/test':
            echo letter_number_space_only("hi guys");
            break;
        default:
            header('Location:../');
            break;
    }
?>