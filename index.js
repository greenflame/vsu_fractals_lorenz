const $ = require('jquery');
const THREE = require('three');
require('three/examples/js/controls/OrbitControls.js')(THREE);


let scene, camera, renderer, controls, model;

let rho, sigma, betta;
let dt, it;
let x0, y0, z0;


$(function () {

    init();
    bind();

    reset();
    update();

    animate();
});

function init() {

    let w = 800, h = 600;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    $('.canvas').append(renderer.domElement);

    camera.position.z = 5;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function bind() {
    $('#update').click(update);
    $('#reset').click(function () { reset(); update(); });
}

function reset() {
    rho = 28;
    sigma = -6;
    betta = 1;
    dt = 0.015;
    it = 1000;
    x0 = 0;
    y0 = 1;
    z0 = 10;

    $('#rho').val(rho);
    $('#sigma').val(sigma);
    $('#betta').val(betta);
    $('#dt').val(dt);
    $('#it').val(it);
    $('#x0').val(x0);
    $('#y0').val(y0);
    $('#z0').val(z0);
}

function update() {

    rho = parseFloat($('#rho').val());
    sigma = parseFloat($('#sigma').val());
    betta = parseFloat($('#betta').val());
    dt = parseFloat($('#dt').val());
    it = parseFloat($('#it').val());
    x0 = parseFloat($('#x0').val());
    y0 = parseFloat($('#y0').val());
    z0 = parseFloat($('#z0').val());

    var geometry = new THREE.Geometry();

    for (var i = 0; i < it; i++) {
        x1 = x0 + dt * sigma * (x0 - y0);
        y1 = y0 + dt * (-x0 * z0 + rho * x0 - y0);
        z1 = z0 + dt * (x0 * y0 - betta * z0);

        geometry.vertices.push(new THREE.Vector3(x1, y1, z1));

        x0 = x1;
        y0 = y1;
        z0 = z1;
    }

    geometry.normalize();

    if (model) {
        scene.remove(model);
    }

    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    model = new THREE.Line(geometry, material);
    scene.add(model);
}

function animate() {
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
