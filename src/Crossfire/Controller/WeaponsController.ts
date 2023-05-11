import {Clock, MathUtils, Object3D, Vector2, Vector3} from "three";
import CameraController from "../../../lib/Libs/CameraController";

class WeaponsController {
    private recoil: Vector2;
    private recoilRate: Vector2;
    private maxRecoil: Vector2;
    private restoreRecoilRate: Vector2;
    private lastFireTime: number;
    private callback: () => void;
    private clock: Clock;
    constructor() {
        this.recoil = new Vector2()
        this.recoilRate = new Vector2(0.35, 2)
        this.restoreRecoilRate = new Vector2(2, 10)
        this.maxRecoil = new Vector2(6, 8)
        this.lastFireTime = Date.now()
        this.clock = new Clock()
        this.callback = () => {}
    }


    public setFireCallBack(callback: (weapons: WeaponsController) => void, this_: any) {
        this.callback = () => {
            callback.call(this_, this)
        }
    }

    public update() {
        this.restoreRecoil()
    }

    public getRecoil() {
        return this.recoil
    }


    public setMeshRecoil(obj: Object3D, camera: CameraController) {
        const xDeg = MathUtils.radToDeg(camera.globalRotation.y)
        let angle = 0.003
        if(xDeg <= 90 && xDeg > 0) {
            angle = 0.003
        } else if(xDeg > 90 && xDeg < 180) {
            angle = -0.003
        } else if(xDeg > -180 && xDeg < -90) {
            angle = -0.003
        } else if(xDeg < 0 && xDeg > -90) {
            angle = 0.003
        }
        obj.setRotationFromAxisAngle(new Vector3(this.recoil.y, this.recoil.x, 0), angle)
    }


    public fire() {
        const fireRate = 100
        // this.engine.camera.lookAt(new Vector3(0, 0, -5))
        if(Date.now() - this.lastFireTime > fireRate) {
            this.lastFireTime = Date.now()
            this.callback()
            this.addRecoil()
        }
    }

    private addRecoil() {
        this.recoil.x = MathUtils.clamp(this.recoilRate.x + MathUtils.randFloat(-1, 1) * this.recoilRate.x, -this.maxRecoil.x, this.maxRecoil.x)
        this.recoil.y = MathUtils.clamp(this.recoil.y + this.recoilRate.y, 0, this.maxRecoil.y)
    }



    private restoreRecoil() {
        const deltaTime = this.clock.getDelta()
        this.recoil.x = this.moveTowards(this.recoil.x, 0, deltaTime * this.restoreRecoilRate.x)
        this.recoil.y = this.moveTowards(this.recoil.y, 0, deltaTime * this.restoreRecoilRate.y)

    }



    private moveTowards(current: number, target: number, maxDelta: number) {
        const mathSign = function (f: number) {
            return f >= 0 ? 1 : -1
        }
        if(Math.abs(target - current) <= maxDelta) return target
        return current + mathSign(target - current) * maxDelta
    }
}


export default WeaponsController
