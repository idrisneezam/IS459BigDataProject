import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { PredictiveForm, PredictiveResultDisplay } from "@/components/form";
import { fetchOutputResults } from "@/services/GeneratePredictiveOutputService"; // Import the API service

export function PredictionQueryPage() {
    const [predictionResult, setPredictionResult] = useState(null); // Single result, initially null

    const addSearchResult = async (formData) => {
        try {
            // Call the API with the form data using fetchOutputResults
            const result = await fetchOutputResults(formData);
            // Update predictionResult with the single result from the API
            setPredictionResult(result);
        } catch (error) {
            // Handle error by setting an error message or specific error state
            console.error("Failed to fetch prediction results:", error);
            setPredictionResult("Error: Unable to get prediction");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ p: 3 }} textAlign="center">
                <Typography variant="h4" component="h1" gutterBottom>
                    Departure Flight Delay Prediction Dashboard
                </Typography>
                <PredictiveForm onSearchSubmit={addSearchResult} />
                <PredictiveResultDisplay predictionResult={predictionResult} /> {/* Pass the single result */}
            </Box>
        </Container>
    );
}

export default PredictionQueryPage;
