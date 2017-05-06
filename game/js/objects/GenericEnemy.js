class GenericEnemy {

    constructor() {

    }

    update() {
        let velx = 0,
            vely = 0;
        switch (Math.round(Math.random() * 3)) {
            case 0:
                velx = this.body.baseVelocity;
                break;
            case 1:
                velx = -this.body.baseVelocity;
                break;
            case 2:
                vely = this.body.baseVelocity;
                break;
            case 3:
                vely = -this.body.baseVelocity;
                break;
        }
        this.body.setVelocity(velx, vely);
    }

}