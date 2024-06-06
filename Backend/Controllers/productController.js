
const db = require('../OracleDatabase/connectdb');
const productQuery = require('../OracleDatabase/ProductSqlQueries');

const getProductsbyGender = 
    async (req, res) => {
        try {
          const gender = req.params.pgender;
       
          const result = await db.findMany(productQuery.getProductsbyGenderQuery(gender));
          console.log(result);
       
          if (!result) {
            throw new Error('Query did not return any data');
          }
      
        
          
          if(result.length == 0)
            res.status(404).send('Products not found');
      
          
          res.json(result);
        } catch (err) {
          
          console.error('Error fetching data from database:', err);
          res.status(500).send('Error fetching data from database: ' + err.message);
        }
      }


const getProductsbyGenderandCategory = 
    async (req, res) => {
        try {
        const gender = req.params.gender;
        const category = req.params.category;
        
        const result = await db.findMany(productQuery.getProductsbyGenderandCategoryQuery(gender, category));
        
        
      
        if (!result || result.length === 0) 
            return res.status(404).send('Products not found');
    
       
        console.log(result);
    
       
        res.json(result);
        } catch (err) {
        
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }


const getProductById =
    async (req, res) => {
        try {
        
        const productId = req.params.ID;
        const product = await db.findOne(productQuery.getProductByIdQuery(productId));
        
        if (!product || product.length === 0) 
            return res.status(404).send('Product not found');

        product.sizes = await db.findMany(productQuery.getProductSizesByIdQuery(productId));
        
        
    
        
        res.json(product);
        } catch (err) {
        
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }


const getProductCategoriesByGender = 
    async (req, res) => {
        try {
        
        const gender = req.params.gender;
        
        const result = await db.findMany(productQuery.getProductCategoriesByGenderQuery(gender));
        
       
         if (!result || result.length === 0) 
            return res.status(404).send('Products not found');
    
       
        console.log(result);
    
        
        res.json(result);
        } catch (err) {
        
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }



    const getSearchedProducts = 
    async (req, res) => {
        try {
        const keyword = req.params.keyword.toUpperCase();

        
        const result = await db.findMany(productQuery.getSearchedProducts(keyword));
        
        
        if (!result || result.length === 0) 
            return res.status(404).send('Products not found');
    
        
        console.log(result);
    
        
        res.json(result);
        } catch (err) {
        
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }


    const getSearchedProductsbyGender = 
    async (req, res) => {
        try {
        const keyword = req.params.keyword.toUpperCase();
        const gender = req.params.gender
        
        const result = await db.findMany(productQuery.getSearchedProductsbyGender(keyword, gender));
        
        if (!result || result.length === 0) 
            return res.status(404).send('Products not found');
    
        
        console.log(result);
    
        
        res.json(result);
        } catch (err) {
       
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }




    const getSearchedProductsbyGenderandCategory = 
    async (req, res) => {
        try {
        const keyword = req.params.keyword.toUpperCase();
        const gender = req.params.gender
        const category = req.params.category
        
        const result = await db.findMany(productQuery.getSearchedProductsbyGenderandCategory(keyword, gender, category));
        
        if (!result || result.length === 0) 
            return res.status(404).send('Products not found');
    
 
        console.log(result);
    
        res.json(result);
        } catch (err) {
    
        console.error('Error fetching data from database:', err);
        res.status(500).send('Error fetching data from database: ' + err.message);
        }
    }




module.exports = {
    getProductsbyGender,
    getProductsbyGenderandCategory,
    getProductById,
    getProductCategoriesByGender,
    getSearchedProducts,
    getSearchedProductsbyGender,
    getSearchedProductsbyGenderandCategory
};
