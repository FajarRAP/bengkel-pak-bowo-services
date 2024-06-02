const invoiceModel = require('../models/invoice');

class InvoiceController {
    createData = async (req, res) => {
        const data = new invoiceModel(req.body);
        data['bought_by'] = req.params.username;

        try {
            if (data.services.length == 0) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Jasa Tidak Boleh Kosong',
                });
            }

            await data.save();
            return res.status(201).json({
                statusCode: 201,
                message: 'Sukses',
            });
        } catch (error) {
            console.log(error.errors);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    };

    readData = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            return res.status(200).json(datas);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    };

    readDataByUser = async (req, res) => {
        try {
            const datas = await invoiceModel.find({ bought_by: req.params.username });
            return res.status(200).json({
                statusCode: 200,
                datas: datas.length > 0 ? datas : 'Belum Ada Transaksi'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    }
}

module.exports = new InvoiceController();
