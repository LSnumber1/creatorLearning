import { _decorator, Component, Node, v2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property
    jumpHeight = 0;
    @property
    jumpDuration = 0;
    @property
    maxMoveSpeed = 0;
    @property
    accel = 0; 

    start() {

    }

    update(deltaTime: number) {
        
    }

    setJumpAction() {
        v2(0, this.jumpHeight);
        var jumpUp = moveBy(this.jumpDuration, v2(0, this.jumpHeight)).easing(easeCubicActionOut());
    }

}

