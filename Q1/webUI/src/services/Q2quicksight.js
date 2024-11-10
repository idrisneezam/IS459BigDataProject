import AWS from 'aws-sdk';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Configure AWS SDK
AWS.config.update({
    region: '??',
    accessKeyId: '??',
    secretAccessKey: '??'
});

const quicksight = new AWS.QuickSight();

app.get('/api/get-embed-url', async (req, res) => {
    const params = {
        AwsAccountId: '??',
        DashboardId: '??',
        IdentityType: 'IAM',
        SessionLifetimeInMinutes: 600,
        UndoRedoDisabled: false,
        ResetDisabled: false,
    };

    try {
        const response = await quicksight.getDashboardEmbedUrl(params).promise();
        const embedUrl = response.EmbedUrl;
        res.json({ embedUrl });
        console.log(embedUrl);
    } catch (error) {
        console.error("Error generating embed URL:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
