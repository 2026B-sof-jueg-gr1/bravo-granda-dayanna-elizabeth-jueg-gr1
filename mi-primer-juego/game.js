// Configuración del juego con Phaser 3
const WORLD_W = 2400; // el mundo es más ancho que la pantalla: la cámara lo recorre
const WORLD_H = 600;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let platforms;
let coins;
let goal;
let cursors;
let shiftKey;
let ojos = [];       // ojos de la pelota (blanco + pupila)
let mirada = 1;      // hacia dónde mira la pelota (1 = derecha, -1 = izquierda)
let score = 0;
let totalMonedas = 0;
let scoreText;
let ganado = false;

const game = new Phaser.Game(config);

// Carga de recursos
function preload() {
    // Imagen para las plataformas
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/block.png');
}

// Creación de la escena
function create() {
    // Reinicia el estado (por si la escena se reinicia al ganar)
    score = 0;
    ganado = false;
    mirada = 1;
    ojos = [];

    // Fondo de cielo azul
    this.cameras.main.setBackgroundColor('#87ceeb');

    // Límites del mundo: la física y la cámara ya no se detienen en 800px
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    crearTexturas(this);
    crearFondo(this);

    // Grupo de plataformas estáticas
    platforms = this.physics.add.staticGroup();

    // Suelo: bloque ancho que cubre todo el mundo
    platforms.create(WORLD_W / 2, 584, 'platform').setScale(WORLD_W / 32, 1).setTint(0x4caf50).refreshBody();

    // Plataformas flotantes [x, y, escala ancho, escala alto]
    const plataformas = [
        [500, 450, 6, 0.5], [700, 330, 4, 0.5], [350, 230, 4, 0.5], [120, 150, 3, 0.5],
        [1000, 450, 5, 0.5], [1250, 330, 4, 0.5], [1500, 220, 4, 0.5], [1750, 330, 4, 0.5],
        [2000, 420, 5, 0.5], [2200, 300, 4, 0.5]
    ];
    plataformas.forEach(([x, y, sx, sy]) => {
        platforms.create(x, y, 'platform').setScale(sx, sy).setTint(0x4caf50).refreshBody();
    });

    // Monedas: tres sobre cada plataforma y una fila en el suelo
    coins = this.physics.add.staticGroup();
    plataformas.forEach(([x, y]) => {
        for (let i = -1; i <= 1; i++) {
            coins.create(x + i * 40, y - 40, 'moneda');
        }
    });
    for (let x = 300; x < 2300; x += 400) {
        coins.create(x, 535, 'moneda');
    }
    totalMonedas = coins.getLength();

    // Jugador (pelota) con físicas y rebote alto
    player = this.physics.add.sprite(100, 400, 'ball');
    player.setCircle(16);
    player.setBounce(0.7);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(240, 500);
    player.setDragX(900);

    // Ojos: blancos y pupilas que siguen a la pelota
    ojos = [-6, 6].map(dx => ({
        dx: dx,
        blanco: this.add.image(0, 0, 'ojo').setDepth(2),
        pupila: this.add.image(0, 0, 'pupila').setDepth(3)
    }));
    // Parpadeo cada cierto tiempo
    this.time.addEvent({ delay: 2500, loop: true, callback: parpadear, callbackScope: this });

    // Colisiones y recogida de monedas
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, coins, recogerMoneda, null, this);

    // Meta al final del camino: poste, bandera y zona de llegada
    this.add.rectangle(2330, 508, 6, 120, 0x555555).setDepth(1);
    this.add.triangle(2355, 452, 0, 0, 40, 15, 0, 30, 0xff3b3b).setDepth(1);
    goal = this.add.zone(2330, 480, 60, 200);
    this.physics.add.existing(goal, true);
    this.physics.add.overlap(player, goal, ganar, null, this);

    // La cámara sigue al jugador con un suavizado
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Controles: flechas para moverse y saltar, Shift para correr
    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Marcador y ayuda en pantalla (fijos, no se mueven con la cámara)
    scoreText = this.add.text(16, 16, '', {
        fontFamily: 'Arial', fontSize: '22px', color: '#ffffff', stroke: '#1b5e20', strokeThickness: 5
    }).setScrollFactor(0).setDepth(10);
    actualizarMarcador();

    this.add.text(16, 560, 'Flechas: moverse  ·  ↑: saltar  ·  Shift: correr', {
        fontFamily: 'Arial', fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(10);
}

// Bucle de actualización (se ejecuta en cada frame)
function update(time, delta) {
    // Al ganar, la pelota se queda quieta
    if (ganado) {
        player.setAccelerationX(0);
        return;
    }

    // Correr: mantén Shift para ir más rápido
    const corriendo = shiftKey.isDown;
    player.setMaxVelocity(corriendo ? 420 : 240, 500);
    const aceleracion = corriendo ? 900 : 600;

    // Movimiento horizontal fluido
    if (cursors.left.isDown) {
        player.setAccelerationX(-aceleracion);
    } else if (cursors.right.isDown) {
        player.setAccelerationX(aceleracion);
    } else {
        player.setAccelerationX(0);
    }

    // Salto solo cuando el jugador toca el suelo o una plataforma
    const enSuelo = player.body.blocked.down || player.body.touching.down;
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && enSuelo) {
        player.setVelocityY(-380);
    }

    // La pelota rueda según su velocidad horizontal
    const vx = player.body.velocity.x;
    player.rotation += (vx * delta / 1000) / 16;
    if (Math.abs(vx) > 10) {
        mirada = Math.sign(vx);
    }

    // Ojos: siguen a la pelota y miran hacia donde va
    const mirarY = Phaser.Math.Clamp(player.body.velocity.y / 400, -1, 1);
    ojos.forEach(o => {
        o.blanco.setPosition(player.x + o.dx, player.y - 4);
        o.pupila.setPosition(o.blanco.x + mirada * 2.5, o.blanco.y + mirarY * 2);
    });
}

// Crea las texturas que se dibujan por código
function crearTexturas(escena) {
    const g = escena.make.graphics({ x: 0, y: 0, add: false });

    // Pelota roja con brillo y una mancha (la mancha se ve al rodar)
    g.fillStyle(0xff3b3b, 1);
    g.fillCircle(16, 16, 16);
    g.fillStyle(0xb71c1c, 1);
    g.fillCircle(22, 22, 4);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(11, 11, 4);
    g.generateTexture('ball', 32, 32);
    g.clear();

    // Nube: varios círculos blancos unidos
    g.fillStyle(0xffffff, 1);
    g.fillCircle(35, 45, 25);
    g.fillCircle(65, 32, 30);
    g.fillCircle(96, 45, 24);
    g.fillRect(35, 45, 61, 25);
    g.generateTexture('nube', 130, 70);
    g.clear();

    // Ojo blanco y pupila
    g.fillStyle(0xffffff, 1);
    g.fillCircle(7, 7, 7);
    g.generateTexture('ojo', 14, 14);
    g.clear();

    g.fillStyle(0x222222, 1);
    g.fillCircle(3.5, 3.5, 3.5);
    g.generateTexture('pupila', 7, 7);
    g.clear();

    // Moneda dorada
    g.fillStyle(0xffd700, 1);
    g.fillCircle(10, 10, 10);
    g.fillStyle(0xfff4a3, 1);
    g.fillCircle(7, 7, 3);
    g.generateTexture('moneda', 20, 20);
    g.clear();

    // Colina verde (dibujada desde su base)
    g.fillStyle(0x5cb85c, 1);
    g.fillEllipse(150, 150, 300, 200);
    g.generateTexture('colina', 300, 150);
    g.clear();

    // Sol amarillo
    g.fillStyle(0xffe066, 1);
    g.fillCircle(60, 60, 50);
    g.generateTexture('sol', 120, 120);

    g.destroy();
}

// Fondo: sol, colinas y nubes con movimiento
function crearFondo(escena) {
    // Sol fijo en la esquina (no se mueve con la cámara)
    escena.add.image(120, 90, 'sol').setScrollFactor(0).setDepth(-3);

    // Colinas de fondo con efecto de profundidad (se mueven más lento que el jugador)
    for (let x = 0; x < WORLD_W + 300; x += 300) {
        escena.add.image(x + Phaser.Math.Between(-60, 60), WORLD_H, 'colina')
            .setOrigin(0.5, 1)
            .setScale(Phaser.Math.FloatBetween(0.8, 1.4))
            .setScrollFactor(0.6)
            .setDepth(-2);
    }

    // Nubes que flotan de un lado a otro
    for (let i = 0; i < 18; i++) {
        const nube = escena.add.image(
            Phaser.Math.Between(0, WORLD_W),
            Phaser.Math.Between(40, 240),
            'nube'
        ).setScale(Phaser.Math.FloatBetween(0.6, 1.3))
         .setAlpha(0.95)
         .setScrollFactor(0.4)
         .setDepth(-1);

        escena.tweens.add({
            targets: nube,
            x: nube.x + Phaser.Math.Between(60, 140),
            duration: Phaser.Math.Between(6000, 10000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

// Parpadeo: aplasta los ojos un momento
function parpadear() {
    const partes = ojos.flatMap(o => [o.blanco, o.pupila]);
    this.tweens.add({ targets: partes, scaleY: 0.1, yoyo: true, duration: 80 });
}

// Al tocar una moneda: desaparece y suma puntos
function recogerMoneda(jugador, moneda) {
    moneda.disableBody(true, true);
    score++;
    actualizarMarcador();
}

// Al llegar a la meta: mensaje y reinicio del nivel
function ganar() {
    if (ganado) return;
    ganado = true;

    this.add.text(400, 300, '¡Llegaste a la meta!', {
        fontFamily: 'Arial', fontSize: '40px', color: '#ffffff', stroke: '#1b5e20', strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

    this.time.delayedCall(3000, () => this.scene.restart());
}

function actualizarMarcador() {
    scoreText.setText(`Monedas: ${score} / ${totalMonedas}`);
}
