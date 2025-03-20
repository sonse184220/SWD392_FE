import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Get the actual API path from the URL
        const path = req.query.path as string[];
        const apiPath = path.join('/');

        // Reconstruct the full URL to the actual backend
        const url = `http://cityscouttravel.somee.com/api/${apiPath}`;

        // Forward the original request method, headers, and body
        const response = await axios({
            method: req.method as string,
            url: url,
            headers: {
                ...req.headers,
                host: 'cityscouttravel.somee.com',
            },
            data: req.body,
            validateStatus: () => true, // Don't throw on error status codes
        });

        // Set the response status and headers
        res.status(response.status);

        // Return the data
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Error proxying request to backend' });
    }
}