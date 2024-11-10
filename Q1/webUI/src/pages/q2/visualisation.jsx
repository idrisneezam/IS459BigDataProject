import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import * as QuickSightEmbedding from "amazon-quicksight-embedding-sdk";

export default function Visualisation() {
    useEffect(() => {
        // Embed the QuickSight dashboard
        const embedDashboard = () => {
            const containerDiv = document.getElementById("quicksight-dashboard");

            if (!containerDiv) {
                console.error("Container for QuickSight embedding not found.");
                return;
            }

            const options = {
                url: "https://your-quicksight-dashboard-url", // Replace with your actual QuickSight embed URL
                container: containerDiv,
                scrolling: "no",
                height: "700px",
                width: "100%",
                locale: "en-US",
                footerPaddingEnabled: true,
                sheetTabsDisabled: false,
            };

            try {
                console.log("Embedding QuickSight dashboard...");
                QuickSightEmbedding.embedDashboard(options);
            } catch (error) {
                console.error("Failed to embed QuickSight dashboard:", error);
            }
        };

        embedDashboard();
    }, []);

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 2,
                minHeight: "80vh",
                textAlign: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                AWS QuickSight Dashboard
            </Typography>

            {/* Container for the embedded QuickSight dashboard */}
            <Box id="quicksight-dashboard"></Box>
        </Box>
    );
}
