import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { BaseMeeting } from './BaseMeeting'

function getFilenameFromDisposition(disposition: string | null): string {
    if (!disposition) return 'document.docx'
    const match = disposition.match(/filename="?([^"]+)"?/)
    return match ? match[1] : 'document.docx'
}

export default function SessionMeeting({ onBack }: { onBack: () => void }) {
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
        plaud_ai_notes: null as File | null,
        addendum_images: [] as File[],
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({ plaudAiNotes: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target

        if (name === 'own_notes') {
            setForm((prev) => ({ ...prev, own_notes: files?.[0] || null }))
        }

        if (name === 'plaud_ai_notes') {
            setForm((prev) => ({ ...prev, plaud_ai_notes: files?.[0] || null }))
            setErrors((prev) => ({ ...prev, plaudAiNotes: '' }))
        }

        if (name === 'addendum_images') {
            setForm((prev) => ({ ...prev, addendum_images: files ? Array.from(files) : [] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = { plaudAiNotes: '' }

        if (!form.plaud_ai_notes) {
            newErrors.plaudAiNotes = 'Please upload your Plaud AI notes.'
        }

        setErrors(newErrors)

        if (newErrors.plaudAiNotes) {
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

        if (form.own_notes) {
            formData.append('own_notes', form.own_notes)
        }

        if (form.plaud_ai_notes) {
            formData.append('plaud_ai_notes', form.plaud_ai_notes)
        }

        if (form.addendum_images) {
            form.addendum_images.forEach((file) => {
                formData.append('addendum_images', file)
            })
        }

        try {
            const res = await fetch('/api/generate/session-meeting', {
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
                    plaud_ai_notes: null,
                    addendum_images: [],
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
        <>
            <div key="own-notes" className="flex flex-col gap-2">
                <Label htmlFor="own_notes">Own Notes</Label>
                <Input id="own_notes" name="own_notes" type="file" accept=".txt, .docx" onChange={handleFile} />
            </div>
            <div key="plaud-ai-notes" className="flex flex-col gap-2">
                <Label htmlFor="plaud_ai_notes">Plaud AI Notes (required)</Label>
                <Input id="plaud_ai_notes" className={`cursor-pointer ${errors.plaudAiNotes ? 'border-red-500 ring-1 ring-red-500' : ''}`} name="plaud_ai_notes" type="file" accept=".docx" onChange={handleFile} />
                {errors.plaudAiNotes && <p className="text-red-500 text-sm mt-1">{errors.plaudAiNotes}</p>}
            </div>
            <div key="addendum-images" className="flex flex-col gap-2">
                <Label htmlFor="addendum_images">Addendum Images</Label>
                <Input id="addendum_images" name="addendum_images" type="file" accept=".png, .jpeg, .jpg, .webp" multiple onChange={handleFile} />
            </div>
        </>
    )

    return <BaseMeeting title="Session Meeting" formInitialState={form} errorsInitialState={errors} handleChange={handleChange} handleFile={handleFile} handleSubmit={handleSubmit} loading={loading} errors={errors} additionalFields={[additionalFields]} onBack={onBack} />
}
