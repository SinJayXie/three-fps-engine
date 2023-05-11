import SceneController from "./SceneController";
import {Clock, Group, Object3D, sRGBEncoding, WebGLRenderer} from "three";
import CameraController from "./CameraController";
import RenderRect from "./RenderRect";
import WorldPhysics from "./WorldPhysics";
import KeyState from "./KeyState";
import CanvasRender from "./CanvasRender";

class CoreEngine {
    public scene: SceneController;
    public camera: CameraController;
    public worldPhysics: WorldPhysics;
    public keyState: KeyState;

    private readonly renderer: WebGLRenderer;
    private readonly container: HTMLElement;
    private callback: (engine: CoreEngine) => void;
    private isStart: boolean;
    private readonly renderRect: RenderRect;
    private readonly models: Group;
    private readonly clock: Clock;
    private deltaTime: number;
    private readonly drawCanvas: CanvasRender;


    constructor(bindElement: HTMLElement) {
        this.container = bindElement
        this.drawCanvas = new CanvasRender()
        this.scene = new SceneController()
        this.renderer = new WebGLRenderer()
        this.camera = new CameraController(this.container, this, 45)
        this.renderRect = new RenderRect(bindElement, this.renderer, this.camera.getCamera(), this.drawCanvas)
        this.keyState = new KeyState()
        this.worldPhysics = new WorldPhysics(this.keyState, this.scene.getScene(), this.camera.getCamera())
        this.models = new Group()
        this.clock = new Clock()
        this.isStart = false
        this.deltaTime = 0
        this.callback = function (){}
        this.initEngine()
    }

    public getWorldMesh(object: Object3D, filterType?: string[]) {
        const meshList = []
        meshList.push(object)
        object.children.forEach(item => {
            meshList.push(...this.getWorldMesh(item))
        })
        if(filterType) {
            return meshList.filter(item => filterType.includes(item.type))
         } else {
            return meshList
        }
    }


    public getCanvasContent() {
        return this.drawCanvas
    }


    /**
     * 获取按键类
     */
    public getKeyState() {
        return this.keyState
    }

    /**
     * 引擎开始
     * @param callback
     * @param this_
     */
    public start(callback: () => void, this_: any) {
        if(this.isStart) return false
        this.callback = callback
        this.isStart = true
        this.container.appendChild(this.renderer.domElement)
        this.renderRect.updateSize()
        this.worldPhysics.createOctree()
        this.drawCanvas.init(this.container.getBoundingClientRect(), this.container)
        this._loop(this_)
        return true
    }

    /**
     * 获取增量时间
     */
    public getDeltaTime() {
        return this.deltaTime
    }


    /**
     * 获取窗口大小
     */
    public getSize() {
        return this.renderRect.getSize()
    }

    /**
     * 添加Mesh到scene
     * @param objects
     * @param isCollider
     */
    public addMesh(objects: Object3D, isCollider?: Boolean) {
        if(isCollider) {
            this.worldPhysics.add(objects)
        } else {
            this.models.add(objects)
        }
    }


    /**
     * 删除Mesh到scene
     * @param objects
     * @param isCollider
     */
    public removeMesh(objects: Object3D, isCollider?: Boolean) {
        if(isCollider) {
            this.worldPhysics.remove(objects)
        } else {
            this.models.remove(objects)
        }
    }

    private _loop(this_: any) {
        this.renderer.setAnimationLoop(() => {
            this.deltaTime = this.clock.getDelta()
            this.worldPhysics.update()
            this.camera.update()
            this.callback.call(this_, this)
            this.render()
            this.drawCanvas.update()

            this._loop(this_)
        })
    }


    /**
     * 初始化引擎配置
     * @private
     */
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
        return this
    }

    /**
     * 切换相机
     * @param camera
     */
    public switchCamera(camera: CameraController) {
        this.camera = camera
        return this
    }


    private render() {
        this.renderer.render(this.scene.getScene(), this.camera.getCamera())
    }

}


export default CoreEngine
