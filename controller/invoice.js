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
            // await data.save();
            console.log(data);
            res.status(201).json({
                statusCode: 201,
                message: 'Sukses',
            });
        } catch (error) {
            console.log(error.errors);
            res.send('Gagal');

        }
    };

    readData = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            res.status(200).json(datas);
        } catch (error) {
            console.log(error);

        }
    };
}

module.exports = new InvoiceController();
