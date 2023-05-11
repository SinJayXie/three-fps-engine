import {PerspectiveCamera, WebGLRenderer} from "three";
import CanvasRender from "./CanvasRender";

class RenderRect {
    private renderer: WebGLRenderer;
    private container: HTMLElement;
    private rect: DOMRect;
    private camera: PerspectiveCamera;
    private canvasRenderer: CanvasRender;
    constructor(el: HTMLElement, renderer: WebGLRenderer, camera: PerspectiveCamera, canvasRenderer: CanvasRender) {
        this.renderer = renderer
        this.container = el
        this.camera = camera;
        this.canvasRenderer = canvasRenderer
        this.rect = el.getBoundingClientRect()
        this.updateSize()
        this.listeningResize()
    }

    public getSize() {
        return {
            width: this.rect.width || 0,
            height: this.rect.height || 0
        }
    }


    public updateSize() {
        this.rect = this.container.getBoundingClientRect()
        this.camera.aspect = this.rect.width / this.rect.height
        this.renderer.setSize(this.rect.width, this.rect.height)
        this.canvasRenderer.getCanvas().width = this.rect.width
        this.canvasRenderer.getCanvas().height = this.rect.height
    }

    private listeningResize() {
        window.addEventListener('resize', () => {
            this.updateSize()
        })
    }
}


export default RenderRect
