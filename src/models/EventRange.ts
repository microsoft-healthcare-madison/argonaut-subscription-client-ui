export type EventRange = { endRange: number, count: number };
export type EventList = EventRange[];

export type RemovalResult = { result?: EventList, removed?: EventList }

export function getStart({ count, endRange }: EventRange): number {
    return endRange - count;
}

export function removeRangeFromList(list: EventList, remove: EventRange): RemovalResult {
    const noRemoval = (result: EventList): RemovalResult => {
        return result.length === 0
            ? {}
            : { result };
    };
    const removal = (result: EventList, removed: EventList): RemovalResult => {
        return result.length === 0
            ? removed.length === 0
                ? {}
                : { removed }
            : removed.length === 0
                ? { result }
                : { removed, result };
    };
    const headTailCheck = getHeadAndTail(list, remove);
    if (headTailCheck.type === 'no-removal') {
        return noRemoval(list);
    } else {
        const { headResults: { baseHeadIndex, resultHead }, tailResults: { baseTailIndex, resultTail } } = headTailCheck;
        const baseHead: EventRange = list[baseHeadIndex];
        const baseTail: EventRange = list[baseTailIndex];

        const leftOverhang = getLeftOverhang(baseHead, remove);
        const rightOverhang = getRightOverhang(baseTail, remove);

        if (baseTailIndex === baseHeadIndex) {
            const overlappedRange = baseHead;
            const overlapStart = getStart(baseHead);
            let removedRange: EventRange;
            // Need to handle 4 undershot scenarios
            if (leftOverhang.type === 'undershot' &&
                rightOverhang.type === 'undershot') {
                const rightUndershot = rightOverhang.undershot;
                const leftUndershot = leftOverhang.undershot;
                const startRight = getStart(rightUndershot);
                resultHead.push(leftUndershot);
                resultTail.unshift(rightUndershot);
                removedRange = {
                    endRange: startRight,
                    count: startRight - leftUndershot.endRange
                };
            } else if (leftOverhang.type === 'undershot') {
                const leftUndershot = leftOverhang.undershot;
                resultHead.push(leftUndershot);
                removedRange = {
                    endRange: overlappedRange.endRange,
                    count: overlappedRange.endRange - leftUndershot.endRange
                };
            } else if (rightOverhang.type === 'undershot') {
                const rightUndershot = rightOverhang.undershot;
                const rightStart = getStart(rightUndershot);
                resultTail.unshift(rightUndershot);
                removedRange = {
                    endRange: rightStart,
                    count: rightStart - overlapStart
                };
            } else {
                removedRange = baseHead;
            }
            return removal([...resultHead, ...resultTail], [removedRange]);
        } else {
            const removed = list.slice(baseHeadIndex + 1, baseTailIndex - 1);
            // Can handle left and right overhangs independently
            // We overlap more than one range. Check both overhangs
            if (leftOverhang.type === 'undershot') {
                const { undershot } = leftOverhang;
                resultHead.push(undershot);
                const { endRange } = baseHead;
                removed.unshift({
                    endRange,
                    count: endRange - undershot.endRange
                });
            } else {
                removed.unshift(baseHead);
            }
            if (rightOverhang.type === 'undershot') {
                const { undershot } = rightOverhang;
                resultTail.unshift(undershot);
                const endRange = getStart(undershot);
                removed.push({
                    endRange,
                    count: endRange - getStart(baseTail)
                });
            }
            else {
                removed.push(baseTail);
            }
            return removal([...resultHead, ...resultTail], removed);
        }
    }
}

// Calculate head/tail values
type TailProps = { resultTail: EventList, baseTailIndex: number };
type HeadProps = { resultHead: EventList, baseHeadIndex: number };
type HeadTailProps = {
    type: 'removal',
    headResults: HeadProps,
    tailResults: TailProps
} | { type: 'no-removal' };

function getHeadAndTail(list: EventList, remove: EventRange): HeadTailProps {
    const _length = list.length;
    const removeStart = getStart(remove);
    // Try out no overlaps explicitly
    if ((removeStart >= list[_length - 1].endRange) || (remove.endRange <= getStart(list[0]))) {
        return { type: 'no-removal' };
    } else {
        const headIndex = (_length - 1) - list.slice().reverse().findIndex(entry => removeStart >= entry.endRange);
        const tailIndex = list.findIndex(entry => remove.endRange <= getStart(entry));
        return {
            type: 'removal',
            headResults: headIndex === _length
                ? { resultHead: [], baseHeadIndex: 0 }
                : { resultHead: list.slice(0, headIndex + 1), baseHeadIndex: headIndex + 1 },
            tailResults: tailIndex === -1
                ? { resultTail: [], baseTailIndex: _length - 1 }
                : { resultTail: list.slice(tailIndex), baseTailIndex: tailIndex - 1 }
        }
    }
}

// Types for overhangs
type Exact = { type: 'exact' };
type Overshot = { type: 'overshot', overshot: EventRange };
type Undershot = { type: 'undershot', undershot: EventRange };
type OverhangResult = Exact | Overshot | Undershot;
const getRightOverhang = (left: EventRange, right: EventRange): OverhangResult => {
    const overhang = right.endRange - left.endRange;
    return overhang > 0
        ? {
            type: 'overshot', overshot: {
                endRange: right.endRange,
                count: overhang
            }
        }
        : overhang === 0
            ? { type: 'exact' }
            : {
                type: 'undershot', undershot: {
                    endRange: left.endRange,
                    count: -overhang
                }
            };
};
const getLeftOverhang = (right: EventRange, left: EventRange): OverhangResult => {
    const rightStart = getStart(right);
    const leftStart = getStart(left);
    const overhang = leftStart - rightStart;
    return overhang > 0
        ? {
            type: 'undershot', undershot: {
                endRange: leftStart,
                count: overhang
            }
        }
        : overhang === 0
            ? { type: 'exact' }
            : {
                type: 'overshot', overshot: {
                    endRange: rightStart,
                    count: -overhang
                }
            };
};