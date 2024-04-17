import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default class Dalthon {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.hdrTextureUrl = new URL('../assets/MR_INT-003_Kitchen_Pierre.hdr', import.meta.url);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);

        this.renderer.domElement.id = 'dalthon-canvas';
        document.getElementById('dalton').appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 0, 8);
        this.orbit.update();

        this.scene.background = new THREE.Color(0xf5f5f5);

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.8;

        this.loader = new RGBELoader();
        this.loader.load(this.hdrTextureUrl, this.onModelLoad.bind(this));

        this.animate = this.animate.bind(this);
        this.renderer.setAnimationLoop(this.animate);
    }

    onModelLoad(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;

        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0000ff,
            metalness: 1,
            roughness: 0.5
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
    }
}


let links = document.querySelectorAll(".anchours > a");
let name = document.querySelector(".menu > span");

let names = ["Dalthon", "Thamson", "Rutherford", "Bohr"];



let selected = localStorage.getItem("selected") || 0;
links[selected].style = "background-color: green;";


//#region links-change
Array.from(links).map((link, i) => {
  link.addEventListener('click', (event) => {
      name.innerHTML = `${names[i]}`;
      link.style.backgroundColor = "green";
      Array.from(links).map((c, ci) => {
          if (i != ci) {
              c.style = "background-color: var(--container-border);";
          } else {
              c.style = "background-color: green;";
              localStorage.setItem("selected", i);
          }
      });
  });
});
//#endregion

//#region Thamson
class Thamson {
    constructor() {
        this.canvas = document.querySelector("#thamson-canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = 600;
        this.canvas.height = 600;

        this.min = this.canvas.width / 2 - 210;
        this.max = this.canvas.height / 2 + 210;
        this.count = 4;

        this.protons = [];
        this.elekrons = [];

        this.possitive = new URL('../img/possitive.png',import.meta.url).pathname;
        this.negative = new URL('../img/negative.png',import.meta.url).pathname;

        this.updatePosition();
        this.create();
        this.animate();
    }

    randomPoint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    updatePosition() {
        for (let i = 0; i <= this.count; i++) {
            this.x = this.randomPoint(this.min, this.max);
            this.y = this.randomPoint(this.min, this.max);

            this.protons.push([this.x, this.y]);
        }
        for (let i = 0; i <= this.count; i++) {
            this.x = this.randomPoint(this.min, this.max);
            this.y = this.randomPoint(this.min, this.max);

            this.elekrons.push([this.x, this.y]);
        }
    }

    create() {
        this.poss = new Image()
        this.poss.src = this.possitive;
        this.poss.onload = () => {
            this.protons.forEach(e => {
                this.context.drawImage(this.poss, e[0], e[1]);
            });
        }
        this.neg = new Image()
        this.neg.src = this.negative;
        this.neg.onload = () => {
            this.elekrons.forEach(e => {
                this.context.drawImage(this.neg, e[0], e[1]);
            });
        }
    }

    animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.protons.forEach(e => {
            const shakeAmount = 5;
            const dx = Math.random() * shakeAmount - shakeAmount / 2;
            const dy = Math.random() * shakeAmount - shakeAmount / 2;

            this.context.drawImage(this.poss, e[0] + dx, e[1] + dy);
        });

        this.elekrons.forEach(e => {
            const shakeAmount = 5;
            const dx = Math.random() * shakeAmount - shakeAmount / 2;
            const dy = Math.random() * shakeAmount - shakeAmount / 2;

            this.context.drawImage(this.neg, e[0] + dx, e[1] + dy);
        });

        requestAnimationFrame(() => {
            this.animate();
        });
    }
}
//#endregion

//#region Rutherford
class RutherfordAtom {
    constructor() {
      this.canvas = document.querySelector("#rutherford-canvas");
      this.context = this.canvas.getContext("2d");
  
      this.canvas.width = 600;
      this.canvas.height = 600;
  
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
      this.coreRadius = 115;
      this.protonRadius = 10;
  
      this.protonImage = new Image();
      this.protonImage.src = new URL('../img/proton.png',import.meta.url).pathname;
  
      this.protonPositions = [
        [this.centerX - 30, this.centerY - 10],
        [this.centerX + 20, this.centerY + 30],
        [this.centerX + 40, this.centerY - 20]
      ];
  
      this.electron = new Image();
      this.electron.src = new URL("../img/electron.png",import.meta.url).pathname;

  
      this.electrons = [
        [this.centerX - 97, this.centerY - 136],
        [this.centerX + 87, this.centerY + 123],
        [this.centerX - 123, this.centerY + 140]
      ];
  
      this.animate();
    }
  
    drawCore() {
      this.context.beginPath();
      this.context.arc(
        this.centerX,
        this.centerY,
        this.coreRadius,
        0,
        2 * Math.PI,
        false
      );
      this.context.fillStyle = "yellow";
      this.context.fill();
      this.context.closePath();
    }
  
    drawProton(x, y) {
      const shakeAmount = 5;
      const dx = Math.random() * shakeAmount - shakeAmount / 2;
      const dy = Math.random() * shakeAmount - shakeAmount / 2;
  
      this.context.drawImage(
        this.protonImage,
        x + dx - this.protonRadius,
        y + dy - this.protonRadius,
        this.protonRadius * 2,
        this.protonRadius * 2
      );
    }
  
    drawNeutron(x, y) {
      const shakeAmount = 5;
      const dx = Math.random() * shakeAmount - shakeAmount / 2;
      const dy = Math.random() * shakeAmount - shakeAmount / 2;
  
      this.context.drawImage(
        this.electron,
        x + dx - this.protonRadius,
        y + dy - this.protonRadius,
        this.protonRadius * 2,
        this.protonRadius * 2
      );
    }
  
    animate() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.drawCore();
  
      for (const position of this.protonPositions) {
        this.drawProton(position[0], position[1]);
      }
  
      for (const position of this.electrons) {
        this.drawNeutron(position[0], position[1]);
      }
  
      requestAnimationFrame(() => {
        this.animate();
      });
    }
  }
  
//#endregion




let rutherfordAtom = new RutherfordAtom();
let thamson = new Thamson();
let dalthon = new Dalthon(window.innerWidth, window.innerHeight);
