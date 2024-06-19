const invoiceModel = require('../models/invoice');
const queueModel = require('../models/queue');

class InvoiceController {
    createData = async (req, res) => {
        const data = invoiceModel(req.body);

        try {
            if (!data.service.name || !data.service.price) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Jasa Tidak Boleh Kosong',
                });
            }

            await data.save();

            await queueModel.findOneAndUpdate({ username: data.customer.username }, { accepted: true });

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
            const datas = await invoiceModel.find({ 'customer.username': req.params.username });
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
