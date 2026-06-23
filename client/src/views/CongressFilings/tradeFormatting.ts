export interface FilingTrade {
    owner: string
    asset: string
    ticker: string | null
    side: string
    instrument: string
    txn_date: string
    amount_low: number | null
    amount_high: number | null
}

const shortMoney = (value: number | null): string => {
    if (value === null) {
        return '?'
    }
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
    }
    return `$${value}`
}

const formatAge = (txnDate: string, referenceDate: string | Date): string | null => {
    const txn = new Date(txnDate)
    const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate)

    if (Number.isNaN(txn.getTime()) || Number.isNaN(ref.getTime())) {
        return null
    }

    const msPerDay = 24 * 60 * 60 * 1000
    const age = Math.floor((ref.getTime() - txn.getTime()) / msPerDay)

    return age >= 0 ? `${age}d ago` : null
}

export const formatTradeSummary = (
    trade: FilingTrade,
    referenceDate: string | Date = new Date()
): string => {
    const verb = trade.side === 'buy' ? 'BUY' : trade.side === 'sell' ? 'SELL' : trade.side.toUpperCase()
    const label = trade.ticker ?? trade.asset
    const instrument = trade.instrument === 'options' ? ' (opt)' : ''
    const moneyRange = `${shortMoney(trade.amount_low)}-${shortMoney(trade.amount_high)}`
    const age = formatAge(trade.txn_date, referenceDate)
    const timing = age
        ? `traded ${trade.txn_date} (${age})`
        : `traded ${trade.txn_date}`

    return `${verb} ${label}${instrument} ${moneyRange} • ${timing}`
}

export const summarizeTrades = (
    trades: FilingTrade[],
    referenceDate: string | Date = new Date(),
    maxVisible = 3
): { lines: string[]; overflowCount: number } => ({
    lines: trades.slice(0, maxVisible).map((trade) => formatTradeSummary(trade, referenceDate)),
    overflowCount: Math.max(trades.length - maxVisible, 0),
})
