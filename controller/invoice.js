const invoiceModel = require('../models/invoice');
const queueModel = require('../models/queue');

class InvoiceController {
    createInvoice = async (req, res) => {
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

    getInvoices = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            console.log(datas);
            return res.status(200).json({
                statusCode: 200,
                message: "Sukses",
                datas
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    };

    getInvoicesByUsername = async (req, res) => {
        try {
            const datas = await invoiceModel.find({ 'customer.username': req.params.username });
            return res.status(200).json({
                statusCode: 200,
                datas
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    }

    getExpenseAtMonth = async (req, res) => {
        const { username, month } = req.params;
        try {
            const datas = await invoiceModel.find({ 'customer.username': username });
            const expense = datas.reduce((total, element) => element.bought_at.getMonth() == month ? total += element.service.price : total, 0);

            return res.status(200).json({
                statusCode: 200,
                expense,
            });
        } catch (e) {
            return res.status(500).json({
                statusCode: 500,
                message: e.toString(),
            });
        }
    };

    getIncome = async (req, res) => {
        try {
            const datas = await invoiceModel.find();
            const income = datas.reduce((total, element) => total += element.service.price, 0);

            return res.status(200).json({
                statusCode: 200,
                income,
            });
        } catch (e) {
            return res.status(500).json({
                statusCode: 500,
                message: e.toString(),
            });
        }
    };
}

module.exports = new InvoiceController();
