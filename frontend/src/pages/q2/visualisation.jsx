// import React, { useEffect, useState } from "react";
// import { Container, Typography, Box, Button } from "@mui/material";
// import * as QuickSightEmbedding from "amazon-quicksight-embedding-sdk";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as d3 from "d3";
// import airplaneIcon from "@/assets/airplane.svg";

// export default function Visualisation() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const isQ1Active = location.pathname === "/Q1";
//     const isQ2Active = location.pathname === "/Q2";

//     const embedUrl = "??";

//     // const [embedUrl, setEmbedUrl] = useState("");

//     // // Fetch embed URL from the backend
//     // useEffect(() => {
//     //     const fetchEmbedUrl = async () => {
//     //         try {
//     //             const response = await fetch("http://localhost:3000/get-embed-url");
//     //             const data = await response.json();
//     //             setEmbedUrl(data.embedUrl);
//     //         } catch (error) {
//     //             console.error("Error fetching embed URL:", error);
//     //         }
//     //     };

//     //     fetchEmbedUrl();
//     // }, []);

//     // Airplane stippling animation with d3
//     useEffect(() => {
//         const svg = d3.select("#background-svg")
//             .attr("width", window.innerWidth)
//             .attr("height", window.innerHeight);

//         const airplaneData = Array.from({ length: 10 });

//         svg.selectAll("image")
//             .data(airplaneData)
//             .enter()
//             .append("image")
//             .attr("xlink:href", airplaneIcon)
//             .attr("width", 50)
//             .attr("height", 50)
//             .attr("x", () => Math.random() * window.innerWidth)
//             .attr("y", () => Math.random() * window.innerHeight);

//         function animatePlanes() {
//             svg.selectAll("image")
//                 .transition()
//                 .duration(5000)
//                 .ease(d3.easeLinear)
//                 .attr("x", () => Math.random() * window.innerWidth)
//                 .attr("y", () => Math.random() * window.innerHeight)
//                 .on("end", animatePlanes);
//         }

//         animatePlanes();
//     }, []);

//     // Embed QuickSight dashboard
//     useEffect(() => {
//         if (embedUrl) {
//             const containerDiv = document.getElementById("quicksight-dashboard");

//             const options = {
//                 url: embedUrl,
//                 container: containerDiv,
//                 scrolling: "no",
//                 height: "700px",
//                 width: "100%",
//                 locale: "en-US",
//                 footerPaddingEnabled: true,
//                 sheetTabsDisabled: false,
//             };

//             try {
//                 QuickSightEmbedding.embedDashboard(options);
//                 console.log("Dashboard embedded successfully");
//             } catch (error) {
//                 console.error("Failed to embed QuickSight dashboard:", error);
//             }
//         }
//     }, [embedUrl]);

//     return (
//         <Container maxWidth="lg" style={{ position: "relative", zIndex: 1 }}>
//             <svg id="background-svg" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}></svg>

//             <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 position="relative"
//             >
//                 <Box
//                     sx={{
//                         p: 3,
//                         backgroundColor: "rgba(255, 255, 255, 0.8)",
//                         borderRadius: 2,
//                         width: "300px",
//                         position: "fixed",
//                         top: "20px",
//                         left: "calc(50% - 600px - 32px)",
//                         zIndex: 2,
//                     }}
//                 >
//                     <Button
//                         variant="contained"
//                         sx={{
//                             color: "black",
//                             backgroundColor: isQ1Active ? "green" : "white",
//                             '&:hover': { backgroundColor: isQ1Active ? "green" : "#f0f0f0" },
//                         }}
//                         onClick={() => navigate("/Q1")}
//                     >
//                         Q1
//                     </Button>

//                     <Button
//                         variant="contained"
//                         sx={{
//                             color: "black",
//                             backgroundColor: isQ2Active ? "green" : "white",
//                             '&:hover': { backgroundColor: isQ2Active ? "green" : "#f0f0f0" },
//                         }}
//                         onClick={() => navigate("/Q2")}
//                     >
//                         Q2
//                     </Button>
//                 </Box>

//                 <Box
//                     sx={{
//                         p: 3,
//                         backgroundColor: "rgba(255, 255, 255, 0.8)",
//                         borderRadius: 2,
//                         width: "600px",
//                         textAlign: "center",
//                     }}
//                 >
//                     <Typography variant="h4" component="h1" gutterBottom>
//                         AWS QuickSight Dashboard
//                     </Typography>

//                     {/* Container for QuickSight dashboard */}
//                     <Box id="quicksight-dashboard" sx={{ width: "100%", height: "700px" }}></Box>
//                 </Box>
//             </Box>
//         </Container>
//     );
// }

import { useEffect, useState } from "react";
import { Container, Typography, Box, Button, TextField } from "@mui/material";
import * as QuickSightEmbedding from "amazon-quicksight-embedding-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import * as d3 from "d3";
import airplaneIcon from "@/assets/airplane.svg";

export function Visualisation() {
    const navigate = useNavigate();
    const location = useLocation();

    const isQ1Active = location.pathname === "/Q1";
    const isQ2Active = location.pathname === "/Q2";

    // Use your actual embed URL here
    const embedUrl = "??";

    // State for AI recommendation
    const [year, setYear] = useState("");
    const [airline, setAirline] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [parsedRecommendation, setParsedRecommendation] = useState([]);

    // Function to handle the AI recommendation request
    const fetchRecommendation = async () => {
        try {
            const response = await fetch("https://fm0iylmmeh.execute-api.us-east-1.amazonaws.com/Prod/trigger_q2_recommendation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Year: parseInt(year), Airline: airline })
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.text();
            setRecommendation(data);

            // Parse the recommendation into sections for display
            const sections = data.split("\n\n"); // Split into paragraphs
            setParsedRecommendation(sections);
        } catch (error) {
            console.error("Failed to fetch recommendation:", error);
            setRecommendation("Error fetching recommendation");
        }
    };


    // Airplane stippling animation with d3
    useEffect(() => {
        const svg = d3.select("#background-svg")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight);

        const airplaneData = Array.from({ length: 10 });

        svg.selectAll("image")
            .data(airplaneData)
            .enter()
            .append("image")
            .attr("xlink:href", airplaneIcon)
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", () => Math.random() * window.innerWidth)
            .attr("y", () => Math.random() * window.innerHeight);

        function animatePlanes() {
            svg.selectAll("image")
                .transition()
                .duration(5000)
                .ease(d3.easeLinear)
                .attr("x", () => Math.random() * window.innerWidth)
                .attr("y", () => Math.random() * window.innerHeight)
                .on("end", animatePlanes);
        }

        animatePlanes();
    }, []);

    // Embed QuickSight dashboard
    useEffect(() => {
        const containerDiv = document.getElementById("quicksight-dashboard");

        if (!containerDiv) {
            console.error("Container for QuickSight embedding not found.");
            return;
        }

        if (embedUrl) {
            const options = {
                url: embedUrl,
                container: containerDiv,
                scrolling: "no",
                height: "700px",
                width: "100%",
                locale: "en-US",
                footerPaddingEnabled: true,
                sheetTabsDisabled: false,
            };

            const embedDashboard = async () => {
                try {
                    console.log("Attempting to embed dashboard...");
                    const embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
                    await embeddingContext.embedDashboard(options);
                    console.log("Dashboard embedded successfully");
                } catch (error) {
                    console.error("Failed to embed QuickSight dashboard:", error);
                }
            };

            embedDashboard();
        } else {
            console.error("Embed URL is missing or invalid.");
        }
    }, [embedUrl]);


    return (
        <Container maxWidth="lg" style={{ position: "relative", zIndex: 1 }}>
            <svg id="background-svg" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}></svg>

            <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                <Box
                    sx={{
                        p: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                        width: "300px",
                        position: "fixed",
                        top: "20px",
                        left: "calc(50% - 600px - 32px)",
                        zIndex: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            color: "black",
                            backgroundColor: isQ1Active ? "green" : "white",
                            '&:hover': { backgroundColor: isQ1Active ? "green" : "#f0f0f0" },
                        }}
                        onClick={() => navigate("/Q1")}
                    >
                        Q1
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            color: "black",
                            backgroundColor: isQ2Active ? "green" : "white",
                            '&:hover': { backgroundColor: isQ2Active ? "green" : "#f0f0f0" },
                        }}
                        onClick={() => navigate("/Q2")}
                    >
                        Q2
                    </Button>
                </Box>

                <Box
                    sx={{
                        p: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                        width: "600px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        AWS QuickSight Dashboard
                    </Typography>

                    {/* Container for QuickSight dashboard */}
                    <Box id="quicksight-dashboard" sx={{ width: "100%", height: "700px" }}></Box>
                </Box>
            </Box>
            {/* AI Recommendation Form */}
            <Box
                sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 2,
                    width: "400px",
                    mt: 5,
                    mx: "auto",
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Get AI Recommendation
                </Typography>
                <TextField
                    label="Year"
                    variant="outlined"
                    fullWidth
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    type="number"
                    margin="normal"
                />
                <TextField
                    label="Airline"
                    variant="outlined"
                    fullWidth
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchRecommendation}
                    sx={{ mt: 2 }}
                >
                    Submit
                </Button>
                {/* Display parsed recommendation with formatting */}
                <Box sx={{ mt: 3, textAlign: "left" }}>
                    {parsedRecommendation.map((section, index) => (
                        <Typography key={index} variant="body1" paragraph>
                            {section}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default Visualisation;