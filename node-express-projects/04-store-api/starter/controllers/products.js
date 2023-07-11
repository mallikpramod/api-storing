const Product=require('../models/product')


const getAllProductsStatic = async(req,res)=>{
    const products =await Product.find({}).select('name price')
    res.status(200).json({products,total:products.length})
} 
const getAllProducts = async(req,res)=>{
    try {
        const {featured,company,name,sort,field,numericFilters}=req.query;
        const queryObject = {};
        if(featured){
            queryObject.featured = featured === 'true' ? true : false;
        }
        if(company){
            queryObject.company=company;
        }
        if(name){
            queryObject.name={$regex:name ,$options:'i'}
        }
        if (numericFilters) {
            const operatorMap = {
              '>': '$gt',
              '>=': '$gte',
              '=': '$eq',
              '<': '$lt',
              '<=': '$lte',
            };
            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numericFilters.replace(
              regEx,
              (match) => `-${operatorMap[match]}-`
            );
            const options = ['price', 'rating'];
            filters = filters.split(',').forEach((item) => {
              const [field, operator, value] = item.split('-');
              if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
              }
            });
          }
        console.log(numericFilters)
        console.log(queryObject)  
        let result = Product.find(queryObject)
        if(sort){
             const sortList = sort.split(',').join(' ');
            // console.log(sortList)
             result = result.sort(sortList);
         }else{
            result = result.sort('createdAt');
         }
         if(field){
             const fieldList = field.split(',').join(' ');
             result = result.select(fieldList);
         }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip=(page-1)*limit;

        const products=await result.skip(skip).limit(limit);
        res.status(200).json({products,total:products.length})
    } catch (error) {
        console.log(error.message)
        res.status(500).send('some error occured')
    } 
} 

module.exports = {
    getAllProducts,
    getAllProductsStatic,
  };
  