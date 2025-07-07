/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ]
    },
}

module.exports = nextConfig

module.exports = {
    env: {
        "NEXT_PUBLIC_API_URL": "http://localhost:5000/api",
        "TEST_PUBLIC_API": "https://quanlyvumua-server.onrender.com/api"

    }
}
