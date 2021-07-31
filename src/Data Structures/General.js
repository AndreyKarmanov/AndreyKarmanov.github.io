var nextID = 0;

export const highlightClass = {
    0: '',
    1: 'updated',
    2: 'touched'
};
export class BaseNode {
    constructor(value, highlight = 0) {
        // 0 == nothing
        // 1 == updated
        // 2 == compared
        this.value = value;
        this.highlight = highlight;
        this.id = nextID++;
    };
};