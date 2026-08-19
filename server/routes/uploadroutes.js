const express =
    require("express");


const fs =
    require("fs");


const upload =
    require(
        "../middleware/uploadMiddleware"
    );


const {
    readCSV,
    analyzeData
} =
    require(
        "../services/dataAnalysis"
    );


const router =
    express.Router();


router.post(
    "/upload",
    upload.single("dataset"),

    async (
        req,
        res
    ) => {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload a CSV file."

            });

        }


        try {

            const data =
                await readCSV(
                    req.file.path
                );


            const analysis =
                analyzeData(
                    data
                );


            res.json({

                success: true,

                fileName:
                    req.file.originalname,

                fileSize:
                    req.file.size,

                ...analysis

            });

        }

        catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to analyze dataset."

            });

        }

        finally {

            // Delete temporary file

            if (
                req.file &&
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlink(
                    req.file.path,
                    error => {

                        if (error) {

                            console.error(
                                "Could not delete temporary file:",
                                error
                            );

                        }

                    }
                );

            }

        }

    }
);


module.exports =
    router;