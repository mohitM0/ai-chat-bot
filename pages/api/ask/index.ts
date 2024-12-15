import { NextApiRequest } from "next";

export default async function askQuestion(req: NextApiRequest) {
    try {
        if (req.method === 'POST') {

            const apiKey = process.env.NEXT_PUBLIC_BRIAN_API_KEY;

            if (!apiKey) {
                throw new Error("Brian API key is not set.");
            }

            const response = await fetch('https://api.brianknows.org/api/v0/agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Brian-Api-Key': apiKey
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from the agent.');
            }

            const data = await response.json();
        }
        else {
            throw new Error("The given method is not supported")
        }
    } catch (error) {
        console.log("The endpoint reverted with some errors.")
    }
}