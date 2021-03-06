const $ = require('jquery');
const THREE = require('three');
require('three/examples/js/controls/OrbitControls.js')(THREE);


let scene, camera, renderer, controls, model;

let rho, sigma, betta;
let dt, it;
let x0, y0, z0;

let exw, exh;

let updateAnimation = true;

let colorScheme = {
    background: 'white',
    color1: '#f6f7f8',
    color2: '#3f88c5'
};

$(function () {

    init();
    bind();

    reset();
    update();

    animate();
});

function init() {

    let w = $('.canvas').innerWidth() - 10, h = $('.canvas').innerHeight() - 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(colorScheme.background);

    camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });

    renderer.setSize(w, h);

    $('.canvas').append(renderer.domElement);

    camera.position.z = 3.5;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;

    window.addEventListener('resize', onWindowResize, false);
}

function bind() {
    $('#update').click(update);
    $('#reset').click(function () { reset(); update(); });
    $('#save').click(save);
}

function reset() {
    rho = 28;
    sigma = -6;
    betta = 1;
    dt = 0.01;
    it = 10000;
    x0 = 0;
    y0 = 1;
    z0 = 10;

    exw = 1920 * 2;
    exh = 1080 * 2;

    $('#rho').val(rho);
    $('#sigma').val(sigma);
    $('#betta').val(betta);
    $('#dt').val(dt);
    $('#it').val(it);
    $('#x0').val(x0);
    $('#y0').val(y0);
    $('#z0').val(z0);
    
    $('#exw').val(exw);
    $('#exh').val(exh);
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

    let geometry = new THREE.Geometry();

    let color1 = new THREE.Color(colorScheme.color1);
    let color2 = new THREE.Color(colorScheme.color2);

    for (let i = 0; i < it; i++) {
        x1 = x0 + dt * sigma * (x0 - y0);
        y1 = y0 + dt * (-x0 * z0 + rho * x0 - y0);
        z1 = z0 + dt * (x0 * y0 - betta * z0);

        geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
        geometry.colors.push(color1.clone().lerp(color2, i / it));

        x0 = x1;
        y0 = y1;
        z0 = z1;
    }

    geometry.normalize();

    if (model) {
        scene.remove(model);
    }

    let material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    model = new THREE.Line(geometry, material);
    scene.add(model);
}

function animate() {
    if (updateAnimation) {
        controls.update();
        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

function onWindowResize() {
    let w = $('.canvas').innerWidth() - 10, h = $('.canvas').innerHeight() - 10;

    resize(w, h);
}

function resize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

function save() {
    updateAnimation = false;

    exw = parseInt($('#exw').val());
    xeh = parseInt($('#exh').val());

    resize(exw, exh);
    renderer.render(scene, camera);

    try {
        var strMime = "image/png";
        var imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, "image/octet-stream"), "lorenz.png");
    } catch (e) {
        console.log(e);
    }

    onWindowResize();

    updateAnimation = true;
}

function saveFile(strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}