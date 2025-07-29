import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { BaseMeeting } from './BaseMeeting'

function getFilenameFromDisposition(disposition: string | null): string {
    if (!disposition) return 'document.docx'
    const match = disposition.match(/filename="?([^"]+)"?/)
    return match ? match[1] : 'document.docx'
}

export default function FrameworkMeeting({ onBack }: { onBack: () => void }) {
    const [form, setForm] = useState({
        client_name: '',
        meeting_date: '',
        meeting_time: '',
        tenx_attendees: '',
        client_attendees: '',
        location: 'Meetdistrict Gent - ',
        registration_number: 'DV.A249258',
        kmop_project_number: '',
        own_notes: null as File | null,
        framework_images: [] as File[],
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({ frameworkImages: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target

        if (name === 'own_notes') {
            setForm((prev) => ({ ...prev, own_notes: files?.[0] || null }))
        }

        if (name === 'framework_images') {
            setForm((prev) => ({ ...prev, framework_images: files ? Array.from(files) : [] }))
            setErrors((prev) => ({ ...prev, frameworkImages: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = { frameworkImages: '' }

        if (!form.framework_images.length) {
            newErrors.frameworkImages = 'Please upload your Framework Images.'
        }

        setErrors(newErrors)

        if (newErrors.frameworkImages) {
            return
        }

        setLoading(true)

        const dataToSend = {
            client_name: form.client_name,
            meeting_date: form.meeting_date,
            meeting_time: form.meeting_time,
            tenx_attendees: form.tenx_attendees.split(',').map((attendee) => attendee.trim()),
            client_attendees: form.client_attendees.split(',').map((attendee) => attendee.trim()),
            location: form.location,
            registration_number: form.registration_number,
            kmop_project_number: form.kmop_project_number,
        }
        const formData = new FormData()

        formData.append('data', JSON.stringify(dataToSend))
        form.framework_images.forEach((file) => {
            formData.append('framework_images', file)
        })

        try {
            const res = await fetch('/api/generate/framework-meeting', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                const disposition = res.headers.get('Content-Disposition')
                const filename = getFilenameFromDisposition(disposition)
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')

                a.href = url
                a.download = filename

                document.body.appendChild(a)

                a.click()
                a.remove()

                window.URL.revokeObjectURL(url)

                setForm({
                    client_name: '',
                    meeting_date: '',
                    meeting_time: '',
                    tenx_attendees: '',
                    client_attendees: '',
                    location: '',
                    registration_number: '',
                    kmop_project_number: '',
                    own_notes: null,
                    framework_images: [],
                })
            } else {
                const errorData = await res.json()
                console.error('Error:', errorData)
                alert(`Submission failed: ${errorData.error || errorData.detail || 'Server error'}`)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            alert('An error occurred. Check the console for details.')
        } finally {
            setLoading(false)
        }
    }

    const additionalFields = (
        <div key="framework-images" className="flex flex-col gap-2">
            <Label htmlFor="framework_images">Framework Images (required)</Label>
            <Input id="framework_images" className={`cursor-pointer ${errors.frameworkImages ? 'border-red-500 ring-1 ring-red-500' : ''}`} name="framework_images" type="file" accept=".png, .jpeg, .jpg, .webp" multiple onChange={handleFile} />
            {errors.frameworkImages && <p className="text-red-500 text-sm mt-1">{errors.frameworkImages}</p>}
        </div>
    )

    return <BaseMeeting title="Framework Meeting" formInitialState={form} errorsInitialState={errors} handleChange={handleChange} handleFile={handleFile} handleSubmit={handleSubmit} loading={loading} errors={errors} additionalFields={[additionalFields]} onBack={onBack} />
}
