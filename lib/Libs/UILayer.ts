import CanvasRender from "./CanvasRender";
export type UILayerType = "rect" | "button" | "slider" | "checkbox" | "radio" | "empty" | "label"
class UILayerOption {
    public type: UILayerType;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public children: UILayerOption[];
    public title: string;
    public visible: boolean;
    public UILayer: UILayer;
    public id: number;
    public backgroundColor: string;
    public hoverBackgroundColor: string;
    public bounds: { top: number; left: number; bottom: number; width: number; right: number; height: number };
    public state: 1 | 2 | 3;
    public activeBackgroundColor: string;
    public moving: boolean;
    public options: Record<string, any>;
    public font: { fontName: string; size: number };
    public parent: null | UILayerOption;
    matchLabel: string;
    bindObject: Record<string, any>;
    matchKey: string[];
    public value: any;
    private listener: Map<string, any[]>;
    constructor(type: UILayerType, ui: UILayer) {
        this.type = type
        this.id = Math.floor(Math.random() * Date.now())
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.children = []
        this.title = ""
        this.visible = false
        this.moving = false
        this.UILayer = ui
        this.backgroundColor = "rgba(40,40,40,0.6)"
        this.hoverBackgroundColor = "rgba(40,40,40,0.6)"
        this.activeBackgroundColor = "rgba(40,40,40,0.6)"
        this.state = 1
        this.parent = null
        this.matchLabel = ""
        this.matchKey = []
        this.value = false
        this.bindObject = {}
        this.listener = new Map()
        this.font = {
            size: 12,
            fontName: "serif"
        }
        this.options = {}
        this.bounds = {
            left: 0,
            right: 0,
            top: 0,
            width: 0,
            height: 0,
            bottom: 0
        }

        this._init()
    }


    private _init() {
        if(this.type === "rect") {
            this.backgroundColor = "rgba(40,40,40,0.6)"
            this.hoverBackgroundColor = "rgba(40,40,40,0.6)"
            this.activeBackgroundColor = "rgba(40,40,40,0.6)"
        } else if (this.type === "button") {
            this.backgroundColor = "#3e5d96"
            this.hoverBackgroundColor = "#4c77c4"
            this.activeBackgroundColor = "#35486b"
        } else if (this.type === "label") {
            this.backgroundColor = "#00000000"
            this.hoverBackgroundColor = "#00000000"
            this.activeBackgroundColor = "#00000000"
        } else if (this.type === "checkbox") {
            this.backgroundColor = "#3e5d9688"
            this.hoverBackgroundColor = "rgba(78,120,196,0.53)"
            this.activeBackgroundColor = "#3e5d9688"
        } else if (this.type === "slider") {
            this.height = 20
        }
    }

    public bind(object: Record<string, any>) {
        this.bindObject = object
        return this
    }

    public proxyHandler() {}

    public setFont(size: number, name: string) {
        this.font.size = size
        this.font.fontName = name
        return this
    }


    public setBackgroundColor(value: string) {
        this.backgroundColor = value
        return this
    }
    public setActiveBackgroundColor(value: string) {
        this.activeBackgroundColor = value
        return this
    }
    public setHoverBackgroundColor(value: string) {
        this.hoverBackgroundColor = value
        return this
    }

    public setX(value: number) {
        this.x = value
        this.updateBounds()
        return this
    }
    public setY(value: number) {
        this.y = value
        this.updateBounds()
        return this
    }
    public setWidth(value: number) {
        this.width = value
        this.updateBounds()
        if(this.type === "checkbox") this.height = value
        return this
    }
    public setHeight(value: number) {
        this.height = value
        if(this.type === "slider") this.height = 20
        if(this.type === "checkbox") this.width = value
        this.updateBounds()
        return this
    }

    public show() {
        this.visible = true
        return this
    }

    public hidden() {
        this.visible = false
        return this
    }

    public addEventListener(event: string, fn: any) {
        if(this.listener.has(event)) {
            const listener = this.listener.get(event)
            if(listener) {
                listener.push(fn)
                this.listener.set(event, listener)
            }
        } else {
            this.listener.set(event, [fn])
        }
        return this
    }

    public removeEventListener(event: string, fn: typeof Function) {
        if(this.listener.has(event)) {
            const listener = this.listener.get(event)
            if(listener) {
                const fIndex = listener.findIndex(fn_ => fn_ === fn)
                if(fIndex !== -1) {
                    listener.splice(fIndex, 1)
                    this.listener.set(event, listener)
                }
            }
        }
        return this
    }


    public emit(event: string, data: any) {
        const fns = this.listener.get(event)
        if(fns) fns.forEach(fn => fn(data))
    }

    public updateBounds() {
        this.bounds.left = this.x
        this.bounds.right = this.x + this.width
        this.bounds.top = this.y
        this.bounds.bottom = this.y + this.height
        this.bounds.width = this.width
        this.bounds.right = this.x + this.width
        this.bounds.height = this.height
        this.bounds.bottom = this.y + this.height

        if(this.parent) {
            this.bounds.left += this.parent.x
            this.bounds.top += this.parent.y
            this.bounds.right += this.parent.x
            this.bounds.bottom += this.parent.y

            if(this.parent.type === "rect") {
                this.bounds.bottom += 20
                this.bounds.top += 20
            }
        }

        if(this.children.length > 0) {
            this.children.forEach(option => {
                option.updateBounds()
            })
        }

    }


    public add(ui: UILayerOption) {
        if(this.children.includes(ui) || ui.type === 'rect') return this
        ui.setParent(this)
        this.children.push(ui)
        ui.updateBounds()
        return this
    }


    public create(cb: (ui: UILayerOption) => void) {
        cb(this)
        return this
    }

    public setTitle(title: string) {
        this.title = title
        this.matchLabel = title
        this.matchKey = []
        const reg = /\{\{(.*?)\}\}/g
        let keyMatch = reg.exec(title)
        while (keyMatch) {
            this.matchKey.push(keyMatch[1].trim())
            keyMatch = reg.exec(title)
        }
        return this
    }


    public setParent(ui: UILayerOption) {
        this.parent = ui
        return this
    }
}

class UILayer {
    private readonly render: CanvasRender;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly objects: Map<number, UILayerOption>;
    private hasElement: boolean;
    private data: { count: number, Date: number, testTitle: string };
    constructor(canvasRender: CanvasRender) {
        this.render = canvasRender
        this.canvas = canvasRender.getCanvas()
        this.ctx = canvasRender.getContext()
        this.objects = new Map()
        this.hasElement = false
        this.data = {
            count: 0,
            Date: Date.now(),
            testTitle: "Hello"
        }
        this.test()
        this._Init()
    }

    public getRender() {
        return this.render
    }

    private _Init() {
        window.addEventListener('mousemove', ev => {
            const x = ev.clientX
            const y = ev.clientY
            let hoverIndex = 0
            this.objects.forEach((option, key) => {
                if(x >= option.bounds.left && x<= option.bounds.right && y >= option.bounds.top && y <= option.bounds.bottom) {
                    if(option.state !== 3) option.state = 2
                    option.emit("mousemove", ev)
                    hoverIndex = key
                } else {
                    option.state = 1
                }

                if(option.moving) {
                    option.x = ev.clientX - option.options.moveXOffset
                    option.y = ev.clientY - option.options.moveYOffset
                    hoverIndex = option.id
                }
            })
            this.hasElement = hoverIndex > 0
        })
        window.addEventListener('mousedown', ev => {
            const x = ev.clientX
            const y = ev.clientY
            this.objects.forEach(option => {
                if(x >= option.bounds.left && x<= option.bounds.right && y >= option.bounds.top && y <= option.bounds.bottom) {
                    option.state = 3
                    option.emit('mousedown', ev)
                    // option.emit("click", ev)
                    if(option.type === "rect" && x >= option.bounds.left && x<= option.bounds.right && y >= option.bounds.top && y <= option.bounds.top + 20) {
                        option.moving = true
                        option.options.moveXOffset = (ev.clientX - option.bounds.left)
                        option.options.moveYOffset = (ev.clientY - option.bounds.top)
                    }
                } else {
                    option.state = 1
                }
            })
        })
        window.addEventListener('mouseup', ev => {
            const x = ev.clientX
            const y = ev.clientY
            this.objects.forEach(option => {
                if(option.moving) {
                    option.moving = false
                    option.updateBounds()
                }
                if(x >= option.bounds.left && x<= option.bounds.right && y >= option.bounds.top && y <= option.bounds.bottom) {
                    option.state = 2
                    option.emit('mouseup', ev)
                    option.emit("click", ev)
                } else {
                    option.state = 1
                }
            })
        })
    }

    private test() {
        this.createRect(100, 100, 400, 300, "Engine Debug").addEventListener("click",() => {
            // alert("Click"
        }).create((rect: UILayerOption) => {
            this.createButton("Button1", 10, 10, 0, 20).create((b) => {
                rect.add(b)
            }).addEventListener("click",() => {
                this.data.count++
            })

            this.createLabel("Count: {{count}} {{ Date}} {{      testTitle   }}", 10, 40, 0, 20).create((label) => {
                rect.add(label)
            }).bind(this.data)

            this.createCheckbox(false, "CheckBox", 10, 80).create(checkbox => {
                rect.add(checkbox)
            })

            this.createSlider(50, 10, 130, 200).create(slider => {
                rect.add(slider)
            })

        }).create(rect => {
            console.log(rect)
        })
    }


    public createSlider(value: number, x: number, y: number, width?: number) {
        const slider = new UILayerOption('slider', this)
        slider.setX(x)
        slider.setY(y)
        slider.setWidth(width || 150)
        slider.value = value
        this.objects.set(slider.id, slider)

        let offsetX = 0
        let isMove = false
        slider.addEventListener('mousedown', (ev: MouseEvent) => {
            isMove = true
            offsetX = ev.clientX - slider.bounds.left - 10
            if(offsetX < 0) offsetX = 0
            if(offsetX > slider.width - 20) offsetX = slider.width - 20
            slider.value = Math.floor(offsetX / (slider.width - 20) * 100)
        })

        slider.addEventListener('mousemove', (ev: MouseEvent) => {
            if(isMove) {
                offsetX = ev.clientX - slider.bounds.left - 10
                if(offsetX < 0) offsetX = 0
                if(offsetX > slider.width - 20) offsetX = slider.width - 20
                slider.value = Math.floor(offsetX / (slider.width - 20) * 100)
            }
        })

        slider.addEventListener('mouseup', (ev: MouseEvent) => {
            isMove = false
            offsetX = ev.clientX - slider.bounds.left - 10
            if(offsetX < 0) offsetX = 0
            if(offsetX > slider.width - 20) offsetX = slider.width - 20
            slider.value = Math.floor(offsetX / (slider.width - 20) * 100)
        })

        return slider
    }


    public createLabel(text: string, x: number, y: number, width: number, height: number) {
        const label = new UILayerOption("label", this)
        label.setTitle(text || "")
        label.setX(x)
        label.setY(y)
        label.setWidth(width)
        label.setHeight(height)
        this.objects.set(label.id, label)

        return label
    }

    public createCheckbox(status: boolean, label: string, x: number, y: number, size?: number) {
        const checkbox = new UILayerOption("checkbox", this)
        checkbox.setTitle(label || "")
        checkbox.setX(x)
        checkbox.setY(y)
        checkbox.setWidth(size || 20)
        checkbox.setHeight(size || 20)
        checkbox.value = status

        checkbox.addEventListener("click",() => {
            checkbox.value = !checkbox.value
        })

        this.objects.set(checkbox.id, checkbox)


        return checkbox
    }


    public createButton(label: string, x: number, y: number, width: number, height: number) {
        const button = new UILayerOption('button', this)

        button.setTitle(label || "")
        button.setX(x)
        button.setY(y)
        button.setWidth(width)
        button.setHeight(height)
        this.objects.set(button.id, button)

        return button
    }


    public createRect(x: number, y: number, width: number, height: number, title?: string) {
        const rect = new UILayerOption('rect', this)
        rect.setTitle(title || "")
        rect.setX(x)
        rect.setY(y)
        rect.setWidth(width)
        rect.setHeight(height)
        this.objects.set(rect.id, rect)
        return rect
    }


    public renderer() {
        this.data.Date = Math.floor(Date.now() / 1000)
        this.canvas.style.pointerEvents = this.hasElement ? "" : "none"
        this.objects.forEach((option) => {
            const state = option.state
            this.ctx.lineWidth = 1
            this.ctx.globalAlpha = 1
            this.ctx.globalCompositeOperation = "source-over"
            this.ctx.filter = "none"
            this.ctx.imageSmoothingEnabled = true
            this.ctx.imageSmoothingQuality = "low"
            this.ctx.strokeStyle = "#000000"
            this.ctx.fillStyle = "#000000"
            this.ctx.shadowOffsetX = 0
            this.ctx.shadowOffsetY = 0
            this.ctx.shadowBlur = 0
            this.ctx.shadowColor = "rgba(0,0,0,0)"
            this.ctx.lineWidth = 1
            this.ctx.lineCap = "butt"
            this.ctx.lineJoin = "miter"
            this.ctx.miterLimit = 10
            this.ctx.lineDashOffset = 0
            this.ctx.font = "10px sans-serif"
            this.ctx.textAlign = "start"
            this.ctx.textBaseline = "alphabetic"
            this.ctx.direction = "ltr"
            this.ctx.fontKerning = "auto"
            // this.ctx.fontStretch = "normal"
            // this.ctx.fontVariantCaps = "normal"
            // this.ctx.letterSpacing = "0px"
            // this.ctx.textRendering = "auto"
            // this.ctx.wordSpacing = "0px"

            this.ctx.font = `${option.font.size}px ${option.font.fontName}`
            this.ctx.lineWidth = 1
            let x = option.x
            let y = option.y

            let matchLabel = option.matchLabel

            option.matchKey.forEach(property => {
                let newTitle = matchLabel
                const matchReg = new RegExp("\\{\\{(.*?)" + <string>property + "(.*?)\\}\\}", "m")
                const regObj = matchReg.exec(newTitle)
                if(regObj) {
                    option.title = newTitle.replace(regObj[0], option.bindObject[property])
                } else {
                    option.title = newTitle.replace(<string>property, property + ":" + option.bindObject[property])
                }
                matchLabel = option.title
            })
            let textMetrics = this.ctx.measureText(option.title)
            let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
            textHeight += textHeight / 2
            if(option.parent) {
                x += option.parent.x
                y += option.parent.type === "rect" ? option.parent.y + 20 : option.parent.y
            }



            switch (option.type) {
                case "rect":
                    this.ctx.beginPath()

                    this.ctx.lineJoin = "round"
                    this.ctx.strokeStyle = "#3e5d96"
                    this.ctx.roundRect(option.x, option.y, option.width, option.height, 4)


                    this.ctx.stroke()
                    if(state === 1) this.ctx.fillStyle = option.backgroundColor
                    if(state === 2) this.ctx.fillStyle = option.hoverBackgroundColor
                    if(state === 3) this.ctx.fillStyle = option.backgroundColor
                    this.ctx.fill()

                    this.ctx.closePath()

                    this.ctx.beginPath()

                    this.ctx.fillStyle = "#3e5d96"

                    this.ctx.roundRect(option.x, option.y, option.width, 20, 4)
                    this.ctx.fill()

                    this.ctx.closePath()


                    if(option.title) {
                        this.ctx.beginPath()
                        this.ctx.fillStyle = "#ffffff"
                        this.ctx.font = "12px serif"
                        this.ctx.fillText(option.title, option.x + 10, option.y + option.font.size, option.bounds.width)
                        this.ctx.closePath()
                    }
                    break
                case "button":
                    this.ctx.beginPath()
                    if(option.width === 0) option.setWidth(textMetrics.width + 15)
                    if(state === 1) this.ctx.fillStyle = option.backgroundColor
                    if(state === 2) this.ctx.fillStyle = option.hoverBackgroundColor
                    if(state === 3) this.ctx.fillStyle = option.backgroundColor
                    this.ctx.lineJoin = "round"

                    this.ctx.fillRect(x, y, option.width, option.height)
                    this.ctx.fillStyle = "#ffffff"
                    this.ctx.fillText(option.title, x + (option.width / 2) - (textMetrics.width / 2), y + textHeight, option.width)
                    this.ctx.closePath()
                    break
                case "label":
                    this.ctx.beginPath()
                    this.ctx.font = `${option.font.size}px ${option.font.fontName}`
                    if(option.width === 0) option.setWidth(textMetrics.width + 15)

                    if(state === 1) this.ctx.fillStyle = option.backgroundColor
                    if(state === 2) this.ctx.fillStyle = option.hoverBackgroundColor
                    if(state === 3) this.ctx.fillStyle = option.backgroundColor
                    this.ctx.lineJoin = "round"

                    this.ctx.fillRect(x, y, option.width, option.height)
                    this.ctx.fillStyle = "#ffffff"
                    this.ctx.fillText(option.title, x + (option.width / 2) - (textMetrics.width / 2), y + textHeight, option.width)
                    this.ctx.closePath()
                    break
                case "checkbox":
                    this.ctx.beginPath()
                    if(state === 1) this.ctx.fillStyle = option.backgroundColor
                    if(state === 2) this.ctx.fillStyle = option.hoverBackgroundColor
                    if(state === 3) this.ctx.fillStyle = option.backgroundColor
                    // this.ctx.fillRect(x, y, option.width, option.height)

                    this.ctx.strokeStyle = "#3e5d96"
                    this.ctx.roundRect(x, y, option.width, option.height, 4)
                    this.ctx.stroke()
                    this.ctx.fill()
                    this.ctx.closePath()


                    if(option.value) {
                        this.ctx.beginPath()

                        this.ctx.strokeStyle = "#4c7ddc"
                        this.ctx.lineWidth = 2

                        this.ctx.moveTo(x + option.width * 0.2, y + option.width * 0.5)

                        this.ctx.lineTo(x + option.width * 0.44, y + option.width * (1 - 0.133))
                        this.ctx.lineTo(x + option.width * (1 - 0.22), y + option.width * (0.22))


                        this.ctx.stroke()

                        this.ctx.closePath()

                    }

                    if(option.title) {
                        this.ctx.beginPath()

                        this.ctx.fillStyle = "#fff"
                        this.ctx.fillText(option.title, x + option.width + 5, y + textHeight)

                        this.ctx.closePath()
                    }
                    break
                case "slider":
                    if(option.value > 100) option.value = 100
                    let sliderValueWidth = (option.width - 20) * (<number>option.value / 100)

                    x += 10


                    this.ctx.beginPath()

                    this.ctx.fillStyle = "#3e5d96"
                    this.ctx.roundRect(x, y + 7.5, sliderValueWidth, 5, 2)
                    this.ctx.stroke()
                    this.ctx.fill()

                    this.ctx.closePath()


                    this.ctx.beginPath()

                    this.ctx.strokeStyle = "#3e5d96"
                    this.ctx.roundRect(x, y + 7.5, option.width - 20, 5, 2)
                    this.ctx.stroke()

                    this.ctx.closePath()

                    this.ctx.beginPath()

                    this.ctx.fillStyle = "#ffffff"

                    this.ctx.arc(x + sliderValueWidth, y + 10, 10, 0,2 * Math.PI)
                    this.ctx.stroke()

                    this.ctx.fill()

                    this.ctx.closePath()
                    break
                default:
                    break
            }
        })
    }

    public getHasHover() {
        return this.hasElement;
    }

}

export default UILayer
