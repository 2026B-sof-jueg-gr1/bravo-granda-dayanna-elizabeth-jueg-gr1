// Configuración del juego con Phaser 3
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
let cursors;

const game = new Phaser.Game(config);

// Carga de recursos
function preload() {
    // Imagen del jugador
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/block.png');
    // Imagen para las plataformas
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/block.png');
}

// Creación de la escena
function create() {
    // Fondo de cielo azul, como en Bouncy Ball
    this.cameras.main.setBackgroundColor('#87ceeb');

    // Pelota redonda generada por código (el bloque cuadrado no se ve como pelota)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff3b3b, 1);
    graphics.fillCircle(16, 16, 16);
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(11, 11, 4);
    graphics.generateTexture('ball', 32, 32);
    graphics.destroy();

    // Grupo de plataformas estáticas
    platforms = this.physics.add.staticGroup();

    // Suelo: bloque ancho en la parte inferior (verde, como el pasto)
    platforms.create(400, 584, 'platform').setScale(25, 1).setTint(0x4caf50).refreshBody();

    // Plataformas flotantes
    platforms.create(600, 450, 'platform').setScale(6, 0.5).setTint(0x4caf50).refreshBody();
    platforms.create(200, 350, 'platform').setScale(6, 0.5).setTint(0x4caf50).refreshBody();
    platforms.create(500, 250, 'platform').setScale(4, 0.5).setTint(0x4caf50).refreshBody();
    platforms.create(100, 180, 'platform').setScale(3, 0.5).setTint(0x4caf50).refreshBody();

    // Jugador (pelota) con físicas y rebote alto
    player = this.physics.add.sprite(100, 100, 'ball');
    player.setCircle(16);
    player.setBounce(0.7);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(250, 500);
    player.setDragX(900);

    // Colisiones entre el jugador y las plataformas
    this.physics.add.collider(player, platforms);

    // La cámara sigue al jugador
    this.cameras.main.startFollow(player);

    // Controles del teclado (flechas)
    cursors = this.input.keyboard.createCursorKeys();
}

// Bucle de actualización (se ejecuta en cada frame)
function update() {
    // Movimiento horizontal fluido
    if (cursors.left.isDown) {
        player.setAccelerationX(-600);
    } else if (cursors.right.isDown) {
        player.setAccelerationX(600);
    } else {
        player.setAccelerationX(0);
    }

    // Salto solo cuando el jugador toca el suelo o una plataforma
    const onGround = player.body.blocked.down || player.body.touching.down;
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && onGround) {
        player.setVelocityY(-330);
    }
}
