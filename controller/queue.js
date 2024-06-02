const queue = require("../models/queue");

class QueueController {
    splitDate = (date) => date.toISOString().split("T")[0];

    pickQueue = async (req, res) => {
        const { username } = req.body;

        const newestQueue = await queue.find().sort({ issued_at: -1 }).limit(1);
        // console.log(newestQueue[0].issued_at);
        // console.log(new Date().getUTCMinutes());
        // console.log(new Date(Math.abs(newestQueue[0].issued_at - new Date())));

        // return res.send('halo');
        try {
            if (newestQueue.length !== 0) {
                const queueNumber = newestQueue[0].queue_no;
                const newestDate = this.splitDate(newestQueue[0].issued_at);
                const todayDate = this.splitDate(new Date());

                if (newestDate !== todayDate) {
                    await queue.deleteMany({ queue_no: { $gte: 0 } });
                }

                if (username === newestQueue[0].username) {
                    // const difference = new Date(Math.abs(newestQueue[0].issued_at - new Date()));

                    // console.log(difference.getDay());
                    // console.log(new Date().getDay());
                    // // const minuteCondition = difference.getUTCMinutes() < 2;
                    if (!newestQueue[0].accepted) {
                        return res.status(400).json({
                            statusCode: 400,
                            message: 'Antrian Belum Tuntas'
                        })
                    }
                    // console.log(difference.getUTCMinutes());
                }
                await queue({
                    queue_no: newestDate === todayDate ? queueNumber + 1 : 1,
                    username,
                    issued_at: new Date(),
                    accepted: false,
                }).save();
            } else {
                await queue({
                    queue_no: 1,
                    username,
                    issued_at: new Date(),
                    accepted: false,
                }).save();
            }
            return res.status(201).json({
                statusCode: 201,
                message: "Berhasil Mengambil Antrian",
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    }
    getQueueNumToday = async (req, res) => {
        try {
            const newestQueue = await queue.find().sort({ issued_at: -1 }).limit(1);
            if (newestQueue.length !== 0) {
                const isDifferentDate = this.splitDate(newestQueue[0].issued_at) === this.splitDate(new Date());
                console.log(newestQueue);
                console.log(isDifferentDate);
                return res.status(200).json({
                    statusCode: 200,
                    message: isDifferentDate ? newestQueue[0].queue_no : 1,
                });

            }
            return res.status(200).json({
                statusCode: 200,
                message: 0
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            })
        }
    }
    getQueueToday = async (req, res) => {
        try {
            const datas = await queue.find({ issued_at: { $gte: new Date(this.splitDate(new Date())) } });
            return res.status(200).json({
                statusCode: 200,
                message: datas.length === 0 ? 'Belum Ada Transaksi' : 'Sukses',
                datas,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            })
        }
    }
    getMyQueueToday = async (req, res) => {
        const username = req.params.username;
        // const user = await user.findOne({ username });
        try {
            const username = req.params.username;
            const data = await queue.findOne({ username, accepted: false });
            return res.status(200).json({
                statusCode: 200,
                message: 'Sukses',
                data
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            })
        }
    }
}

module.exports = new QueueController();