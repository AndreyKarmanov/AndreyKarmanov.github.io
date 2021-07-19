import React from 'react';

class SortContainer extends React.Component {

  constructor(props) {
    super(props);
    this.sortBtn = props.sortBtn
    this.rangeSelect = props.rangeSelect
    this.sortSelect = props.sortSelect
    this.state = {
      sorting: false,
      array: [],
      blocks: null
    };

    this.sortTypes = {
      'bubble': this.sortBubble, 'heap': this.sortHeap,
      'merge': this.sortMerge, 'quick': this.sortQuick,
      'insert': this.sortInsertion, 'selection': this.sortSelection
    }
    this.make_bars = this.make_bars.bind(this)
    this.startSort = this.startSort.bind(this)
    this.slowRender = this.slowRender.bind(this)
    this.sortMergeRecur = this.sortMergeRecur.bind(this)
    this.sortQuickRecur = this.sortQuickRecur.bind(this)
    this.sorting = false
  };


  componentDidMount() {
    this.rangeSelect.oninput = this.make_bars
    this.sortBtn.classList.remove('disabled')
    this.sortBtn.onclick = this.startSort
    this.make_bars()
  };

  slowRender(array) {
    return new Promise((resolve, reject) => {
      this.awaitingRender = true
      setTimeout(() => {
        this.setState({ array: array }, () => {
          resolve()
        })
      }, 1375 / this.rangeSelect.value);
    })
  }

  async make_bars() {
    var array = [...Array(parseInt(this.rangeSelect.value)).keys()]
    this.fy(array)
    this.setState({ array: array });
  };

  startSort() {
    if (this.sorting || this.sortSelect.value === "-1") {
      return
    };
    this.sorting = true
    console.log(this.sortSelect.value, 'selected')
    this.sortTypes[this.sortSelect.value].bind(this)().then(() => {
      this.sorting = false
      console.log('sorting complete')
    });
    console.log('done starting')
  }

  swap(arr, a, b) {
    [arr[a], arr[b]] = [arr[b], arr[a]]
  }

  async sortBubble() {
    let a = this.state.array
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
    let a = this.state.array
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
    await this.sortMergeRecur(this.state.array, 0, this.state.array.length)
  };

  async sortMergeRecur(arr, l, r) {
    if (arr.slice(l, r).length > 1) {
      let middle = Math.floor(arr.slice(l, r).length / 2)
      let a = await this.sortMergeRecur(arr, l, l + middle)
      let b = await this.sortMergeRecur(arr, l + middle, r)
      let little = null
      let pointer = l
      while (pointer < r) {
        if (a.length > 0) {
          if (b.length > 0) {
            if (a[0] > b[0]) {
              little = b.shift();
            } else {
              little = a.shift();
            };
          } else {
            little = a.shift();
          };
        } else {
          little = b.shift();
        };
        arr[pointer++] = little;
        await this.slowRender(arr);
      };
    };
    return arr.slice(l, r)
  };

  async sortInsertion() {
    let a = this.state.array
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
    await this.sortQuickRecur(this.state.array, 0, this.state.array.length - 1)
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

  // Thanks to cocco on stack overflow, shuffles an array.
  fy(a, b, c, d) {//array,placeholder,placeholder,placeholder
    c = a.length; while (c) {
      b = Math.random() * c-- | 0;
      d = a[c];
      a[c] = a[b];
      a[b] = d;
    }
  };

  render() {
    return (
      <div className="container justify-content-center trees">
        <div className="sorting">{this.state.array.map((number) =>
          <div className="sortable" value={(number | 1)} style={{ height: (number | 1) + 1 + "%", backgroundColor: `hsl(177, 70%, ${60 - (number | 1) * 0.5}%)` }}></div>
        )}</div>
      </div>
    );
  };
};

export default SortContainer;