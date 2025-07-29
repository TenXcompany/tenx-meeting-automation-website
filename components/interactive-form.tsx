'use client'

import FrameworkMeeting from '@/components/forms/FrameworkMeeting'
import ManagementMeeting from '@/components/forms/ManagementMeeting'
import SessionMeeting from '@/components/forms/SessionMeeting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const cardOptions = [
    { id: 'framework-meeting', title: 'Framework Meeting' },
    { id: 'management-meeting', title: 'Management Meeting' },
    { id: 'session-meeting', title: 'Session Meeting' },
]

type Step = 'intro' | 'select' | 'form'

export default function TenXFlow() {
    const [step, setStep] = useState<Step>('intro')
    const [selected, setSelected] = useState<string | null>(null)

    const renderForm = () => {
        switch (selected) {
            case 'framework-meeting':
                return <FrameworkMeeting onBack={() => setStep('select')} />
            case 'management-meeting':
                return <ManagementMeeting onBack={() => setStep('select')} />
            case 'session-meeting':
                return <SessionMeeting onBack={() => setStep('select')} />
            default:
                return null
        }
    }

    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div key="intro" initial={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="flex flex-col items-center gap-6 p-4">
                        <h1 className="text-3xl text-center font-bold">TenX Meeting Automation Tool</h1>
                        <Button size="lg" onClick={() => setStep('select')}>
                            Let&apos;s generate
                        </Button>
                    </motion.div>
                )}
                {step === 'select' && (
                    <motion.div key="select" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="flex flex-col items-center gap-6">
                        <h2 className="text-2xl font-semibold">Choose a meeting type</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {cardOptions.map((opt) => (
                                <Card key={opt.id} className={`cursor-pointer transition-all ${selected === opt.id ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`} onClick={() => setSelected(opt.id)}>
                                    <CardContent className="p-4">
                                        <h3 className="text-center font-semibold">{opt.title}</h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button size="lg" disabled={!selected} onClick={() => setStep('form')}>
                            Confirm
                        </Button>
                    </motion.div>
                )}
                {step === 'form' && (
                    <motion.div key="form" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="w-full p-4 sm:p-6 lg:p-8">
                        {renderForm()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
