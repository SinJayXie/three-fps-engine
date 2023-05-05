使用方法

``` typescript
import { CoreEngine, ModelGenerate, THREE } from "three-fps-engine"

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

        this.engine.camera.setFov(45)
        setTimeout(() => {
            this.engine.camera.setAspect(this.engine.getSize().height / this.engine.getSize().width)
            this.engine.start(this.update, this)
        }, 10)
    }


    public update() {
        this.engine.camera.setPosition(this.engine.worldPhysics.getPosition())


        if(this.engine.worldPhysics.getPosition().y < -20) {
            this.engine.worldPhysics.resetPosition(new THREE.Vector3())
        }
    }


}


export default GameMain
