import {Euler, PerspectiveCamera, Quaternion, Vector3} from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

class CameraController {
    private readonly camera: PerspectiveCamera;
    private readonly element: HTMLElement;
    private readonly controls: PointerLockControls;
    public globalRotation: Euler;
    constructor(element: HTMLElement ,fov?: number, aspect?: number, near?: number, far?: number) {
        this.element = element
        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.controls = new PointerLockControls(this.camera, element)
        this.globalRotation = new Euler()
        this.init_()
    }


    private init_() {
        this.element.addEventListener('click', () => {
            this.controls.lock()
        })
    }


    /**
     * 获取控制类
     */
    public getControls() {
        return this.controls
    }


    /**
     * 获取相机类
     */
    public getCamera() {
        return this.camera
    }

    /**
     * 设置相机位置
     * @param position
     */
    public setPosition(position: Vector3) {
        this.camera.position.copy(position)
        return this
    }


    /**
     * 获取相机位置
     */
    public getPosition() {
        return this.camera.position.clone()
    }


    public update() {
        const quaternion = new Quaternion();
        quaternion.copy(this.camera.quaternion).normalize();
        this.globalRotation = new Euler().setFromQuaternion(quaternion, 'YXZ');
    }



}


export default CameraController
