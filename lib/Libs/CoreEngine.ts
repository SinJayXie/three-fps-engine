import SceneController from "./SceneController";
import {Group, Object3D, sRGBEncoding, WebGLRenderer} from "three";
import CameraController from "./CameraController";
import RenderRect from "./RenderRect";
import WorldPhysics from "./WorldPhysics";
import KeyState from "./KeyState";

class CoreEngine {
    public scene: SceneController;
    public readonly camera: CameraController;
    public worldPhysics: WorldPhysics;
    public keyState: KeyState;

    private readonly renderer: WebGLRenderer;
    private readonly container: HTMLElement;
    private callback: (engine: CoreEngine) => void;
    private isStart: boolean;
    private readonly renderRect: RenderRect;
    private readonly models: Group;


    constructor(bindElement: HTMLElement) {
        this.container = bindElement
        this.scene = new SceneController()
        this.renderer = new WebGLRenderer()
        this.camera = new CameraController(this.container, 45)
        this.renderRect = new RenderRect(bindElement, this.renderer, this.camera.getCamera())
        this.keyState = new KeyState()
        this.worldPhysics = new WorldPhysics(this.keyState, this.scene.getScene(), this.camera.getCamera())
        this.models = new Group()
        this.isStart = false
        this.callback = function (){}
        this.initEngine()
    }


    /**
     * 获取按键类
     */
    public getKeyState() {
        return this.keyState
    }

    public start(callback: () => void, this_: any) {
        if(this.isStart) return false
        this.callback = callback
        this.isStart = true
        this.container.appendChild(this.renderer.domElement)
        this.renderRect.updateSize()
        this.worldPhysics.createOctree()
        this._loop(this_)
        return true
    }


    public getSize() {
        return this.renderRect.getSize()
    }

    public addMesh(objects: Object3D, isCollider?: Boolean) {
        if(isCollider) {
            this.worldPhysics.add(objects)
        } else {
            this.models.add(objects)
        }
    }

    private _loop(this_: any) {
        this.renderer.setAnimationLoop(() => {
            this.worldPhysics.update()
            this.camera.update()
            this.callback.call(this_, this)
            this.render()
            this._loop(this_)
        })
    }


    private initEngine() {
        this.renderer.outputEncoding = sRGBEncoding  // 切换渲染输出格式
        this.scene.add(this.models)
    }


    /**
     * 获取当前场景
     */
    public getCurrentScene() {
        return this.scene
    }

    /**
     * 切换场景
     * @param scene
     */
    public switchScene(scene: SceneController) {
        this.scene = scene
    }


    private render() {
        this.renderer.render(this.scene.getScene(), this.camera.getCamera())
    }

}


export default CoreEngine
