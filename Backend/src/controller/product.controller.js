var db = require('../config/config')
var { IsEmpty } = require('../helper/validation')

const getProduct = async (req, res) => {
    try {
        var SQL = `SELECT * FROM products`;
        var [result] = await db.query(SQL);
        return res.send({
            product: result
        });
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        var { proName, price, qty, category } = req.body;
        var image = req.file ? req.file.filename : (req.body.image || '');

        if (IsEmpty(proName)) {
            return res.status(400).send({
                message: 'Name is required.'
            })
        }
        if (IsEmpty(price)) {
            return res.status(400).send({
                message: 'Price is required.'
            })
        }
        if (IsEmpty(qty)) {
            return res.status(400).send({
                message: 'Quantity is required.'
            })
        }
        if (IsEmpty(category)) {
            return res.status(400).send({
                message: 'Category is required.'
            })
        }
        var InsertSQL = `INSERT INTO products (proName, price, qty, category, image)
                        VALUES (?, ?, ?, ?, ?)`;
        var [result] = await db.query(InsertSQL, [proName, price, qty, category, image]);
        return res.status(201).send({
            message: 'Insert Product is successfully',
            proId: result.insertId,
            image: image
        })
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        var proId = req.params.id;
        var Select = `SELECT * FROM products WHERE proId = ?`;
        var [result] = await db.query(Select, [proId]);
        if (result.length === 0) {
            return res.status(404).send({
                message: 'Product not found'
            });
        }
        else {
            var { proName, price, qty, category } = req.body;
            var currentProduct = result[0];
            var image = req.file ? req.file.filename : (req.body.image !== undefined ? req.body.image : currentProduct.image);
            var UpdateSQL = `UPDATE products SET proName = ?, price = ?, qty = ?, category = ?, image = ? WHERE proId = ?`;
            var [updateResult] = await db.query(UpdateSQL, [proName, price, qty, category, image, proId]);
            return res.send({
                message: 'Update Product is successfully'
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        var proId = req.params.id;
        var Select = `SELECT * FROM products WHERE proId = '${proId}'`;
        var [result] = await db.query(Select);
        if (result.length === 0) {
            return res.status(404).send({
                message: 'Product not found'
            })
        }
        else {
            var DeleteSQL = `DELETE FROM products WHERE proId = '${proId}'`;
            var [result] = await db.query(DeleteSQL);
            return res.send({
                message: 'Delete Product is successsfully.'
            })
        }
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}