import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import EditOutput from './EditOutput';

dotenv.config({ path: __dirname + '/.env' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured"
            }
        });
        return;
    }

    const prompt = req.body.prompt || '';
    if (prompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid prompt"
            }
        });
        return;
    };

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `convert ${prompt} into terraform scripts`,
            temperature: 0.4,
            max_tokens: 1000,
        });

        res.status(200).json({ result: response.data.choices[0].text })
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request'
                }
            })
        }
    }
}
