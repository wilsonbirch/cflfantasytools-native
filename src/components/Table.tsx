import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '~/lib/ui'

export type Cell = string | number | null | undefined
export type Sort = { col: number; desc: boolean } | null

// Compact stat table: the first column is the label and flexes, the rest are
// fixed-width right-aligned numeric columns. `sortable` makes the header row
// tappable; sort state is local unless the screen passes `sort`/`onSort`
// (which it does when it renders rows itself inside a FlatList so the header
// can stick). No chart library, by design.
export default function Table({
    title,
    head,
    rows,
    caption,
    sortable = false,
    accent,
    onPressRow,
}: {
    title?: string
    head: string[]
    rows: Cell[][]
    caption?: string
    sortable?: boolean
    // Left-border colour per row — team colour keyed by slug, typically.
    accent?: (row: Cell[], i: number) => string | undefined
    onPressRow?: (row: Cell[], i: number) => void
}) {
    const [sort, setSort] = useState<Sort>(null)
    if (rows.length === 0) return null
    const ordered = sortRows(rows, sort, (r) => r)
    return (
        <View style={styles.table} accessibilityRole="list" accessibilityLabel={title}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <TableHead
                cells={head}
                sort={sort}
                onSort={sortable ? (col) => setSort(nextSort(sort, col)) : undefined}
            />
            {ordered.map((r, i) => (
                <TableRow
                    key={i}
                    cells={r}
                    accent={accent?.(r, i)}
                    onPress={onPressRow && (() => onPressRow(r, i))}
                />
            ))}
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        </View>
    )
}

// Tapping a column sorts it descending, tapping again ascending, a third tap
// clears. Numeric columns are what people sort, so descending first.
export const nextSort = (sort: Sort, col: number): Sort =>
    sort?.col !== col ? { col, desc: true } : sort.desc ? { col, desc: false } : null

// `cells` picks the comparable cells off a row, so screens can sort richer
// row objects (cells plus a team slug for the accent) with the same rule.
export function sortRows<R>(rows: R[], sort: Sort, cells: (r: R) => Cell[]): R[] {
    if (!sort) return rows
    const { col, desc } = sort
    const cmp = (a: Cell, b: Cell): number => {
        if (a == null || b == null) return a == null ? (b == null ? 0 : 1) : -1
        if (typeof a === 'number' && typeof b === 'number') return b - a
        return String(b).localeCompare(String(a), undefined, { numeric: true })
    }
    return [...rows].sort((a, b) => (desc ? 1 : -1) * cmp(cells(a)[col], cells(b)[col]))
}

export function TableHead({
    cells,
    sort,
    onSort,
}: {
    cells: string[]
    sort?: Sort
    onSort?: (col: number) => void
}) {
    return (
        <View style={[styles.row, styles.headRow]}>
            {cells.map((c, i) => {
                const on = sort?.col === i
                const text = (
                    <Text
                        numberOfLines={1}
                        style={[styles.head, i > 0 && styles.right, on && styles.headOn]}
                    >
                        {c}
                        {on ? (sort.desc ? ' \u25be' : ' \u25b4') : ''}
                    </Text>
                )
                return onSort ? (
                    <Pressable
                        key={i}
                        onPress={() => onSort(i)}
                        accessibilityRole="button"
                        accessibilityLabel={`Sort by ${c || 'name'}`}
                        accessibilityState={{ selected: on }}
                        style={layout(i, cells.length)}
                        hitSlop={4}
                    >
                        {text}
                    </Pressable>
                ) : (
                    <View key={i} style={layout(i, cells.length)}>
                        {text}
                    </View>
                )
            })}
        </View>
    )
}

export function TableRow({
    cells,
    accent,
    onPress,
}: {
    cells: Cell[]
    accent?: string
    onPress?: () => void
}) {
    const body = cells.map((c, i) => (
        <Text
            key={i}
            numberOfLines={1}
            style={[layout(i, cells.length), styles.cell, i > 0 && styles.right]}
        >
            {fmt(c)}
        </Text>
    ))
    const style = [styles.row, accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null]
    return onPress ? (
        <Pressable
            style={style}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={String(cells[0] ?? '')}
        >
            {body}
        </Pressable>
    ) : (
        <View style={style}>{body}</View>
    )
}

// First column flexes; the rest are fixed, narrower once there are many.
const layout = (i: number, n: number) =>
    i === 0 ? styles.label : n > 5 ? styles.narrow : styles.num

export const fmt = (c: Cell): string =>
    typeof c === 'number' ? (Number.isInteger(c) ? String(c) : c.toFixed(1)) : (c ?? '–')

const styles = StyleSheet.create({
    table: { paddingHorizontal: 16, paddingBottom: 16 },
    title: { color: colors.text, fontSize: 16, fontWeight: '600', paddingVertical: 8 },
    caption: { color: colors.muted, fontSize: 12, paddingTop: 6 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingLeft: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    headRow: { backgroundColor: colors.bg },
    label: { flex: 1 },
    num: { width: 52 },
    narrow: { width: 40 },
    cell: { color: colors.text, fontSize: 14 },
    right: { textAlign: 'right', fontVariant: ['tabular-nums'] },
    head: { color: colors.muted, fontSize: 12, textTransform: 'uppercase' },
    headOn: { color: colors.text },
})
