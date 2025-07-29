import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { JSX } from 'react'

interface FormState {
    client_name: string
    meeting_date: string
    meeting_time: string
    tenx_attendees: string
    client_attendees: string
    location: string
    registration_number: string
    kmop_project_number: string
}

interface ErrorsState {
    [key: string]: string
}

interface BaseMeetingProps {
    title: string
    formInitialState: FormState
    errorsInitialState: ErrorsState
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    loading: boolean
    errors: ErrorsState
    additionalFields: JSX.Element[]
    onBack: () => void
}

export function BaseMeeting({ title, formInitialState, handleChange, handleSubmit, loading, errors, additionalFields, onBack }: BaseMeetingProps) {
    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input id="client_name" name="client_name" value={formInitialState.client_name} onChange={handleChange} placeholder="e.g. Medical Precision" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formInitialState.location} onChange={handleChange} placeholder="e.g. Meetdistrict Gent - MeetBox 330" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="meeting_date">Meeting Date</Label>
                    <Input id="meeting_date" name="meeting_date" type="date" value={formInitialState.meeting_date} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="meeting_time">Meeting Time</Label>
                    <Input id="meeting_time" name="meeting_time" type="time" value={formInitialState.meeting_time} onChange={handleChange} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="tenx_attendees">TenX Attendees</Label>
                    <Textarea id="tenx_attendees" className="resize-none" name="tenx_attendees" value={formInitialState.tenx_attendees} onChange={handleChange} placeholder="e.g. Stefan Van de Poel, Joris Uytterhaegen" rows={2} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="client_attendees">Client Attendees</Label>
                    <Textarea id="client_attendees" className="resize-none" name="client_attendees" value={formInitialState.client_attendees} onChange={handleChange} placeholder="e.g. Benjamin Stuer" rows={2} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input id="registration_number" name="registration_number" value={formInitialState.registration_number} onChange={handleChange} placeholder="DV.A249258" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="kmop_project_number">KMOP Project Number</Label>
                    <Input id="kmop_project_number" name="kmop_project_number" value={formInitialState.kmop_project_number} onChange={handleChange} placeholder="e.g. 2025KMO057087" />
                </div>
            </div>
            {Array.isArray(additionalFields) && additionalFields.map((field, index) => React.cloneElement(field as React.ReactElement, { key: index }))}
            <div className="mt-2 flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={loading}>
                    Go back
                </Button>
                <Button type="submit" variant="default" size="lg" disabled={loading}>
                    {loading ? 'Generating...' : 'Submit'}
                </Button>
            </div>
        </form>
    )
}
