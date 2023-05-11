import {Vector2} from "three";
import UILayer from "./UILayer";

class CanvasRender {
    private readonly canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private rect: DOMRect;
    private readonly images: Map<string, CanvasImageSource>;
    public UILayer: UILayer;
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
        this.rect = this.canvas.getBoundingClientRect()
        this.images = new Map()
        this.UILayer = new UILayer(this)
    }

    public init(rect: DOMRect, parent: HTMLElement) {
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
        this.canvas.width = rect.width
        this.canvas.height = rect.height
        this.canvas.style.pointerEvents = 'none'
        this.canvas.style.position = 'absolute'
        this.canvas.style.left = rect.left + 'px'
        this.canvas.style.top = rect.top + 'px'
        this.canvas.style.zIndex = '1000'
        this.rect = rect


        parent.appendChild(this.canvas)
    }

    public getCanvas() {
        return this.canvas
    }

    public getContext() {
        return <CanvasRenderingContext2D>this.canvas.getContext("2d")
    }

    public update() {
        this.UILayer.renderer()
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public getRect() {
        return this.rect
    }

    public drawText(text: string, x: number, y: number, fontSize?: number, color?: string) {
        this.ctx.beginPath()

        this.ctx.font = `${fontSize || 12}px Arial`
        this.ctx.textAlign = 'start'
        this.ctx.textBaseline = 'top'
        this.ctx.fillStyle = color || '#000000'
        this.ctx.fillText(text, x, y)

        this.ctx.closePath()
    }

    public drawLine(start_x: number, start_y: number, end_x: number, end_y: number, color?: string, lineWidth?: number) {
        this.ctx.beginPath()

        this.ctx.moveTo(start_x, start_y)
        this.ctx.lineTo(end_x, end_y)

        this.ctx.strokeStyle = color || '#ffffff'
        this.ctx.lineWidth = lineWidth || 1

        this.ctx.stroke()

        this.ctx.closePath()
    }

    public drawBox(x: number, y: number, width: number, height: number, color?: string, lineWidth?: number) {
        const a = new Vector2(x, y)
        const b = new Vector2(x + width, y)
        const c = new Vector2(x, y + height)
        const d = new Vector2(x + width, y + height)
        this.drawLine(a.x, a.y, b.x, b.y, color, lineWidth)
        this.drawLine(b.x, b.y, d.x, d.y, color, lineWidth)
        this.drawLine(c.x, c.y, d.x, d.y, color, lineWidth)
        this.drawLine(c.x, c.y, a.x, a.y, color, lineWidth)
    }


    public loadImage(name: string, url: string) {
        if(name && url) {
            const img = document.createElement('img')
            img.src = url
            this.images.set(name, img)
            return true
        } else {
            return false
        }
    }


    public drawImage(imageName: string, x: number, y: number, width: number, height: number) {
        if(this.images.has(imageName)) {
            const image = <CanvasImageSource>this.images.get(imageName)
            this.ctx.beginPath()
            this.ctx.drawImage(image, x, y, width, height)
            this.ctx.closePath()
            return true
        } else {
            return false
        }
    }



    public drawRect() {

    }



}

export default CanvasRender
