
function getProductsbyGenderQuery(gender) { return  'SELECT * FROM products WHERE product_gender = \'' + gender + '\'';}

function getProductsbyGenderandCategoryQuery(gender, category) { return 'SELECT * FROM products WHERE product_gender = \'' + gender + '\' AND product_type = \'' + category + '\''}

function getProductByIdQuery(ID) { return 'SELECT * FROM products WHERE id = \'' + ID + '\'';}

function getProductCategoriesByGenderQuery(gender) { return "SELECT product_type, max(id) as id FROM products WHERE product_gender = '" + gender + "' group by product_type";}
function getProductSizesByIdQuery(ID) { return 'select distinct(product_size) from storage where product_id = \'' + ID + '\' order by product_size';}

function getSearchedProducts(keyword) { return 'SELECT * FROM products WHERE product_name LIKE \'%' + keyword + '%\'';}
function getSearchedProductsbyGender(keyword, gender) { return 'SELECT * FROM products WHERE product_name LIKE \'%' + keyword + '%\' AND product_gender = \'' + gender + '\'';}
function getSearchedProductsbyGenderandCategory(keyword, gender, category) { return 'SELECT * FROM products WHERE product_name LIKE \'%' + keyword + '%\' AND product_gender = \'' + gender + '\' AND product_type = \'' + category + '\'';}



module.exports = {getProductsbyGenderQuery, 
    getProductsbyGenderandCategoryQuery,
    getProductByIdQuery,
    getProductCategoriesByGenderQuery,
    getProductSizesByIdQuery,
    getSearchedProducts,
    getSearchedProductsbyGender,
    getSearchedProductsbyGenderandCategory
}