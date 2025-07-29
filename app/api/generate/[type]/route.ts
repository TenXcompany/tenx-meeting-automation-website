import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const url = new URL(req.url)
    const type = url.pathname.split('/').pop()

    if (!type) {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const API_URL = process.env.API_URL as string | undefined
    const API_KEY = process.env.API_KEY as string | undefined

    if (!API_URL || !API_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    try {
        const formData = await req.formData()
        const outgoingFormData = new FormData()

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                outgoingFormData.append(key, value, value.name)
            } else {
                outgoingFormData.append(key, value)
            }
        }

        const response = await fetch(`${API_URL}/generate/${type}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
            body: outgoingFormData,
        })

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json({ error: errorData.detail || 'API error' }, { status: response.status })
        }

        const data = await response.arrayBuffer()
        const contentDisposition = response.headers.get('Content-Disposition')
        const contentType = response.headers.get('Content-Type') || 'application/json'

        const headers: Record<string, string> = {
            'Content-Type': contentType,
        }
        if (contentDisposition) {
            headers['Content-Disposition'] = contentDisposition
        }

        return new NextResponse(data, {
            status: response.status,
            headers,
        })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
