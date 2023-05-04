class KeyState {
    private state: Record<string, boolean>;
    constructor() {
        this.state = {}
        this.init()
    }

    public getKeyCode(key: string) {
        return this.state[key] || false
    }

    public allState() {
        return this.state
    }
    private init() {
        window.addEventListener('keydown', ev => {
            this.state[ev.code] = true
        })
        window.addEventListener('keyup', ev => {
            this.state[ev.code] = false
        })
        window.addEventListener('mousedown', ev => {
            switch(ev.which) {
                case 1:
                    this.state["MouseLeft"] = true
                    break
                case 3:
                    this.state["MouseRight"] = true
                    break
                default:
                    break
            }
        })
        window.addEventListener('mouseup', ev => {
            switch(ev.which) {
                case 1:
                    this.state["MouseLeft"] = false
                    break
                case 3:
                    this.state["MouseRight"] = false
                    break
                default:
                    break
            }
        })
    }
}


export default KeyState
