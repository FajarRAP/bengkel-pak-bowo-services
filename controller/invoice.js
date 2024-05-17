const invoiceModel = require('../models/invoice');

class InvoiceController {
    createData = async (req, res) => {
        const data = new invoiceModel(req.body);

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
        }
    };

    readData = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            return res.status(200).json(datas);
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = new InvoiceController();
