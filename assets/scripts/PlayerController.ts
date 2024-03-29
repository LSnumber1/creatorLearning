import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Animation} from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Animation)
    BodyAnim : Animation = null;
 
    private _startJump = false;
    private _jumpStep = 0;
    private _curJumpTime = 0;
    private _jumpTime = 0.1;
    private _curJumpSpeed = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();
    private _curMoveIndex: number = 0;

    start() { 
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    reset() {
        this._curMoveIndex = 0;
    }   

    setInputActive(active: boolean) {
        if(active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    update(deltaTime: number) {
        if(this._startJump) {
            this._curJumpTime += deltaTime;
            if(this._curJumpTime > this._jumpTime) {
                // jump end
                this.node.setPosition(this._targetPos);
                this._startJump = false;
                this.onOnceJumpEnd();  
            } else {
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }

    onMouseUp(event: EventMouse) {
        if(event.getButton() == 1) {
            // 1: left button
            this.jumpByStep(1);
        } else if(event.getButton() == 2) {
            // 2: right button
            this.jumpByStep(2);
        }
    }

    jumpByStep(step: number) {
        if(this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;

        const clipName = step == 1 ? 'oneStep' : 'twoStep';
        const state = this.BodyAnim.getState(clipName);
        this._jumpTime = state.duration;
        

        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));
       
        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('oneStep');
            } else if (step === 2) {
                this.BodyAnim.play('twoStep');
            }
        }

        this._curMoveIndex += step;
    } 

    onOnceJumpEnd() {
        this.node.emit('JumpEnd', this._curMoveIndex);
    }
}

