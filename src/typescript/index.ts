import { Application } from './app';

const app = new Application({});

function animate() {
    requestAnimationFrame(animate);
    app.onUpdate();
}

animate();