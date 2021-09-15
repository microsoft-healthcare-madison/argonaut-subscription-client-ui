import { EventRange, removeRangeFromList, RemovalResult } from '../models/EventRange';

type RemoveScenario = {
    remove: EventRange,
    list: EventRange[],
    expected: RemovalResult
}

const processRemove = (desc: string, sc: RemoveScenario) => {
    it(desc, () => {
        const { list, remove, expected } = sc;
        const actual = removeRangeFromList(list, remove);
        expect(actual).toEqual(expected);
    });
}

describe('Test removing eventRange from a list', () => {
    processRemove('Removal N/A if we did not have the event (too early)', {
        list: [{
            endRange: 2,
            count: 1
        }],
        remove: {
            endRange: 1,
            count: 1
        },
        expected: {
            result: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Removal N/A if we did not have the event (too late)', {
        list: [{
            endRange: 2,
            count: 1
        }],
        remove: {
            endRange: 3,
            count: 1
        },
        expected: {
            result: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Can remove an entire range', {
        list: [{
            endRange: 2,
            count: 1
        }],
        remove: {
            endRange: 2,
            count: 1
        },
        expected: {
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Removal can split a range', {
        list: [{
            endRange: 3,
            count: 3
        }],
        remove: {
            endRange: 2,
            count: 1
        },
        expected: {
            result: [{
                endRange: 1,
                count: 1
            }, {
                endRange: 3,
                count: 1
            }],
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Removal ignores left overhang', {
        list: [{
            endRange: 3,
            count: 2
        }],
        remove: {
            endRange: 2,
            count: 2
        },
        expected: {
            result: [{
                endRange: 3,
                count: 1
            }],
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Removal ignores right overhang', {
        list: [{
            endRange: 2,
            count: 2
        }],
        remove: {
            endRange: 3,
            count: 2
        },
        expected: {
            result: [{
                endRange: 1,
                count: 1
            }],
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Can remove beginning of a range', {
        list: [{
            endRange: 2,
            count: 2
        }],
        remove: {
            endRange: 1,
            count: 1
        },
        expected: {
            result: [{
                endRange: 2,
                count: 1
            }],
            removed: [{
                endRange: 1,
                count: 1
            }]
        }
    });
    processRemove('Can remove end of a range', {
        list: [{
            endRange: 2,
            count: 2
        }],
        remove: {
            endRange: 2,
            count: 1
        },
        expected: {
            result: [{
                endRange: 1,
                count: 1
            }],
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
    processRemove('Can remove end of a terminal range in a multi-range array, ignoring overhang', {
        list: [{
            endRange: 2,
            count: 1
        }, {
            endRange: 5,
            count: 2
        }],
        remove: {
            endRange: 6,
            count: 2
        },
        expected: {
            result: [{
                endRange: 2,
                count: 1
            }, {
                endRange: 4,
                count: 1
            }],
            removed: [{
                endRange: 5,
                count: 1
            }]
        }
    });
    processRemove('Can remove beginning of a beginning range in a multi-range array, ignoring overhang', {
        list: [{
            endRange: 3,
            count: 2
        }, {
            endRange: 5,
            count: 1
        }],
        remove: {
            endRange: 2,
            count: 2
        },
        expected: {
            result: [{
                endRange: 3,
                count: 1
            }, {
                endRange: 5,
                count: 1
            }],
            removed: [{
                endRange: 2,
                count: 1
            }]
        }
    });
});