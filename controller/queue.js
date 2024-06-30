const queue = require("../models/queue");
const user = require("../models/user");

class QueueController {
    splitDate = (date) => date.toISOString().split("T")[0];
    addHours = (date, hour = 7) => {
        date.setHours(date.getHours() + hour);
        return date;
    };

    pickQueue = async (req, res) => {
        const { username, name } = req.body;

        const newestQueue = (await queue.find().sort({ issued_at: -1 }).limit(1))[0];
        const todayDate = this.addHours(new Date());

        if (!username || !name) {
            return res.status(401).json({
                statusCode: 401,
                message: "Username/Nama Harus Diisi"
            });
        }

        try {
            // Jam buka dan tutup adalah hasil -1, jadi jam aslinya +1
            const openHour = 7; // Jam Buka
            const closeHour = 16; // Jam Tutup
            const hour = todayDate.getHours(); // Jam Sekarang
            // const hour = 9; // Jam test


            // Jam tutup adalah jam 17, maka antrian terakhir yang diterima adalah jam 15:59
            if (hour > closeHour) {
                return res.status(429).json({
                    statusCode: 429,
                    message: "Antrian Sudah Ditutup, Silakan Coba Lagi Besok",
                });
            } else if (hour < openHour) {
                return res.status(423).json({
                    statusCode: 423,
                    message: "Antrian Belum Dibuka, Silakan Tunggu Jam Buka",
                });
            }

            if (newestQueue) {
                // Hari yang baru dan lebih dari jam 7:59
                if (this.splitDate(newestQueue.issued_at) !== this.splitDate(todayDate)) {
                    await queue.deleteMany({ queue_no: { $gte: 0 } });

                    await queue({
                        queue_no: 1,
                        username,
                        name,
                        issued_at: todayDate,
                        accepted: false,
                    }).save();

                    return res.status(201).json({
                        statusCode: 201,
                        message: "Berhasil Mengambil Antrian",
                    });
                }

                // User yang sama mencoba mengambil antrian lagi, padahal yang sebelumnya belum dilayani
                if (username === newestQueue.username) {
                    const newestQueueNum = newestQueue.queue_no;
                    if (!newestQueue.accepted) {
                        return res.status(400).json({
                            statusCode: 400,
                            message: "Antrian Belum Tuntas",
                        })
                    }

                    await queue({
                        queue_no: newestQueueNum + 1,
                        username,
                        name,
                        issued_at: todayDate,
                        accepted: false,
                    }).save();

                    return res.status(201).json({
                        statusCode: 201,
                        message: "Berhasil Mengambil Antrian",
                    });

                } else {
                    const newestQueueNum = newestQueue.queue_no;
                    await queue({
                        queue_no: newestQueueNum + 1,
                        username,
                        name,
                        issued_at: todayDate,
                        accepted: false,
                    }).save();

                    return res.status(201).json({
                        statusCode: 201,
                        message: "Berhasil Mengambil Antrian",
                    });
                }
            }

            // Beneran baru ngambil banget (belum ada di database)
            await queue({
                queue_no: 1,
                username,
                name,
                issued_at: todayDate,
                accepted: false,
            }).save();

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
            const newestQueue = (await queue.find().sort({ issued_at: -1 }).limit(1))[0];
            if (newestQueue) {
                const newestQueueDate = this.splitDate(newestQueue.issued_at);
                const todayDate = this.splitDate(this.addHours(new Date()));
                const isDifferentDate = newestQueueDate === todayDate;
                return res.status(200).json({
                    statusCode: 200,
                    message: isDifferentDate ? newestQueue.queue_no : 0,
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
            const todayDate = this.addHours(new Date());
            const todayDateFormatted = this.addHours(new Date(this.splitDate(todayDate)));

            const datas = await queue.find({ issued_at: { $gte: todayDateFormatted } });
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
        try {
            const username = req.params.username;
            const data = await queue.findOne({ username, accepted: false });
            return res.status(200).json({
                statusCode: 200,
                message: 'Sukses',
                data: data ? data : 'Belum Mengambil Antrian'
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