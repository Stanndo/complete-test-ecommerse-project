const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price; // + converts string to number
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        //this.imagePath = `product-data/images/${productData.image}`;
        //this.imageUrl = `/products/assets/images/${productData.image}`;
        this.updateImageData();
        if (productData._id) {
            this.id = productData._id.toString();
        }      
    }
 
    static async findProductById(productId) {
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        
        const product = await db.getDb().collection('products').findOne({ _id: prodId });

        if (!product) {
            const error = new Error('Could not find product with provided id.');
            error.code = 404;
            throw error;
        }
        return new Product(product);
    }

    static async findAllProducts() {
        const products = await db.getDb().collection('products').find().toArray();

        // here instead of returning the products as arrays we convert them to 
        // object based on the Product class
        // basicly we convert the data from database to an object based on this class blueprint
        return products.map(function(productDocument) {
            return new Product(productDocument);
        });
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl = `/products/assets/images/${this.image}`;
    }

    async saveToDb() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image       
        };

        // here if we have id that means we wanna update the product, if not we create new one
        if (this.id) {
            const productId = new mongodb.ObjectId(this.id);

            // we need this to update properly without overwright some image with null
            if (!this.image) {
                delete productData.image;
            }

            await db.getDb().collection("products").updateOne({_id: productId}, {
            $set: productData 
            });
        } else {
            await db.getDb().collection("products").insertOne(productData);
        }
    }

    async replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    //here there is no need to use async/await method instead we return the result as promise
    removeProduct() {
        const productId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('products').deleteOne({_id: productId});
    }
}

module.exports = Product;