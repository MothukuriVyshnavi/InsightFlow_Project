const express =
    require("express");


const cors =
    require("cors");


const path =
    require("path");


const uploadRoutes =
    require(
        "./routes/uploadRoutes"
    );


const {
    explainData
} =
    require(
        "./services/aiService"
    );


require("dotenv").config();


const app =
    express();


const PORT =
    process.env.PORT || 5000;


// ==============================
// Middleware
// ==============================

app.use(
    cors()
);


app.use(
    express.json({
        limit: "10mb"
    })
);


// ==============================
// Health Check
// ==============================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "AI Explain My Data server is running."

        });

    }
);


// ==============================
// Upload Routes
// ==============================

app.use(
    "/api",
    uploadRoutes
);


// ==============================
// AI Route
// ==============================

app.post(
    "/api/ai/explain",

    async (
        req,
        res
    ) => {

        try {

            const analysis =
                req.body;


            if (!analysis) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Analysis data is required."

                });

            }


            const explanation =
                await explainData(
                    analysis
                );


            res.json({

                success: true,

                explanation

            });

        }

        catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "AI explanation failed."

            });

        }

    }
);


// ==============================
// Error Handler
// ==============================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Internal server error."

        });

    }
);


// ==============================
// Start Server
// ==============================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);