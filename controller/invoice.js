const invoiceModel = require('../models/invoice');

class InvoiceController {
    createData = async (req, res) => {
        const data = new invoiceModel(req.body);

        if (data.barangs.length == 0) {
            res.status(400).json({
                statusCode: 400,
                message: 'Barang Tidak Boleh Kosong',
            });
            return;
        }

        try {
            await data.save();
            res.status(201).json({
                statusCode: 201,
                message: 'Sukses',
            });
            concole.log("Data Created");
        } catch (error) {
            console.log(error.errors);
        }
    };

    readData = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            res.status(200).json(datas);
            console.log(`Data Readed ${Date.now()}`);
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = new InvoiceController();
