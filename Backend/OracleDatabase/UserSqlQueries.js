

function getUserByemail(email) { return 'SELECT id, password FROM users WHERE email = \'' +     email + '\'';}
function getUserById(user_id) { return 'SELECT * FROM users WHERE id = \'' + user_id + '\'';}
function insertSession(session_id, user_id) { return 'INSERT INTO sessions (session_id, user_id) VALUES (\'' + session_id + '\', ' + user_id + ')';}
function deleteSession(session_id) { return 'DELETE FROM sessions WHERE session_id = \'' + session_id + '\'';}
function getUserBySessionId(session_id) { return 'SELECT user_id FROM sessions WHERE session_id = \'' + session_id + '\'';}
function getOrdersByUserId(user_id) { return 'SELECT o.order_id, p.product_name, p.price, o.date_of_order FROM orders o join products p on o.product_id = p.id  WHERE user_id = \'' + user_id+ '\' order by o.date_of_order desc';}
function getNavBarsByUserId(user_id) {return 'with A as    (select id,surname from users),B as (select user_id, count(product_id) as favorites from favourites group by user_id),C as (select user_id, sum(product_quantity) as shoppingcart from shoppingcart group by user_id)select A.surname,  nvl(B.favorites, 0) as favorites,  nvl(C.shoppingcart, 0) as shoppingcart from A left join B on A.id=B.user_id left  join C on B.user_id=C.user_id  where A.id =\'' + user_id + '\'';}
function getShoppingCartByUserId(user_id) { return 'SELECT sh.*, p.product_name, p.price, p.product_type FROM shoppingcart sh join products p on sh.product_id = p.id WHERE user_id = \'' + user_id + '\'';}
function getFavoritesByUserId(user_id) { return 'SELECT * FROM favourites WHERE user_id = \'' + user_id + '\'';}
function processOrder(user_id, delivery_id, delivery_address){ return 'CALL process_order(\'' + user_id + '\', \'' + delivery_id + '\', \'' + delivery_address + '\' )'};
function addProductToFavorites(user_id, product_id) { return 'CALL toggle_favorite(\'' + user_id + '\', \'' + product_id + '\')';}
function addProductToShoppingCart(user_id, product_id, product_size) { return 'INSERT INTO shoppingcart (user_id, product_id, product_quantity, product_size, type) VALUES (\'' + user_id + '\', \'' + product_id + '\', 1, \'' + product_size + '\', \'ord\') ';}
function updateShoppingCart(user_id, product_id, product_size, status){ return 'CALL update_shoppingcart(\'' + user_id + '\', \'' + status + '\', \'' + product_id + '\', \'' + product_size + '\')';}
function insertUser(newuser) { return 'INSERT INTO users (id, email, password, Name, Surname, gender) VALUES ( user_id_seq.nextval, \'' + newuser.email + '\', \'' + newuser.password + '\', \'' + newuser.name + '\', \'' + newuser.surname + '\', \'' + newuser.gender + '\')';}
function updatePassword(user_id, password) { return 'UPDATE users SET password = \'' + password + '\' WHERE id = \'' + user_id + '\'';}
module.exports = {
    getUserByemail, 
    insertSession, 
    deleteSession, 
    getUserBySessionId, 
    getOrdersByUserId, 
    getNavBarsByUserId, 
    getShoppingCartByUserId, 
    getFavoritesByUserId,
    processOrder,
    addProductToFavorites,
    addProductToShoppingCart,
    updateShoppingCart,
    insertUser,
    updatePassword,
    getUserById
}