import * as Sentry from '@sentry/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useParams } from 'react-router-dom'

import owl from '../../../assets/images/skarp_owl.png'
import {
    getLiveRoomDisplayState,
    getLiveRoomState,
    joinLiveRoom,
    liveQuestionImageUrl,
    storedRoomToken,
    submitLiveRoomAnswer,
} from './liveRoomClient'
import {
    answerLabel,
    normalizeRoomCode,
    questionOptions,
    questionText,
} from './liveRoomState'
import type {
    LiveAnswerPayload,
    LiveRoomAnswer,
    LiveRoomQuestion,
    LiveRoomState,
} from './liveRoomState'
import './SkarpLiveRoom.scss'

type Locale = 'en' | 'sv'

const COUNTRY_CODES = new Set(
    `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW`.split(
        ' '
    )
)

const SWEDEN_COUNTIES = [
    'SE-AB',
    'SE-C',
    'SE-D',
    'SE-E',
    'SE-F',
    'SE-G',
    'SE-H',
    'SE-I',
    'SE-K',
    'SE-M',
    'SE-N',
    'SE-O',
    'SE-S',
    'SE-T',
    'SE-U',
    'SE-W',
    'SE-X',
    'SE-Y',
    'SE-Z',
    'SE-AC',
    'SE-BD',
]

const SEA_IDS = Array.from(
    new Set(
        `mediterranean_sea adriatic_sea aegean_sea black_sea north_sea baltic_sea norwegian_sea barents_sea caspian_sea red_sea persian_gulf arabian_sea bay_of_bengal south_china_sea east_china_sea yellow_sea sea_of_japan philippine_sea sea_of_okhotsk bering_sea coral_sea tasman_sea gulf_of_mexico caribbean_sea hudson_bay atlantic_ocean pacific_ocean indian_ocean arctic_ocean southern_ocean`.split(
            ' '
        )
    )
)

const countyNames: Record<string, string> = {
    'SE-AB': 'Stockholm County',
    'SE-C': 'Uppsala County',
    'SE-D': 'Södermanland County',
    'SE-E': 'Östergötland County',
    'SE-F': 'Jönköping County',
    'SE-G': 'Kronoberg County',
    'SE-H': 'Kalmar County',
    'SE-I': 'Gotland County',
    'SE-K': 'Blekinge County',
    'SE-M': 'Skåne County',
    'SE-N': 'Halland County',
    'SE-O': 'Västra Götaland County',
    'SE-S': 'Värmland County',
    'SE-T': 'Örebro County',
    'SE-U': 'Västmanland County',
    'SE-W': 'Dalarna County',
    'SE-X': 'Gävleborg County',
    'SE-Y': 'Västernorrland County',
    'SE-Z': 'Jämtland County',
    'SE-AC': 'Västerbotten County',
    'SE-BD': 'Norrbotten County',
}

const regionLabel = (code: string, locale: Locale): string => {
    if (countyNames[code]) return countyNames[code]
    if (COUNTRY_CODES.has(code)) {
        try {
            return (
                new Intl.DisplayNames([locale], { type: 'region' }).of(code) ??
                code
            )
        } catch {
            return code
        }
    }
    return code
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

const SkarpLiveRoom: React.FC = () => {
    const { code: routeCode = '' } = useParams<{ code: string }>()
    const location = useLocation()
    const displayMode = location.pathname.endsWith('/display')
    const code = normalizeRoomCode(routeCode)
    const [locale, setLocale] = useState<Locale>(() =>
        navigator.language.toLowerCase().startsWith('sv') ? 'sv' : 'en'
    )
    const [name, setName] = useState('')
    const [room, setRoom] = useState<LiveRoomState | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const tokenRef = useRef<string | null>(code ? storedRoomToken(code) : null)
    const roomRef = useRef<LiveRoomState | null>(null)

    useEffect(() => {
        roomRef.current = room
    }, [room])

    const refresh = useCallback(async () => {
        if (!code) return
        try {
            const next = displayMode
                ? await getLiveRoomDisplayState(code)
                : tokenRef.current
                  ? await getLiveRoomState(code, tokenRef.current)
                  : null
            if (next) setRoom(next)
        } catch (cause) {
            if (!roomRef.current) setError('The room could not be loaded.')
            Sentry.captureException(cause, {
                tags: { operation: 'liveRoom.webRefresh' },
                extra: { displayMode, phase: roomRef.current?.phase },
            })
        }
    }, [code, displayMode])

    useEffect(() => {
        if (displayMode || tokenRef.current) void refresh()
    }, [displayMode, refresh])

    useEffect(() => {
        if (!room) return
        const timer = window.setInterval(() => void refresh(), 1000)
        return () => window.clearInterval(timer)
    }, [refresh, room])

    const join = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!code || !name.trim()) return
        setLoading(true)
        setError(null)
        try {
            const result = await joinLiveRoom(code, name.trim())
            tokenRef.current = result.token
            setRoom(result.state)
        } catch (cause) {
            setError(
                'Could not join. Check the code and nickname, then try again.'
            )
            Sentry.captureException(cause, {
                tags: { operation: 'liveRoom.webJoin' },
            })
        } finally {
            setLoading(false)
        }
    }

    const submit = async (answer: LiveAnswerPayload) => {
        if (!code || !tokenRef.current || loading) return
        setLoading(true)
        setError(null)
        try {
            setRoom(await submitLiveRoomAnswer(code, tokenRef.current, answer))
        } catch (cause) {
            setError('Your answer could not be submitted. Try once more.')
            Sentry.captureException(cause, {
                tags: { operation: 'liveRoom.webSubmit' },
                extra: { questionType: room?.question?.quizType },
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={`skarp-live ${displayMode ? 'is-display' : ''}`}>
            <Helmet>
                <title>Live Quiz · Skarp</title>
                <meta
                    name="description"
                    content="Join a live Skarp quiz room from any browser."
                />
            </Helmet>
            <header className="skarp-live__header">
                <a href="/skarp" className="skarp-live__brand">
                    <img src={owl} alt="" />
                    <span>Skarp Live</span>
                </a>
                <button
                    className="skarp-live__language"
                    onClick={() => setLocale(locale === 'en' ? 'sv' : 'en')}
                >
                    {locale === 'en' ? 'SV' : 'EN'}
                </button>
            </header>

            {!code ? (
                <StatusCard title="Invalid room code">
                    Ask the host for a new invite link.
                </StatusCard>
            ) : !room && !displayMode ? (
                <JoinCard
                    code={code}
                    name={name}
                    loading={loading}
                    error={error}
                    onNameChange={setName}
                    onSubmit={join}
                />
            ) : !room ? (
                <StatusCard title="Connecting to room">
                    <span className="skarp-live__spinner" />
                    {error && <p className="skarp-live__error">{error}</p>}
                </StatusCard>
            ) : (
                <RoomView
                    room={room}
                    locale={locale}
                    displayMode={displayMode}
                    loading={loading}
                    error={error}
                    onSubmit={submit}
                />
            )}
        </main>
    )
}

const JoinCard: React.FC<{
    code: string
    name: string
    loading: boolean
    error: string | null
    onNameChange: (value: string) => void
    onSubmit: (event: React.FormEvent) => void
}> = ({ code, name, loading, error, onNameChange, onSubmit }) => (
    <section className="skarp-live__card skarp-live__join">
        <p className="skarp-live__eyebrow">Room</p>
        <h1>{code}</h1>
        <p>Choose the name everyone will see during the match.</p>
        <form onSubmit={onSubmit}>
            <label htmlFor="live-nickname">Nickname</label>
            <input
                id="live-nickname"
                value={name}
                maxLength={24}
                autoComplete="nickname"
                autoFocus
                onChange={(event) => onNameChange(event.target.value)}
            />
            <button disabled={loading || !name.trim()}>
                {loading ? 'Joining…' : 'Join live quiz'}
            </button>
        </form>
        {error && <p className="skarp-live__error">{error}</p>}
    </section>
)

const RoomView: React.FC<{
    room: LiveRoomState
    locale: Locale
    displayMode: boolean
    loading: boolean
    error: string | null
    onSubmit: (answer: LiveAnswerPayload) => Promise<void>
}> = ({ room, locale, displayMode, loading, error, onSubmit }) => {
    if (room.phase === 'waiting') {
        return (
            <section className="skarp-live__card skarp-live__lobby">
                <p className="skarp-live__eyebrow">Room code</p>
                <h1>{room.code}</h1>
                <h2>Waiting for players</h2>
                <PlayerGrid room={room} />
                {displayMode && (
                    <p className="skarp-live__hint">
                        Players join at jacobhal.se/skarp/room/{room.code}
                    </p>
                )}
            </section>
        )
    }
    if (room.phase === 'finished') {
        return <FinalLeaderboard room={room} />
    }
    if (!room.question) {
        return <StatusCard title="Loading question">Please wait…</StatusCard>
    }

    return (
        <section className="skarp-live__game">
            <div className="skarp-live__progress-row">
                <span>
                    {room.currentQuestionIndex + 1}/{room.questionCount}
                </span>
                <Countdown deadline={room.questionDeadline} />
            </div>
            <div className="skarp-live__progress">
                <span
                    style={{
                        width: `${
                            ((room.currentQuestionIndex + 1) /
                                room.questionCount) *
                            100
                        }%`,
                    }}
                />
            </div>
            {room.phase === 'reveal' ? (
                <Reveal room={room} locale={locale} />
            ) : (
                <QuestionCard
                    key={room.question.id}
                    room={room}
                    locale={locale}
                    displayMode={displayMode}
                    loading={loading}
                    onSubmit={onSubmit}
                />
            )}
            {error && <p className="skarp-live__error">{error}</p>}
        </section>
    )
}

const QuestionCard: React.FC<{
    room: LiveRoomState
    locale: Locale
    displayMode: boolean
    loading: boolean
    onSubmit: (answer: LiveAnswerPayload) => Promise<void>
}> = ({ room, locale, displayMode, loading, onSubmit }) => {
    const question = room.question!
    const imageUrl = liveQuestionImageUrl(question.imageUrl)

    return (
        <div className="skarp-live__card skarp-live__question">
            <p className="skarp-live__eyebrow">
                {question.category.replaceAll('_', ' ')}
            </p>
            <h1>{questionText(question, locale)}</h1>
            {imageUrl && question.quizType !== 'hotspot' && (
                <img
                    className="skarp-live__question-image"
                    src={imageUrl}
                    alt=""
                />
            )}
            {displayMode ? (
                <p className="skarp-live__display-prompt">
                    Answer on your phone
                </p>
            ) : room.hasAnswered ? (
                <div className="skarp-live__locked">
                    <span>✓</span>
                    Answer locked in. Waiting for everyone else…
                </div>
            ) : (
                <QuestionInput
                    question={question}
                    locale={locale}
                    loading={loading}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    )
}

const QuestionInput: React.FC<{
    question: LiveRoomQuestion
    locale: Locale
    loading: boolean
    onSubmit: (answer: LiveAnswerPayload) => Promise<void>
}> = ({ question, locale, loading, onSubmit }) => {
    const options = questionOptions(question, locale)
    const [number, setNumber] = useState(
        ((question.sliderMin ?? 0) + (question.sliderMax ?? 100)) / 2
    )
    const [order, setOrder] = useState(
        [0, 1, 2, 3].sort(() => Math.random() - 0.5)
    )
    const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
    const [region, setRegion] = useState('')

    if (question.quizType === 'text') {
        return (
            <div className="skarp-live__choices">
                {options.map((option, index) => (
                    <button
                        key={`${index}-${option}`}
                        disabled={loading}
                        onClick={() =>
                            void onSubmit({
                                kind: 'choice',
                                option_index: index,
                            })
                        }
                    >
                        {option}
                    </button>
                ))}
            </div>
        )
    }
    if (question.quizType === 'number') {
        return (
            <div className="skarp-live__number">
                <strong>
                    {number}{' '}
                    {locale === 'sv' ? question.unitSv : question.unitEn}
                </strong>
                <input
                    type="range"
                    min={question.sliderMin}
                    max={question.sliderMax}
                    step={question.sliderStep ?? 1}
                    value={number}
                    onChange={(event) => setNumber(Number(event.target.value))}
                />
                <button
                    disabled={loading}
                    onClick={() =>
                        void onSubmit({ kind: 'number', value: number })
                    }
                >
                    Lock answer
                </button>
            </div>
        )
    }
    if (question.quizType === 'ordering') {
        const items =
            locale === 'sv' ? question.orderItemsSv : question.orderItemsEn
        const move = (index: number, delta: number) => {
            const nextIndex = index + delta
            if (nextIndex < 0 || nextIndex >= order.length) return
            const next = [...order]
            ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
            setOrder(next)
        }
        return (
            <div className="skarp-live__ordering">
                {order.map((itemIndex, index) => (
                    <div key={itemIndex}>
                        <span>{index + 1}</span>
                        <strong>{items[itemIndex]}</strong>
                        <button
                            aria-label="Move up"
                            onClick={() => move(index, -1)}
                            disabled={index === 0}
                        >
                            ↑
                        </button>
                        <button
                            aria-label="Move down"
                            onClick={() => move(index, 1)}
                            disabled={index === order.length - 1}
                        >
                            ↓
                        </button>
                    </div>
                ))}
                <button
                    disabled={loading}
                    onClick={() =>
                        void onSubmit({ kind: 'ordering', indices: order })
                    }
                >
                    Lock order
                </button>
            </div>
        )
    }
    if (question.quizType === 'hotspot') {
        return (
            <PointBoard
                imageUrl={liveQuestionImageUrl(question.imageUrl)}
                point={point}
                onPoint={setPoint}
                onSubmit={() =>
                    point &&
                    onSubmit({ kind: 'hotspot', x: point.x, y: point.y })
                }
                loading={loading}
            />
        )
    }
    if (question.quizType === 'map') {
        return (
            <MapCoordinateInput
                point={point}
                onPoint={setPoint}
                loading={loading}
                onSubmit={() =>
                    point &&
                    onSubmit({
                        kind: 'map',
                        lat: 90 - point.y * 180,
                        lon: point.x * 360 - 180,
                    })
                }
            />
        )
    }

    const values =
        question.quizType === 'sea'
            ? SEA_IDS
            : question.category === 'sweden'
              ? SWEDEN_COUNTIES
              : Array.from(COUNTRY_CODES)
    const sorted = values
        .map((code) => ({ code, label: regionLabel(code, locale) }))
        .sort((left, right) => left.label.localeCompare(right.label, locale))
    return (
        <div className="skarp-live__region">
            <label htmlFor="region-answer">
                {question.quizType === 'sea' ? 'Sea or ocean' : 'Country'}
            </label>
            <select
                id="region-answer"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
            >
                <option value="">Choose…</option>
                {sorted.map((item) => (
                    <option key={item.code} value={item.code}>
                        {item.label}
                    </option>
                ))}
            </select>
            <button
                disabled={loading || !region}
                onClick={() => void onSubmit({ kind: 'region', value: region })}
            >
                Lock answer
            </button>
        </div>
    )
}

const PointBoard: React.FC<{
    imageUrl?: string
    point: { x: number; y: number } | null
    onPoint: (point: { x: number; y: number }) => void
    onSubmit: () => void | Promise<void>
    loading: boolean
}> = ({ imageUrl, point, onPoint, onSubmit, loading }) => (
    <div className="skarp-live__point-input">
        <button
            type="button"
            className="skarp-live__point-board"
            style={
                imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined
            }
            onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                onPoint({
                    x: (event.clientX - rect.left) / rect.width,
                    y: (event.clientY - rect.top) / rect.height,
                })
            }}
        >
            {point && (
                <span
                    style={{
                        left: `${point.x * 100}%`,
                        top: `${point.y * 100}%`,
                    }}
                >
                    📍
                </span>
            )}
        </button>
        <button disabled={!point || loading} onClick={onSubmit}>
            Lock position
        </button>
    </div>
)

const MapCoordinateInput: React.FC<{
    point: { x: number; y: number } | null
    onPoint: (point: { x: number; y: number }) => void
    onSubmit: () => void | Promise<void>
    loading: boolean
}> = ({ point, onPoint, onSubmit, loading }) => (
    <div className="skarp-live__point-input">
        <button
            type="button"
            aria-label="Place your map pin"
            className="skarp-live__point-board skarp-live__world-board"
            onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                onPoint({
                    x: (event.clientX - rect.left) / rect.width,
                    y: (event.clientY - rect.top) / rect.height,
                })
            }}
        >
            <span className="skarp-live__world-shape" aria-hidden="true">
                ◜▰ ◝ ▰ ◟▰◞
            </span>
            {point && (
                <span
                    style={{
                        left: `${point.x * 100}%`,
                        top: `${point.y * 100}%`,
                    }}
                >
                    📍
                </span>
            )}
        </button>
        <button disabled={!point || loading} onClick={onSubmit}>
            Lock position
        </button>
    </div>
)

const Reveal: React.FC<{ room: LiveRoomState; locale: Locale }> = ({
    room,
    locale,
}) => {
    const question = room.question!
    const correctIndex = Number(question.correctAnswer?.option_index ?? -1)

    return (
        <div className="skarp-live__reveal">
            <div className="skarp-live__card">
                <p className="skarp-live__eyebrow">Everyone&apos;s answers</p>
                <h1>{questionText(question, locale)}</h1>
                {question.quizType === 'text' ? (
                    <div className="skarp-live__answer-groups">
                        {questionOptions(question, locale).map(
                            (option, index) => (
                                <div
                                    key={option}
                                    className={
                                        index === correctIndex
                                            ? 'is-correct'
                                            : ''
                                    }
                                >
                                    <strong>{option}</strong>
                                    <span>
                                        {room.answers
                                            .filter(
                                                (answer) =>
                                                    Number(
                                                        answer.answer
                                                            .option_index
                                                    ) === index
                                            )
                                            .map((answer) => answer.displayName)
                                            .join(', ') || '—'}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                ) : question.quizType === 'hotspot' ? (
                    <HotspotReveal room={room} question={question} />
                ) : question.quizType === 'map' ? (
                    <MapReveal room={room} />
                ) : (
                    <AnswerList
                        room={room}
                        question={question}
                        locale={locale}
                    />
                )}
            </div>
            <Leaderboard room={room} title="Round leaderboard" />
        </div>
    )
}

const AnswerList: React.FC<{
    room: LiveRoomState
    question: LiveRoomQuestion
    locale: Locale
}> = ({ room, question, locale }) => (
    <ul className="skarp-live__answers">
        {room.answers.map((answer) => (
            <li key={answer.participantId}>
                <span>{answer.displayName}</span>
                <strong>
                    {question.quizType === 'country' ||
                    question.quizType === 'sea'
                        ? regionLabel(String(answer.answer.value ?? ''), locale)
                        : answerLabel(question, answer.answer, locale)}
                </strong>
                <em>+{answer.points}</em>
            </li>
        ))}
    </ul>
)

const HotspotReveal: React.FC<{
    room: LiveRoomState
    question: LiveRoomQuestion
}> = ({ room, question }) => {
    const imageUrl = liveQuestionImageUrl(question.imageUrl)
    return (
        <div
            className="skarp-live__point-board skarp-live__point-reveal"
            style={
                imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined
            }
        >
            {room.answers.map((answer) => (
                <AnswerMarker key={answer.participantId} answer={answer} />
            ))}
            {typeof question.correctAnswer?.x === 'number' &&
                typeof question.correctAnswer?.y === 'number' && (
                    <span
                        className="is-target"
                        style={{
                            left: `${Number(question.correctAnswer.x) * 100}%`,
                            top: `${Number(question.correctAnswer.y) * 100}%`,
                        }}
                    >
                        ◎
                    </span>
                )}
        </div>
    )
}

const AnswerMarker: React.FC<{ answer: LiveRoomAnswer }> = ({ answer }) => (
    <span
        title={answer.displayName}
        style={{
            left: `${Number(answer.answer.x ?? 0) * 100}%`,
            top: `${Number(answer.answer.y ?? 0) * 100}%`,
        }}
    >
        📍
    </span>
)

const MapReveal: React.FC<{ room: LiveRoomState }> = ({ room }) => (
    <div className="skarp-live__point-board skarp-live__world-board skarp-live__point-reveal">
        <span className="skarp-live__world-shape" aria-hidden="true">
            ◜▰ ◝ ▰ ◟▰◞
        </span>
        {room.answers.map((answer) => {
            const x = (Number(answer.answer.lon ?? 0) + 180) / 360
            const y = (90 - Number(answer.answer.lat ?? 0)) / 180
            return (
                <span
                    key={answer.participantId}
                    title={answer.displayName}
                    style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                >
                    📍
                </span>
            )
        })}
    </div>
)

const Leaderboard: React.FC<{ room: LiveRoomState; title: string }> = ({
    room,
    title,
}) => (
    <div className="skarp-live__card skarp-live__leaderboard">
        <p className="skarp-live__eyebrow">{title}</p>
        <ol>
            {room.participants.map((player) => (
                <li key={player.id}>
                    <span>{player.displayName}</span>
                    <strong>{player.score}</strong>
                </li>
            ))}
        </ol>
    </div>
)

const FinalLeaderboard: React.FC<{ room: LiveRoomState }> = ({ room }) => (
    <section className="skarp-live__final">
        <div className="skarp-live__trophy">🏆</div>
        <p className="skarp-live__eyebrow">Winner</p>
        <h1>{room.participants[0]?.displayName ?? '—'}</h1>
        <Leaderboard room={room} title="Final leaderboard" />
    </section>
)

const PlayerGrid: React.FC<{ room: LiveRoomState }> = ({ room }) => (
    <div className="skarp-live__players">
        {room.participants.map((player) => (
            <div key={player.id}>
                <span>{player.displayName.slice(0, 1).toUpperCase()}</span>
                {player.displayName}
            </div>
        ))}
    </div>
)

const Countdown: React.FC<{ deadline?: string }> = ({ deadline }) => {
    const [now, setNow] = useState(Date.now())
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 250)
        return () => window.clearInterval(timer)
    }, [])
    const seconds = deadline
        ? Math.max(0, Math.ceil((new Date(deadline).getTime() - now) / 1000))
        : 0
    return (
        <strong className={seconds <= 5 ? 'is-urgent' : ''}>{seconds}</strong>
    )
}

const StatusCard: React.FC<React.PropsWithChildren<{ title: string }>> = ({
    title,
    children,
}) => (
    <section className="skarp-live__card skarp-live__status">
        <h1>{title}</h1>
        <div>{children}</div>
    </section>
)

export default SkarpLiveRoom
