
export interface PhysicsConfigOption {
    moveSpeed: number,
    spaceMoveSpeed: number,
    jumpSpeed: number,
    damping: number,
    gravity: number
}
class PhysicsConfig {
    private readonly config: PhysicsConfigOption;
    constructor() {
        this.config = {
            moveSpeed: 50,
            spaceMoveSpeed: 10,
            jumpSpeed: 10,
            damping: 10,
            gravity: 9.8 * 2
        }
    }

    public getMoveSpeed() {
        return this.config.moveSpeed
    }

    public getSpaceMoveSpeed() {
        return this.config.spaceMoveSpeed
    }

    public getJumpSpeed() {
        return this.config.jumpSpeed
    }

    public getDamping() {
        return this.config.damping
    }

    public getGravity() {
        return this.config.gravity
    }
}

export default PhysicsConfig
