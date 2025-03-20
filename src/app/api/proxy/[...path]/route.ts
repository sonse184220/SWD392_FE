import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
// API Route Handlers
// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//     return handler(req, res);
// }

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     return handler(req, res);
// }

// export async function PUT(req: NextApiRequest, res: NextApiResponse) {
//     return handler(req, res);
// }

// export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
//     return handler(req, res);
// }

// export default
async function handler(req: NextRequest) {
    try {
        // Get the actual API path from the URL
        // const path = req.query.path as string[];
        const path = req.nextUrl.searchParams.getAll("path");
        const apiPath = path.join('/');

        if (!apiPath) {
            return NextResponse.json({ error: "Invalid API path" }, { status: 400 });
        }

        // Reconstruct the full URL to the actual backend
        const url = `http://cityscouttravel.somee.com/api/${apiPath}`;

        // Forward the original request method, headers, and body
        const response = await axios({
            method: req.method as string,
            url: url,
            headers: {
                // ...req.headers,
                ...Object.fromEntries(req.headers),
                host: 'cityscouttravel.somee.com',
            },
            // data: req.body,
            data: req.method !== "GET" ? await req.json() : undefined,
            validateStatus: () => true, // Don't throw on error status codes
        });

        // Set the response status and headers
        // res.status(response.status);

        // // Return the data
        // res.json(response.data);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error('Proxy error:', error);
        // res.status(500).json({ error: 'Error proxying request to backend' });
        return NextResponse.json({ error: "Error proxying request to backend" }, { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };