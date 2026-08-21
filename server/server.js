const express =require("express");
const mongoose = require("mongoose");

const cors =require("cors");


const path =require("path");


const uploadRoutes =require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");

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
    process.env.PORT || 5500;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

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
app.use(express.static(path.join(__dirname, "../client")));

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
// Authentication Routes
// ==============================

app.use(
    "/api/auth",
    authRoutes
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