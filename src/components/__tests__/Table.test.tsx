import { act, fireEvent, render, screen } from '@testing-library/react-native'
import Table, { fmt, nextSort, sortRows } from '../Table'

const rows = [
    ['A', 10, 1.25],
    ['B', 30, null],
    ['C', 20, 0.5],
]

it('formats cells: integers, one decimal, dash for missing', async () => {
    expect(fmt(10)).toBe('10')
    expect(fmt(1.25)).toBe('1.3')
    expect(fmt(null)).toBe('–')
    expect(fmt('1S')).toBe('1S')
})

it('cycles a column descending, ascending, off', async () => {
    const s1 = nextSort(null, 1)
    expect(s1).toEqual({ col: 1, desc: true })
    expect(nextSort(s1, 1)).toEqual({ col: 1, desc: false })
    expect(nextSort(nextSort(s1, 1), 1)).toBeNull()
    expect(nextSort(s1, 2)).toEqual({ col: 2, desc: true })
})

it('sorts numbers numerically and pushes nulls last', async () => {
    const id = (r: (typeof rows)[number]) => r
    expect(sortRows(rows, { col: 1, desc: true }, id).map((r) => r[0])).toEqual(['B', 'C', 'A'])
    expect(sortRows(rows, { col: 1, desc: false }, id).map((r) => r[0])).toEqual(['A', 'C', 'B'])
    expect(sortRows(rows, { col: 2, desc: true }, id).map((r) => r[0])).toEqual(['A', 'C', 'B'])
    expect(sortRows(rows, null, id)).toBe(rows)
})

it('renders nothing for no rows', async () => {
    await render(<Table head={['Player', 'Yds']} rows={[]} />)
    expect(screen.queryByText('Player')).toBeNull()
})

it('sorts on header tap when sortable and calls onPressRow', async () => {
    const onPressRow = jest.fn()
    await render(
        <Table head={['Player', 'Yds', 'EPA']} rows={rows} sortable onPressRow={onPressRow} />,
    )
    const yds = screen.getByLabelText('Sort by Yds')
    await act(() => fireEvent.press(yds))
    const labels = screen.getAllByRole('button').map((b) => b.props.accessibilityLabel)
    // Three sortable headers, then the rows in sorted order.
    expect(labels.slice(3)).toEqual(['B', 'C', 'A'])
    await act(() => fireEvent.press(screen.getByLabelText('B')))
    expect(onPressRow).toHaveBeenCalledWith(['B', 30, null], 0)
})
