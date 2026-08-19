const multer =
    require("multer");

const path =
    require("path");

const fs =
    require("fs");


const uploadFolder =
    path.join(
        __dirname,
        "../uploads"
    );


if (
    !fs.existsSync(uploadFolder)
) {

    fs.mkdirSync(
        uploadFolder,
        {
            recursive: true
        }
    );

}


const storage =
    multer.diskStorage({

        destination:
            (req, file, cb) => {

                cb(
                    null,
                    uploadFolder
                );

            },


        filename:
            (req, file, cb) => {

                const uniqueName =
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1000000000
                    ) +
                    path.extname(
                        file.originalname
                    );


                cb(
                    null,
                    uniqueName
                );

            }

    });


const fileFilter =
    (req, file, cb) => {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();


        if (
            extension === ".csv"
        ) {

            cb(
                null,
                true
            );

        }

        else {

            cb(
                new Error(
                    "Only CSV files are allowed."
                )
            );

        }

    };


const upload =
    multer({

        storage,

        limits: {

            fileSize:
                10 * 1024 * 1024

        },

        fileFilter

    });


module.exports =
    upload;