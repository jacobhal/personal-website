import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import {
    checkIntegrityAdmin,
    getFairPlayReminders,
    integrityAdminClient,
    issueFairPlayReminder,
    setIntegrityAdminPassword,
    signInIntegrityAdmin,
    signOutIntegrityAdmin,
    type FairPlayReminder,
} from '../../services/integrityAdmin'

const panel = {
    p: 2,
    mb: 3,
    border: '1px solid #2A2A40',
    borderRadius: 3,
    backgroundColor: '#1A1A28',
    color: '#ECECF2',
    '& .MuiInputBase-root': { color: '#ECECF2' },
    '& .MuiInputLabel-root': { color: '#A0A0B4' },
    '& .MuiFormHelperText-root': { color: '#B8B8CA' },
    '& .MuiCheckbox-root': { color: '#A5B4FC' },
    '& .MuiButton-text, & .MuiButton-outlined': { color: '#A5B4FC' },
    '& .MuiButton-contained': { backgroundColor: '#5C6BC0', color: '#FFFFFF' },
    '& .MuiButton-root.Mui-disabled': {
        backgroundColor: '#343440',
        color: '#A0A0B4',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#51516A' },
    '& button': { minHeight: 44, textTransform: 'none' },
}
export const IntegrityAdmin: React.FC<{
    userId?: string
    playerName?: string
    restricted?: boolean
}> = ({ userId, playerName, restricted }) => {
    const [allowed, setAllowed] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [setup, setSetup] = useState(
        () =>
            typeof window !== 'undefined' &&
            /type=(invite|recovery)/.test(window.location.hash)
    )
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [note, setNote] = useState('')
    const [evidence, setEvidence] = useState('')
    const [reviewed, setReviewed] = useState(false)
    const [history, setHistory] = useState<FairPlayReminder[] | null>(null)
    const [sent, setSent] = useState(false)
    const requestId = useRef<string | null>(null)
    const selected = useRef(userId)
    selected.current = userId
    useEffect(() => {
        let active = true
        let auth: ReturnType<typeof integrityAdminClient>['auth']
        try {
            auth = integrityAdminClient().auth
        } catch {
            setError('Admin sign-in is not configured for this build.')
            return
        }
        const refresh = async () => {
            try {
                const { data } = await auth.getSession()
                const ok = !!data.session && (await checkIntegrityAdmin())
                if (active) setAllowed(ok)
            } catch {
                if (active) {
                    setAllowed(false)
                    setError('Could not verify admin access. Sign in again.')
                }
            }
        }
        void refresh()
        const { data } = auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') setSetup(true)
            setTimeout(() => {
                if (active) void refresh()
            }, 0)
        })
        return () => {
            active = false
            data.subscription.unsubscribe()
        }
    }, [])
    useEffect(() => {
        let active = true
        setHistory(null)
        setNote('')
        setEvidence('')
        setReviewed(false)
        setSent(false)
        requestId.current = null
        if (allowed && userId)
            void getFairPlayReminders(userId).then(
                (rows) => {
                    if (active) setHistory(rows)
                },
                () => {
                    if (active)
                        setError(
                            'Could not load reminder history. Refresh before sending.'
                        )
                }
            )
        return () => {
            active = false
        }
    }, [allowed, userId])
    const run = async (action: () => Promise<void>) => {
        setBusy(true)
        setError('')
        try {
            await action()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Request failed.')
        } finally {
            setBusy(false)
        }
    }
    const refreshHistory = async () => {
        if (!userId) return
        const id = userId
        const rows = await getFairPlayReminders(id)
        if (selected.current === id) setHistory(rows)
    }
    const cooldown = history?.some(
        (row) =>
            !row.acknowledged_at ||
            Date.now() - Date.parse(row.issued_at) < 30 * 86400000
    )
    const canSend =
        allowed &&
        !busy &&
        !!userId &&
        history !== null &&
        !cooldown &&
        !restricted &&
        reviewed &&
        note.trim().length >= 20 &&
        note.trim().length <= 2000 &&
        evidence.trim().length >= 5 &&
        evidence.trim().length <= 200
    return (
        <Box
            component="details"
            open={allowed || setup ? true : undefined}
            sx={panel}
        >
            <Box
                component="summary"
                sx={{ cursor: 'pointer', minHeight: 44, fontWeight: 700 }}
            >
                Admin reminders
            </Box>
            <Typography variant="h6">Fair-play reminders</Typography>
            <Typography sx={{ color: '#A0A0B4', fontSize: 13, mb: 2 }}>
                A separate admin account is required to send a personal
                reminder. Viewing access stays read-only.
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {setup ? (
                <Stack
                    component="form"
                    spacing={2}
                    onSubmit={(event) => {
                        event.preventDefault()
                        void run(async () => {
                            await setIntegrityAdminPassword(password)
                            setPassword('')
                            setSetup(false)
                            setAllowed(await checkIntegrityAdmin())
                        })
                    }}
                >
                    <TextField
                        label="Set admin password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        inputProps={{ minLength: 12 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={busy || password.length < 12}
                    >
                        Save admin password
                    </Button>
                </Stack>
            ) : !allowed ? (
                <Stack
                    component="form"
                    spacing={2}
                    onSubmit={(event) => {
                        event.preventDefault()
                        void run(async () => {
                            await signInIntegrityAdmin(email, password)
                            setPassword('')
                            setAllowed(true)
                        })
                    }}
                >
                    <TextField
                        label="Admin email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Admin password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="outlined" disabled={busy}>
                        Sign in as admin
                    </Button>
                </Stack>
            ) : (
                <>
                    <Button
                        onClick={() =>
                            void run(async () => {
                                await signOutIntegrityAdmin()
                                setAllowed(false)
                                setHistory(null)
                                setPassword('')
                            })
                        }
                        disabled={busy}
                    >
                        Sign out of admin
                    </Button>
                    {!userId ? (
                        <Typography>
                            Select a player to review their reminder history.
                        </Typography>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Send a personal reminder
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                To: {playerName}
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: '#0E0E14',
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                                    A quick reminder about fair play
                                </Typography>
                                <Typography paragraph>
                                    We noticed an unusual pattern in your recent
                                    ranked answers. This does not necessarily
                                    mean you broke any rules.
                                </Typography>
                                <Typography paragraph>
                                    Ranked matches must be played using your own
                                    knowledge. Searching online, using AI tools,
                                    or getting answers from another person is
                                    not allowed.
                                </Typography>
                                <Typography>
                                    This reminder does not change your ranked
                                    access. If something affected your games,
                                    you can let us know.
                                </Typography>
                            </Box>
                            <Stack spacing={2}>
                                <TextField
                                    label="Internal review note"
                                    multiline
                                    minRows={3}
                                    value={note}
                                    onChange={(e) => {
                                        setNote(e.target.value)
                                        requestId.current = null
                                    }}
                                    inputProps={{ maxLength: 2000 }}
                                    helperText="Private. Describe the evidence you reviewed, not just the score."
                                />
                                <TextField
                                    label="Evidence reference"
                                    value={evidence}
                                    onChange={(e) => {
                                        setEvidence(e.target.value)
                                        requestId.current = null
                                    }}
                                    inputProps={{ maxLength: 200 }}
                                    helperText="Use match IDs or a specific review period. The same evidence cannot be sent twice."
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={reviewed}
                                            onChange={(e) =>
                                                setReviewed(e.target.checked)
                                            }
                                        />
                                    }
                                    label="I reviewed the underlying answers and sample sizes. The score alone is not evidence of cheating."
                                />
                                {(cooldown || restricted) && (
                                    <Alert severity="info">
                                        {restricted
                                            ? 'This player already has a ranked restriction. Review that case separately.'
                                            : 'A reminder is pending or was sent in the last 30 days.'}
                                    </Alert>
                                )}
                                <Button
                                    variant="contained"
                                    disabled={!canSend}
                                    onClick={() =>
                                        void run(async () => {
                                            const id = userId
                                            requestId.current ??=
                                                crypto.randomUUID()
                                            const result =
                                                await issueFairPlayReminder(
                                                    id,
                                                    note,
                                                    evidence,
                                                    requestId.current
                                                )
                                            if (selected.current !== id) return
                                            setHistory((rows) => [
                                                result,
                                                ...(rows ?? []).filter(
                                                    (row) =>
                                                        row.id !== result.id
                                                ),
                                            ])
                                            setSent(true)
                                            setReviewed(false)
                                        })
                                    }
                                >
                                    Send reminder
                                </Button>
                                {sent && (
                                    <Alert severity="success">
                                        Reminder queued for the player's next
                                        safe app opening. It does not change
                                        ranked access.
                                    </Alert>
                                )}
                            </Stack>
                            <Typography sx={{ fontWeight: 700, mt: 3 }}>
                                Reminder history
                            </Typography>
                            <Button
                                onClick={() => void run(refreshHistory)}
                                disabled={busy}
                            >
                                Refresh history
                            </Button>
                            {history?.length === 0 && (
                                <Typography>No reminders sent.</Typography>
                            )}
                            {history?.map((row) => (
                                <Box
                                    key={row.id}
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        border: '1px solid #51516A',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography>
                                        Sent{' '}
                                        {new Date(
                                            row.issued_at
                                        ).toLocaleString()}
                                    </Typography>
                                    <Typography>
                                        {row.acknowledged_at
                                            ? `Acknowledged ${new Date(row.acknowledged_at).toLocaleString()}`
                                            : row.delivered_at
                                              ? `Displayed ${new Date(row.delivered_at).toLocaleString()}`
                                              : 'Not displayed yet'}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: '#A0A0B4',
                                            mt: 1,
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {row.internal_note}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: '#A0A0B4',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        Evidence: {row.evidence_key}
                                    </Typography>
                                </Box>
                            ))}
                        </>
                    )}
                </>
            )}
        </Box>
    )
}
