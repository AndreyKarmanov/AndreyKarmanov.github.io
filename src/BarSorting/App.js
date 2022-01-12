import React from 'react';
import SortingOptions from './SortingOptions.js';

class SortingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortValue: 'merge',
            sortSize: "50",
            blocks: []
        };

        this.sortTypes = {
            'bubble': this.sortBubble, 'heap': this.sortHeap,
            'merge': this.sortMerge, 'quick': this.sortQuick,
            'insert': this.sortInsertion, 'selection': this.sortSelection
        };


        this.updateSize = this.updateSize.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.make_bars = this.make_bars.bind(this);
        this.startSort = this.startSort.bind(this);
        this.slowRender = this.slowRender.bind(this);
        this.sortMergeRecur2 = this.sortMergeRecur2.bind(this);
        this.sortQuickRecur = this.sortQuickRecur.bind(this);
        this.sorting = false;
        this.sorted = false;
    };

    componentDidMount() {
        this.make_bars(50);
    };

    // Thanks to cocco on stack overflow, shuffles an array.
    fy(a, b, c, d) {//array,placeholder,placeholder,placeholder
        c = a.length; while (c) {
            b = Math.random() * c-- | 0;
            d = a[c];
            a[c] = a[b];
            a[b] = d;
        }
        return a;
    };

    slowRender(blocks) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.setState({ blocks: blocks }, () => {
                    resolve()
                })
            }, 1375 / parseInt(this.state.sortSize));
        })
    }

    make_bars(amount) {
        this.setState({
            blocks: this.fy([...Array(parseInt(amount)).keys()])
        });
        this.sorted = false
    };

    updateSort(e) {
        this.setState({
            sortValue: e.target.value
        });
    };

    updateSize(e) {
        this.make_bars(e.target.value)
    };

    startSort() {
        if (this.sorting || this.sorted) {
            return
        };
        this.sorting = true
        console.log(this.state.sortValue, 'selected')
        this.sortTypes[this.state.sortValue].bind(this)().then(() => {
            this.sorting = false
            this.sorted = true
            console.log('sorting complete')
            this.forceUpdate();
        });
        console.log('done starting')
    }

    swap(arr, a, b) {
        [arr[a], arr[b]] = [arr[b], arr[a]]
    }

    async sortBubble() {
        let a = this.state.blocks
        let unsorted = true;
        while (unsorted) {
            unsorted = false;
            for (let x = 0; x < a.length - 1; x++) {
                if (a[x] > a[x + 1]) {
                    this.swap(a, x, x + 1);
                    unsorted = true;
                    await this.slowRender(a);
                }
            };
        };
    };

    async sortSelection() {
        let a = this.state.blocks
        for (let x = 0; x < a.length; x++) {
            let min = x
            for (let y = x; y < a.length; y++) {
                if (a[min] > a[y]) {
                    min = y
                }
            }
            this.swap(a, min, x)
            await this.slowRender(a)
        }
    };

    async sortMerge() {
        await this.sortMergeRecur2(this.state.blocks, 0, this.state.blocks.length)
    };

    async sortMergeRecur2(arr, l, r) {
        // inplace merge sort.
        if (r - 1> l) {
            let middle = Math.floor((r - l) / 2) + l;
            await this.sortMergeRecur2(arr, l, middle);
            await this.sortMergeRecur2(arr, middle, r);
            await this.sortMergeMerge2(arr, l, middle, r);
        };
    };

    async sortMergeMerge2(arr, l, middle, r) {
        // inplace merge.
        let newValue = null;
        while (l < middle && middle < r) {
            if (arr[l] < arr[middle]) {
                l++;
                await this.slowRender(arr)

            } else {
                newValue = arr[middle];
                arr.splice(middle++, 1);
                arr.splice(l++, 0, newValue);
                await this.slowRender(arr)
            };
        };

        if (middle < r) {
            let slice = arr.slice(middle, r);
            arr.splice(middle, slice.length, ...slice);
            await this.slowRender(arr)
        };
    };

    async sortInsertion() {
        let a = this.state.blocks
        for (let x = 1; x < a.length; x++) {
            let pointer = x;
            for (let y = x - 1; y >= 0; y--) {
                if (a[pointer] < a[y]) {
                    this.swap(a, pointer, y)
                    pointer = y;
                    await this.slowRender(a);
                } else {
                    break;
                };
            };
        };
    };

    async sortQuick() {
        await this.sortQuickRecur(this.state.blocks, 0, this.state.blocks.length - 1)
    }

    async sortQuickRecur(a, left, right) {
        if (left < right) {
            let pivot = a[right];
            let i = left - 1;
            for (let j = left; j < right; j++) {
                if (a[j] < pivot) {
                    i += 1;
                    this.swap(a, i, j);
                    await this.slowRender(a);
                };
            };
            this.swap(a, i + 1, right);
            await this.slowRender(a);
            await this.sortQuickRecur(a, left, i);
            await this.sortQuickRecur(a, i + 2, right);
            return null
        };
    };

    async sortQuickRecur2(arr, l, r) {
        if (r > l) {
            let pivot = arr[r];
            let trail = l - 1;
            for (let pointer = l; pointer < r; pointer++) {
                if (arr[pointer] < pivot) {
                    this.swap(arr, pointer, ++trail);
                    await this.slowRender(arr);
                };
            };
            this.swap(arr, r, trail + 1);
            await this.slowRender(arr);
            await this.sortQuickRecur2(arr, l, trail);
            await this.sortQuickRecur2(arr, trail + 2, r);

        };
    };

    async sortHeap() {
        var arr = this.state.blocks
        var boundry = arr.length

        const inBounds = (i) => {
            return i < boundry;
        };

        const left = (i) => {
            return inBounds(i * 2 + 1) ? (i * 2 + 1) : null
        };

        const right = (i) => {
            return inBounds(i * 2 + 2) ? (i * 2 + 2) : null
        };
        const downHeap = async (i) => {
            let l, r, small;
            while ((l = left(i))) {
                small = l;
                if ((r = right(i))) {
                    if (arr[r] > arr[l]) {
                        small = r;
                    };
                };
                if (arr[small] > arr[i]) {
                    this.swap(arr, small, i);
                    i = small;
                    await this.slowRender(arr);
                } else {
                    break;
                };
            };
        };

        for (let x = boundry - 1; x >= 0; x--) {
            await downHeap(x);
        };

        while (boundry > 0) {
            boundry--;
            this.swap(arr, 0, boundry)
            await this.slowRender(arr)
            await downHeap(0)
        };
    };

    render() {
        return (
            <div className="list-group shadow-lg border rounded">
                <div className="bg-light list-group-item">
                    <div className="container-fluid">
                        <SortingOptions updateSort={this.updateSort} startSort={this.startSort} updateSize={this.make_bars} sortSize={this.state.sortSize} sortValue={this.state.sortValue} sorting={this.sorting} />
                    </div>
                </div>
                <div className="list-group-item">
                    <div className="container justify-content-center sorting bottom">
                        {this.state.blocks.map((number) => <div className="sortable" key={number} style={{ height: (number) + 1 + "%", backgroundColor: `hsl(177, 70%, ${60 - (number) * 0.5}%)` }}></div>)}
                    </div>
                </div>
            </div>
        );
    };
};

export default SortingApp;