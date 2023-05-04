import {PerspectiveCamera, WebGLRenderer} from "three";

class RenderRect {
    private renderer: WebGLRenderer;
    private container: HTMLElement;
    private rect: DOMRect;
    private camera: PerspectiveCamera;
    constructor(el: HTMLElement, renderer: WebGLRenderer, camera: PerspectiveCamera) {
        this.renderer = renderer
        this.container = el
        this.camera = camera;
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
    }

    private listeningResize() {
        window.addEventListener('resize', () => {
            this.updateSize()
        })
    }
}


export default RenderRect
