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
        const url = new URL(req.url);
        let apiPath = url.pathname.replace(/^\/api\/proxy\//, ""); // Remove "/api/proxy"

        if (!apiPath) {
            return NextResponse.json({ error: "Invalid API path" }, { status: 400 });
        }

        // Reconstruct the full URL to the actual backend
        const backendUrl = `http://cityscouttravel.somee.com/${apiPath}`;
        console.log(`Forwarding request to: ${backendUrl}`);

        const headers = {
            ...Object.fromEntries(req.headers),
            Host: "cityscouttravel.somee.com",
            Origin: "http://cityscouttravel.somee.com",
            Referer: "http://cityscouttravel.somee.com/",
        };

        let data = undefined;
        if (req.method !== "GET") {
            const contentType = req.headers.get("content-type") || "";
            // if (contentType.includes("multipart/form-data")) {
            //     data = await req.blob(); // Read raw body for form-data
            // } else
            if (contentType.includes("application/json")) {
                data = await req.json(); // Parse JSON body
            } else {
                data = req.body ? await req.text() : "{}"; // Handle other data types (e.g., form-data)
            }
        }

        // Forward the original request method, headers, and body
        const response = await axios({
            method: req.method as string,
            url: backendUrl,
            headers: headers,
            // data: req.body,
            data: data,
            validateStatus: () => true, // Don't throw on error status codes
        });

        // Set the response status and headers
        // res.status(response.status);

        // // Return the data
        // res.json(response.data);
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: new Headers(Object.entries(response.headers)),
        });
    } catch (error) {
        console.error('Proxy error:', error);
        // res.status(500).json({ error: 'Error proxying request to backend' });
        return NextResponse.json({ error: "Error proxying request to backend" }, { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };