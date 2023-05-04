import { CoreEngine, ModelGenerate } from "../lib/main"
import {Vector3} from "three";

class GameMain {
    private readonly container: HTMLElement;
    private contentElement: HTMLDivElement;
    private readonly engine: CoreEngine;
    constructor(el: HTMLElement) {
        this.container = el
        this.contentElement = document.createElement('div')
        this.engine = new CoreEngine(this.contentElement)
    }


    public init() {
        this.contentElement.classList.add("fps-engine-frame")
        this.container.appendChild(this.contentElement)
        const mesh = ModelGenerate.plane(10, 10)
        mesh.position.y = -1
        this.engine.addMesh(mesh, true)
        this.engine.start(this.update, this)
    }


    public update() {
        this.engine.camera.setPosition(this.engine.worldPhysics.getPosition())


        if(this.engine.worldPhysics.getPosition().y < -20) {
            this.engine.worldPhysics.resetPosition(new Vector3())
        }
    }


}


export default GameMain
