export type LiveRoomPhase =
    | 'waiting'
    | 'question'
    | 'reveal'
    | 'finished'
    | 'cancelled'

export type LiveAnswerPayload = Record<string, unknown>

export interface LiveRoomParticipant {
    id: string
    displayName: string
    score: number
    correctCount: number
    isConnected: boolean
}

export interface LiveRoomAnswer {
    participantId: string
    displayName: string
    answer: LiveAnswerPayload
    basePoints: number
    speedPoints: number
    points: number
}

export interface LiveRoomQuestion {
    id: string
    category: string
    quizType:
        | 'text'
        | 'map'
        | 'country'
        | 'sea'
        | 'number'
        | 'hotspot'
        | 'ordering'
    questionEn: string
    questionSv: string
    optionsEn: string[]
    optionsSv: string[]
    orderItemsEn: string[]
    orderItemsSv: string[]
    imageUrl?: string
    sliderMin?: number
    sliderMax?: number
    sliderStep?: number
    unitEn?: string
    unitSv?: string
    correctAnswer?: LiveAnswerPayload
}

export interface LiveRoomState {
    code: string
    phase: LiveRoomPhase
    isHost: boolean
    participantId?: string
    questionCount: number
    currentQuestionIndex: number
    speedBonus: boolean
    questionDeadline?: string
    hasAnswered: boolean
    participants: LiveRoomParticipant[]
    question?: LiveRoomQuestion
    answers: LiveRoomAnswer[]
}

const mapRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}

const stringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map(String) : []

const numberValue = (value: unknown, fallback = 0): number =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback

export const normalizeRoomCode = (value: string): string | null => {
    const normalized = value.trim().toUpperCase()
    return /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/.test(normalized)
        ? normalized
        : null
}

export const parseLiveRoomState = (raw: unknown): LiveRoomState => {
    const value = mapRecord(raw)
    const status = String(value.status ?? 'waiting')
    const phase: LiveRoomPhase = [
        'waiting',
        'question',
        'reveal',
        'finished',
        'cancelled',
    ].includes(status)
        ? (status as LiveRoomPhase)
        : 'waiting'
    const questionValue = mapRecord(value.question)
    const hasQuestion = typeof questionValue.id === 'string'

    return {
        code: String(value.code ?? ''),
        phase,
        isHost: value.is_host === true,
        participantId:
            typeof value.participant_id === 'string'
                ? value.participant_id
                : undefined,
        questionCount: numberValue(value.question_count, 10),
        currentQuestionIndex: numberValue(value.current_question_index),
        speedBonus: value.speed_bonus === true,
        questionDeadline:
            typeof value.question_deadline === 'string'
                ? value.question_deadline
                : undefined,
        hasAnswered: value.has_answered === true,
        participants: Array.isArray(value.participants)
            ? value.participants.map((item) => {
                  const participant = mapRecord(item)
                  return {
                      id: String(participant.id ?? ''),
                      displayName: String(participant.display_name ?? ''),
                      score: numberValue(participant.score),
                      correctCount: numberValue(participant.correct_count),
                      isConnected: participant.is_connected !== false,
                  }
              })
            : [],
        question: hasQuestion
            ? {
                  id: String(questionValue.id),
                  category: String(questionValue.category ?? ''),
                  quizType: String(
                      questionValue.quiz_type ?? 'text'
                  ) as LiveRoomQuestion['quizType'],
                  questionEn: String(questionValue.question_en ?? ''),
                  questionSv: String(questionValue.question_sv ?? ''),
                  optionsEn: stringArray(questionValue.options_en),
                  optionsSv: stringArray(questionValue.options_sv),
                  orderItemsEn: stringArray(questionValue.order_items_en),
                  orderItemsSv: stringArray(questionValue.order_items_sv),
                  imageUrl:
                      typeof questionValue.image_url === 'string'
                          ? questionValue.image_url
                          : undefined,
                  sliderMin:
                      typeof questionValue.slider_min === 'number'
                          ? questionValue.slider_min
                          : undefined,
                  sliderMax:
                      typeof questionValue.slider_max === 'number'
                          ? questionValue.slider_max
                          : undefined,
                  sliderStep:
                      typeof questionValue.slider_step === 'number'
                          ? questionValue.slider_step
                          : undefined,
                  unitEn:
                      typeof questionValue.unit_en === 'string'
                          ? questionValue.unit_en
                          : undefined,
                  unitSv:
                      typeof questionValue.unit_sv === 'string'
                          ? questionValue.unit_sv
                          : undefined,
                  correctAnswer:
                      questionValue.correct_answer &&
                      typeof questionValue.correct_answer === 'object'
                          ? mapRecord(questionValue.correct_answer)
                          : undefined,
              }
            : undefined,
        answers: Array.isArray(value.answers)
            ? value.answers.map((item) => {
                  const answer = mapRecord(item)
                  return {
                      participantId: String(answer.participant_id ?? ''),
                      displayName: String(answer.display_name ?? ''),
                      answer: mapRecord(answer.answer),
                      basePoints: numberValue(answer.base_points),
                      speedPoints: numberValue(answer.speed_points),
                      points: numberValue(answer.points),
                  }
              })
            : [],
    }
}

export const questionText = (
    question: LiveRoomQuestion,
    locale: 'en' | 'sv'
): string => (locale === 'sv' ? question.questionSv : question.questionEn)

export const questionOptions = (
    question: LiveRoomQuestion,
    locale: 'en' | 'sv'
): string[] => (locale === 'sv' ? question.optionsSv : question.optionsEn)

export const answerLabel = (
    question: LiveRoomQuestion,
    answer: LiveAnswerPayload,
    locale: 'en' | 'sv'
): string => {
    const kind = String(answer.kind ?? '')
    if (kind === 'choice') {
        const index = numberValue(answer.option_index, -1)
        return questionOptions(question, locale)[index] ?? '—'
    }
    if (kind === 'ordering') {
        const items =
            locale === 'sv' ? question.orderItemsSv : question.orderItemsEn
        const indices = Array.isArray(answer.indices)
            ? answer.indices.map(Number)
            : []
        return indices.length === items.length
            ? indices.map((index) => items[index] ?? '—').join(' → ')
            : '—'
    }
    if (kind === 'number') {
        const value = numberValue(answer.value, Number.NaN)
        if (!Number.isFinite(value)) return '—'
        const unit = locale === 'sv' ? question.unitSv : question.unitEn
        return `${value}${unit ? ` ${unit}` : ''}`
    }
    if (kind === 'region') return String(answer.value ?? '—')
    if (kind === 'map') {
        return `${numberValue(answer.lat).toFixed(1)}, ${numberValue(
            answer.lon
        ).toFixed(1)}`
    }
    if (kind === 'hotspot') return '📍'
    return '—'
}
