// ============================================================
// La Travesía de la Pelotita: Misión 1 "El Alma del Juego"
// Todo el arte es procedural (Graphics + generateTexture):
// no depende de imágenes externas.
// ============================================================

const WORLD_H = 600;
const SUELO_TOP = 568;     // y de la superficie del suelo
const META_X = 2400;       // poste de llegada (en todos los biomas)
const ANCHO_NIVEL = 2500;  // largo de los biomas intermedios
const ANCHO_FINAL = 2800;  // largo del último bioma (incluye la Casa del Reencuentro)

// ---------- Avatares ----------
const AVATARES = {
    clasica: {
        nombre: 'Pelota Clásica',
        descripcion: 'Ligera y ágil: rebota alto y responde al instante. Se desvía en las cuestas.',
        textura: 'ball', radio: 16, rebote: 0.7, salto: -420,
        pesoExtra: 0, aceleracion: [600, 900], velMax: [240, 420], friccion: 900, rompe: false
    },
    roca: {
        nombre: 'Esfera de Roca',
        descripcion: 'Pesada y lenta, con mucha inercia. Sube cuestas y rompe bloques frágiles al correr.',
        textura: 'roca', radio: 18, rebote: 0.1, salto: -380,
        pesoExtra: 150, aceleracion: [330, 480], velMax: [170, 260], friccion: 350, rompe: true
    }
};

// ---------- Atuendos (se dibujan sobre la pelota) ----------
const ATUENDOS = {
    ninguno:     { nombre: 'Sin atuendo', descripcion: 'La pelota tal como es.' },
    chullo:      { nombre: 'Chullo andino', descripcion: 'Gorro de lana de colores para las alturas de Quito.' },
    bufanda:     { nombre: 'Bufanda', descripcion: 'Bufanda tejida que abriga el cuello en las mañanas frías.' },
    ruana:       { nombre: 'Ruana', descripcion: 'Poncho de lana con franjas, para el viento del páramo.' },
    sombrero:    { nombre: 'Sombrero de paja toquilla', descripcion: 'Fresco y elegante, para el sol de Guayaquil.' },
    impermeable: { nombre: 'Impermeable', descripcion: 'Capa amarilla para los esteros y la lluvia del manglar.' }
};

// ---------- Biomas ----------
// plataformas: [x, y, bloques de ancho]  ·  moviles: plataformas que van de min a max
// ladrillos: x de bloques frágiles sobre el suelo  ·  zonasLentas: [x, y, ancho, alto] (agua)
const BIOMAS = [
    {
        nombre: 'Quito Colonial',
        descripcion: 'Cuestas empinadas y adoquines bajo un atardecer cálido. Sube las escalinatas con cuidado.',
        tex: 'quito', cielo: [0xff9e5e, 0xffe3b8], viento: 0, resbaladizo: false,
        paleta: { plat: [0xb59f88, 0xd7c7b1, 0x7d6b5a], suelo: [0x9e8b74, 0xc9b79f, 0x6b5b4a] },
        plataformas: [
            [420, 500, 4], [600, 440, 4], [780, 380, 4], [960, 320, 4], [1140, 380, 4], [1320, 440, 4],
            [1520, 400, 4], [1720, 340, 4], [1920, 280, 4], [2120, 360, 5], [2320, 430, 3]
        ],
        moviles: [], zonasLentas: [], ladrillos: [1250, 1980]
    },
    {
        nombre: 'Andes Verdes',
        descripcion: 'Páramo con neblina y ráfagas de viento. La superficie resbala y el aire empuja la pelota.',
        tex: 'andes', cielo: [0xa8dcc0, 0xe9f7ee], viento: 90, resbaladizo: true,
        paleta: { plat: [0x8d8a7e, 0x5fae4e, 0x6d6a60], suelo: [0x7f7b6e, 0x4caf50, 0x5d5a50] },
        plataformas: [
            [400, 470, 3], [600, 400, 3], [800, 330, 3], [1000, 400, 3], [1200, 470, 3],
            [1400, 380, 3], [1600, 310, 3], [1800, 380, 3], [2000, 460, 4], [2220, 380, 3]
        ],
        moviles: [], zonasLentas: [], ladrillos: [880, 1520, 2180]
    },
    {
        nombre: 'Guayaquil Tropical',
        descripcion: 'Sol y calor junto al río. Las plataformas doradas del malecón se mueven: sube a bordo.',
        tex: 'guayaquil', cielo: [0x3fb6f0, 0xbfe9ff], viento: 0, resbaladizo: false,
        paleta: { plat: [0xc98d3c, 0xf2c46d, 0x8a5a14], suelo: [0xd9a35a, 0xf0c27b, 0x8a5a14] },
        plataformas: [
            [350, 470, 4], [700, 420, 3], [1100, 450, 4], [1500, 380, 3], [2050, 420, 4], [2250, 340, 3]
        ],
        moviles: [
            { x: 560, y: 330, tiles: 3, min: 500, max: 700, vel: 60 },
            { x: 1280, y: 300, tiles: 3, min: 1180, max: 1400, vel: 70 },
            { x: 1800, y: 260, tiles: 3, min: 1700, max: 1900, vel: 60 }
        ],
        zonasLentas: [], ladrillos: [820, 1620]
    },
    {
        nombre: 'Costa de Manglar',
        descripcion: 'Raíces, esteros y agua tibia. En los charcos la pelota avanza más lenta.',
        tex: 'manglar', cielo: [0x2c5a4a, 0x8fbf9a], viento: 0, resbaladizo: false,
        paleta: { plat: [0x5d4037, 0x558b2f, 0x3e2723], suelo: [0x4e342e, 0x33691e, 0x2a1d18] },
        plataformas: [
            [380, 490, 3], [600, 430, 3], [820, 490, 3], [1040, 420, 3], [1260, 350, 3],
            [1480, 430, 3], [1700, 490, 3], [1920, 410, 3], [2140, 350, 3]
        ],
        moviles: [],
        zonasLentas: [[520, 520, 150, 48], [1180, 520, 160, 48], [1880, 520, 150, 48]],
        ladrillos: [960, 2300]
    },
    {
        nombre: 'Río de Janeiro (Brasil)',
        descripcion: 'Escalones hacia el Corcovado, con el Cristo Redentor vigilando la ciudad desde lo alto.',
        tex: 'brasil', cielo: [0x4fc3f7, 0xc8f0ff], viento: 0, resbaladizo: false,
        paleta: { plat: [0x7a6a58, 0x3f8f3f, 0x4e4236], suelo: [0x5d4e3f, 0x4caf50, 0x3e3328] },
        plataformas: [
            [380, 500, 3], [560, 440, 3], [740, 380, 3], [920, 320, 3], [1100, 380, 3], [1280, 440, 3],
            [1480, 380, 3], [1660, 320, 3], [1840, 260, 3], [2020, 340, 3], [2220, 420, 3]
        ],
        moviles: [], zonasLentas: [], ladrillos: [1200, 1900]
    },
    {
        nombre: 'Guatapé (Colombia)',
        descripcion: 'Escalones del Peñol y el embalse de aguas azules. El agua frena a la pelota.',
        tex: 'colombia', cielo: [0x81d4fa, 0xe1f5fe], viento: 0, resbaladizo: false,
        paleta: { plat: [0xe8e0d5, 0xe53935, 0x8d8577], suelo: [0xc8b89a, 0x7cb342, 0x6d6253] },
        plataformas: [
            [380, 480, 3], [560, 420, 3], [740, 360, 3], [920, 300, 3], [1100, 360, 3], [1280, 420, 3],
            [1460, 360, 3], [1640, 300, 3], [1820, 380, 3], [2000, 440, 3], [2200, 380, 3]
        ],
        moviles: [], zonasLentas: [[600, 520, 200, 48], [1500, 520, 220, 48]], ladrillos: [1000, 2300]
    },
    {
        nombre: 'Nueva York (Estados Unidos)',
        descripcion: 'Muelles y ferris del puerto, con la Estatua de la Libertad iluminando el camino.',
        tex: 'nueva', cielo: [0x7ec8e3, 0xd7f0ff], viento: 0, resbaladizo: false,
        paleta: { plat: [0x5f8f7a, 0x9fd3b8, 0x3e6457], suelo: [0x4a6b5c, 0x7fb8a4, 0x33493f] },
        plataformas: [
            [360, 480, 4], [600, 420, 3], [800, 460, 3], [1000, 400, 3], [1220, 340, 3], [1420, 400, 3],
            [1640, 460, 3], [1860, 400, 3], [2060, 340, 4], [2260, 400, 3]
        ],
        moviles: [], zonasLentas: [[700, 520, 140, 48], [1500, 520, 140, 48]], ladrillos: [1120, 2150]
    },
    {
        nombre: 'Navidad Nevada',
        descripcion: 'Pinos cubiertos de nieve y suelo de hielo que resbala. Al final, la Casa del Reencuentro espera a los amigos.',
        tex: 'navidad', cielo: [0x1a237e, 0x5c6bc0], viento: 0, resbaladizo: true,
        paleta: { plat: [0x8d6e63, 0xffffff, 0x6d4c41], suelo: [0x6d4c41, 0xf5f9ff, 0x4e342e] },
        plataformas: [
            [400, 480, 3], [580, 420, 3], [760, 360, 3], [940, 420, 3], [1120, 470, 3], [1320, 400, 3],
            [1520, 330, 3], [1720, 400, 4], [1930, 460, 3], [2130, 380, 3], [2330, 440, 3]
        ],
        moviles: [], zonasLentas: [], ladrillos: [1010, 1700]
    }
];

// ============================================================
// Utilidades de dibujo (procedural)
// ============================================================

// Bloque con juntas: plataformas, suelo y atajos
function crearTexturaBloque(escena, key, w, h, [base, tope, linea]) {
    if (escena.textures.exists(key)) return key;
    const g = escena.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(base, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(tope, 1);
    g.fillRect(0, 0, w, Math.min(5, h));
    g.lineStyle(1, linea, 0.6);
    for (let y = 8; y < h; y += 8) g.lineBetween(0, y, w, y);
    for (let x = 0; x < w; x += 16) g.lineBetween(x, 0, x, h);
    g.generateTexture(key, w, h);
    g.destroy();
    return key;
}

// Franja horizontal recortada a la forma de una elipse (para gorros, alas y cuellos)
function franja(g, cy, rx, ry, yIni, yFin, color) {
    const d = ((yIni + yFin) / 2 - cy) / ry;
    if (Math.abs(d) >= 1) return;
    const mitad = rx * Math.sqrt(1 - d * d);
    g.fillStyle(color, 1);
    g.fillRect(-mitad, yIni, mitad * 2, yFin - yIni);
}

// Dibuja un atuendo en el origen, pensado para una pelota de radio 16
function dibujarAtuendo(g, atuendo) {
    switch (atuendo) {
        case 'chullo':
            g.fillStyle(0xc62828, 1);
            g.fillEllipse(0, -10, 34, 18);
            franja(g, -10, 17, 9, -17, -14, 0xffc107);
            franja(g, -10, 17, 9, -13, -10, 0xffffff);
            franja(g, -10, 17, 9, -9, -6, 0x1565c0);
            g.fillEllipse(-17, -2, 8, 14);     // orejeras
            g.fillEllipse(17, -2, 8, 14);
            g.fillStyle(0xffffff, 1);
            g.fillCircle(0, -21, 4);           // pompón
            break;

        case 'bufanda':
            g.fillStyle(0xe53935, 1);
            g.fillEllipse(0, 7, 36, 11);
            franja(g, 7, 18, 5.5, 4, 6, 0xffffff);
            g.fillRect(8, 11, 7, 17);          // cola de la bufanda
            g.fillStyle(0xffffff, 1);
            g.fillRect(8, 27, 7, 2);           // flecos
            break;

        case 'ruana':
            g.fillStyle(0x8d5524, 1);
            g.fillPoints([{ x: -18, y: -2 }, { x: 18, y: -2 }, { x: 21, y: 16 }, { x: -21, y: 16 }], true);
            g.fillStyle(0xe53935, 1); g.fillRect(-20, 2, 40, 3);
            g.fillStyle(0xfdd835, 1); g.fillRect(-20, 7, 40, 3);
            g.fillStyle(0x1e88e5, 1); g.fillRect(-20, 12, 40, 3);
            break;

        case 'sombrero':
            g.fillStyle(0xf2d28b, 1);
            g.fillEllipse(0, -12, 46, 12);     // ala
            g.fillStyle(0xe6c170, 1);
            g.fillRoundedRect(-11, -30, 22, 20, 6);   // copa
            g.fillStyle(0x8d6e3f, 1);
            g.fillRect(-11, -15, 22, 3);       // cinta
            break;

        case 'impermeable':
            g.fillStyle(0xffd23f, 1);
            g.fillEllipse(0, -6, 34, 24);      // capucha
            g.fillPoints([{ x: -17, y: 2 }, { x: 17, y: 2 }, { x: 19, y: 16 }, { x: -19, y: 16 }], true);
            g.lineStyle(2, 0xb8860b, 1);
            g.lineBetween(0, 4, 0, 16);        // cremallera
            break;

        default:
            break; // "ninguno": sin accesorios
    }
}

// Cielo degradado fijo en pantalla
function mezclar(a, b, t) {
    const c = (color, s) => (color >> s) & 255;
    const r = Math.round(c(a, 16) + (c(b, 16) - c(a, 16)) * t);
    const g = Math.round(c(a, 8) + (c(b, 8) - c(a, 8)) * t);
    const bl = Math.round(c(a, 0) + (c(b, 0) - c(a, 0)) * t);
    return (r << 16) | (g << 8) | bl;
}

function dibujarCielo(escena, arriba, abajo) {
    const g = escena.add.graphics().setScrollFactor(0).setDepth(-10);
    const franjas = 30;
    for (let i = 0; i < franjas; i++) {
        g.fillStyle(mezclar(arriba, abajo, i / (franjas - 1)), 1);
        g.fillRect(0, (WORLD_H / franjas) * i, 800, WORLD_H / franjas + 1);
    }
}

function nubes(escena, ancho, cantidad, tinte) {
    for (let i = 0; i < cantidad; i++) {
        const n = escena.add.image(Phaser.Math.Between(0, ancho), Phaser.Math.Between(40, 220), 'nube')
            .setScale(Phaser.Math.FloatBetween(0.6, 1.2))
            .setScrollFactor(0.4)
            .setDepth(-5)
            .setTint(tinte);
        escena.tweens.add({
            targets: n, x: n.x + Phaser.Math.Between(60, 140),
            duration: Phaser.Math.Between(6000, 10000), yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }
}

// ============================================================
// Fondos por bioma
// ============================================================

function fondoQuito(escena, ancho) {
    dibujarCielo(escena, 0xff9e5e, 0xffe3b8);
    escena.add.circle(640, 120, 46, 0xffd166).setScrollFactor(0).setDepth(-9);

    // Montañas tipo Pichincha
    const montes = escena.add.graphics().setScrollFactor(0.3).setDepth(-8);
    montes.fillStyle(0x8e5a7e, 1);
    const picos = [{ x: -200, y: WORLD_H }];
    for (let x = -200; x <= ancho + 200; x += 150) picos.push({ x, y: Phaser.Math.Between(250, 360) });
    picos.push({ x: ancho + 200, y: WORLD_H });
    montes.fillPoints(picos, true);

    // Casas coloniales: muros claros, techos rojos y ventanas de madera
    const casas = escena.add.graphics().setScrollFactor(0.6).setDepth(-6);
    const colores = [0xf5e6c8, 0xf0d9a8, 0xe9c9a0, 0xd7e9ef];
    for (let x = -50; x < ancho + 50;) {
        const w = Phaser.Math.Between(80, 130), h = Phaser.Math.Between(90, 170);
        casas.fillStyle(colores[Phaser.Math.Between(0, colores.length - 1)], 1);
        casas.fillRect(x, SUELO_TOP - h, w, h);
        casas.fillStyle(0xb5532f, 1);
        casas.fillTriangle(x - 6, SUELO_TOP - h, x + w + 6, SUELO_TOP - h, x + w / 2, SUELO_TOP - h - 26);
        casas.fillStyle(0x5d4037, 1);
        for (let wy = SUELO_TOP - h + 20; wy < SUELO_TOP - 40; wy += 36) {
            casas.fillRect(x + 14, wy, 14, 20);
            casas.fillRect(x + w - 28, wy, 14, 20);
        }
        x += w + Phaser.Math.Between(0, 10);
    }
    nubes(escena, ancho, 6, 0xffe0c2);
}

function fondoAndes(escena, ancho) {
    dibujarCielo(escena, 0xa8dcc0, 0xe9f7ee);

    // Cerros lejanos y colinas verdes
    const cerros = escena.add.graphics().setScrollFactor(0.35).setDepth(-8);
    cerros.fillStyle(0x3f7a5a, 1);
    const picos = [{ x: -200, y: WORLD_H }];
    for (let x = -200; x <= ancho + 200; x += 170) picos.push({ x, y: Phaser.Math.Between(260, 380) });
    picos.push({ x: ancho + 200, y: WORLD_H });
    cerros.fillPoints(picos, true);

    const colinas = escena.add.graphics().setScrollFactor(0.6).setDepth(-7);
    colinas.fillStyle(0x6fae6a, 1);
    for (let x = 0; x < ancho + 200; x += 260) colinas.fillEllipse(x, SUELO_TOP, 360, 180);

    // Frailejones
    const fr = escena.add.graphics().setDepth(-2);
    for (let x = 60; x < ancho; x += Phaser.Math.Between(180, 260)) {
        const alto = Phaser.Math.Between(50, 90);
        fr.fillStyle(0x8d6e63, 1);
        fr.fillRect(x - 4, SUELO_TOP - alto, 8, alto);
        fr.fillStyle(0x9ccc65, 1);
        fr.fillEllipse(x, SUELO_TOP - alto, 36, 14);
        fr.fillStyle(0xc5e1a5, 1);
        fr.fillEllipse(x, SUELO_TOP - alto - 4, 22, 10);
    }

    // Niebla que se desplaza lentamente
    for (let i = 0; i < 4; i++) {
        const niebla = escena.add.rectangle(Phaser.Math.Between(0, ancho), Phaser.Math.Between(200, 480), 600, 120, 0xffffff, 0.22)
            .setScrollFactor(0.5).setDepth(-3);
        escena.tweens.add({ targets: niebla, x: niebla.x + 160, duration: 8000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
}

function fondoGuayaquil(escena, ancho) {
    dibujarCielo(escena, 0x3fb6f0, 0xbfe9ff);
    escena.add.circle(120, 110, 50, 0xffd54f).setScrollFactor(0).setDepth(-9);

    // Silueta del malecón
    const ciudad = escena.add.graphics().setScrollFactor(0.5).setDepth(-6);
    const tonos = [0x90caf9, 0x64b5f6, 0xb0bec5];
    for (let x = -50; x < ancho + 50;) {
        const w = Phaser.Math.Between(60, 110), h = Phaser.Math.Between(120, 260);
        ciudad.fillStyle(tonos[Phaser.Math.Between(0, tonos.length - 1)], 1);
        ciudad.fillRect(x, SUELO_TOP - h, w, h);
        ciudad.fillStyle(0xe3f2fd, 0.6);
        for (let wy = SUELO_TOP - h + 12; wy < SUELO_TOP - 30; wy += 22) {
            for (let wx = x + 8; wx < x + w - 10; wx += 18) ciudad.fillRect(wx, wy, 8, 10);
        }
        x += w + Phaser.Math.Between(0, 8);
    }

    // Río Guayas con olas
    const rio = escena.add.graphics().setScrollFactor(0.8).setDepth(-4);
    rio.fillStyle(0x29b6f6, 1);
    rio.fillRect(-200, 470, ancho + 400, 100);
    rio.lineStyle(2, 0xe1f5fe, 0.8);
    for (let x = -200; x < ancho + 200; x += 60) {
        const y = Phaser.Math.Between(480, 560);
        rio.lineBetween(x, y, x + 30, y);
    }

    // Palmeras
    const palmas = escena.add.graphics().setDepth(-1);
    for (let x = 80; x < ancho; x += Phaser.Math.Between(260, 340)) {
        palmas.lineStyle(7, 0x8d6e63, 1);
        palmas.lineBetween(x, SUELO_TOP, x + 10, 500);
        palmas.lineBetween(x + 10, 500, x + 20, 440);
        palmas.fillStyle(0x2e7d32, 1);
        palmas.fillTriangle(x + 20, 440, x - 22, 428, x + 4, 466);
        palmas.fillTriangle(x + 20, 440, x + 60, 428, x + 36, 466);
        palmas.fillTriangle(x + 20, 440, x - 4, 418, x + 26, 416);
    }
    nubes(escena, ancho, 4, 0xffffff);
}

function fondoManglar(escena, ancho) {
    dibujarCielo(escena, 0x2c5a4a, 0x8fbf9a);

    // Dosel de manglar
    const dosel = escena.add.graphics().setScrollFactor(0.5).setDepth(-7);
    dosel.fillStyle(0x1b4d2e, 1);
    for (let x = -50; x < ancho + 80; x += 70) dosel.fillEllipse(x, 40 + Phaser.Math.Between(0, 50), 140, 90);

    // Raíces zancudas
    const raices = escena.add.graphics().setDepth(-2);
    raices.lineStyle(4, 0x5d4037, 1);
    for (let x = 0; x < ancho; x += Phaser.Math.Between(40, 70)) {
        const dx = Phaser.Math.Between(-15, 15);
        raices.lineBetween(x, 130, x + dx, 300);
        raices.lineBetween(x + dx, 300, x + dx - 10, SUELO_TOP);
    }

    // Esteros: agua que ralentiza
    const agua = escena.add.graphics().setDepth(-0.5);
    escena.bio.zonasLentas.forEach(([x, y, w, h]) => {
        agua.fillStyle(0x26a69a, 0.5);
        agua.fillRect(x, y, w, h);
        agua.lineStyle(2, 0xb2dfdb, 0.7);
        for (let i = 0; i < 3; i++) {
            const ry = y + 12 + i * 12;
            agua.lineBetween(x + 14 + i * 20, ry, x + 40 + i * 20, ry);
        }
    });
}

// Cristo Redentor dibujado en el origen (base del pedestal en baseY)
function drawCristo(g, x, baseY) {
    g.fillStyle(0x9e9e9e, 1);
    g.fillRect(x - 14, baseY - 26, 28, 26);      // pedestal
    g.fillStyle(0xf1efe7, 1);
    g.fillRect(x - 6, baseY - 100, 12, 76);      // túnica
    g.fillRect(x - 40, baseY - 92, 80, 8);       // brazos extendidos
    g.fillCircle(x, baseY - 108, 7);             // cabeza
}

// Estatua de la Libertad (base del pedestal en baseY)
function drawEstatua(g, x, baseY) {
    g.fillStyle(0xa8a29a, 1);
    g.fillRect(x - 30, baseY - 40, 60, 40);      // pedestal
    g.fillStyle(0x7fbfa0, 1);
    g.fillPoints([{ x: x - 18, y: baseY - 40 }, { x: x + 18, y: baseY - 40 },
                  { x: x + 11, y: baseY - 170 }, { x: x - 11, y: baseY - 170 }], true);
    g.fillCircle(x, baseY - 182, 11);            // cabeza
    g.fillTriangle(x - 9, baseY - 190, x - 6, baseY - 204, x - 3, baseY - 190);   // corona
    g.fillTriangle(x - 2, baseY - 190, x + 1, baseY - 206, x + 4, baseY - 190);
    g.fillTriangle(x + 5, baseY - 190, x + 8, baseY - 204, x + 11, baseY - 190);
    g.fillRect(x + 6, baseY - 240, 9, 80);       // brazo
    g.fillStyle(0xffd54f, 1);
    g.fillRect(x + 4, baseY - 258, 13, 20);      // antorcha
    g.fillStyle(0xff9800, 1);
    g.fillTriangle(x + 4, baseY - 258, x + 17, baseY - 258, x + 10, baseY - 280);  // llama
}

function fondoBrasil(escena, ancho) {
    dibujarCielo(escena, 0x4fc3f7, 0xc8f0ff);
    escena.add.circle(700, 90, 36, 0xfff176).setScrollFactor(0).setDepth(-9);

    // Montañas tipo Pão de Açúcar
    const montes = escena.add.graphics().setScrollFactor(0.3).setDepth(-8);
    montes.fillStyle(0x2e7d4f, 1);
    const picos = [{ x: -200, y: WORLD_H }];
    for (let x = -200; x <= ancho + 200; x += 170) picos.push({ x, y: Phaser.Math.Between(260, 380) });
    picos.push({ x: ancho + 200, y: WORLD_H });
    montes.fillPoints(picos, true);

    // Corcovado con el Cristo Redentor en la cima
    const cor = escena.add.graphics().setScrollFactor(0.5).setDepth(-7);
    cor.fillStyle(0x3f8f3f, 1);
    cor.fillEllipse(1400, 520, 300, 600);
    drawCristo(cor, 1400, 225);

    nubes(escena, ancho, 5, 0xffffff);
}

function fondoColombia(escena, ancho) {
    dibujarCielo(escena, 0x81d4fa, 0xe1f5fe);

    // Colinas verdes
    const colinas = escena.add.graphics().setScrollFactor(0.4).setDepth(-8);
    colinas.fillStyle(0x558b2f, 1);
    for (let x = 0; x < ancho + 200; x += 320) colinas.fillEllipse(x, SUELO_TOP, 420, 220);

    // El Peñol: roca con escalera en zigzag y zócalos de colores
    const roca = escena.add.graphics().setScrollFactor(0.6).setDepth(-6);
    roca.fillStyle(0x8d8577, 1);
    roca.fillPoints([
        { x: 1300, y: SUELO_TOP }, { x: 1330, y: 320 }, { x: 1380, y: 200 }, { x: 1440, y: 120 },
        { x: 1500, y: 80 }, { x: 1560, y: 110 }, { x: 1620, y: 190 }, { x: 1680, y: 300 }, { x: 1700, y: SUELO_TOP }
    ], true);
    roca.lineStyle(3, 0xf5f5f5, 0.9);
    const escalera = [[1460, 520], [1540, 470], [1466, 420], [1540, 370], [1470, 320], [1530, 270], [1488, 220]];
    for (let i = 0; i < escalera.length - 1; i++) {
        roca.lineBetween(escalera[i][0], escalera[i][1], escalera[i + 1][0], escalera[i + 1][1]);
    }
    [0xe53935, 0xffca28, 0x1e88e5, 0x43a047, 0xff7043].forEach((c, i) => {
        roca.fillStyle(c, 1);
        roca.fillRect(1455, 430 + i * 16, 90, 12);
    });

    // Embalse de aguas azules
    const lago = escena.add.graphics().setScrollFactor(0.8).setDepth(-4);
    lago.fillStyle(0x1e88e5, 1);
    lago.fillRect(-200, 480, ancho + 400, 88);
    lago.lineStyle(2, 0xbbdefb, 0.7);
    for (let x = -200; x < ancho + 200; x += 70) {
        const y = Phaser.Math.Between(490, 555);
        lago.lineBetween(x, y, x + 30, y);
    }

    nubes(escena, ancho, 4, 0xffffff);
}

function fondoNueva(escena, ancho) {
    dibujarCielo(escena, 0x7ec8e3, 0xd7f0ff);
    escena.add.circle(180, 100, 30, 0xfff59d).setScrollFactor(0).setDepth(-9);

    // Skyline de Manhattan
    const ciudad = escena.add.graphics().setScrollFactor(0.5).setDepth(-6);
    const tonos = [0xb0bec5, 0x90a4ae, 0xcfd8dc, 0x78909c];
    for (let x = -50; x < ancho + 50;) {
        const w = Phaser.Math.Between(50, 90), h = Phaser.Math.Between(150, 330);
        ciudad.fillStyle(tonos[Phaser.Math.Between(0, tonos.length - 1)], 1);
        ciudad.fillRect(x, SUELO_TOP - h, w, h);
        ciudad.fillStyle(0xe3f2fd, 0.5);
        for (let wy = SUELO_TOP - h + 12; wy < SUELO_TOP - 30; wy += 16) {
            for (let wx = x + 6; wx < x + w - 8; wx += 12) ciudad.fillRect(wx, wy, 6, 8);
        }
        x += w + Phaser.Math.Between(0, 8);
    }

    // Estatua de la Libertad en su isla
    const estatua = escena.add.graphics().setScrollFactor(0.6).setDepth(-5);
    drawEstatua(estatua, 1900, 500);

    // Bahía del puerto
    const bahia = escena.add.graphics().setScrollFactor(0.8).setDepth(-4);
    bahia.fillStyle(0x2a7fa8, 1);
    bahia.fillRect(-200, 510, ancho + 400, 58);
    bahia.lineStyle(2, 0xb3e5fc, 0.6);
    for (let x = -200; x < ancho + 200; x += 60) {
        const y = Phaser.Math.Between(520, 560);
        bahia.lineBetween(x, y, x + 26, y);
    }

    nubes(escena, ancho, 4, 0xffffff);
}

function fondoNavidad(escena, ancho) {
    dibujarCielo(escena, 0x1a237e, 0x5c6bc0);

    // Estrellas y luna
    for (let i = 0; i < 60; i++) {
        escena.add.circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 330),
            Phaser.Math.FloatBetween(0.6, 1.8), 0xffffff, Phaser.Math.FloatBetween(0.4, 1))
            .setScrollFactor(0).setDepth(-9);
    }
    escena.add.circle(640, 90, 34, 0xfff8e1).setScrollFactor(0).setDepth(-9);

    // Colinas nevadas
    const nieve = escena.add.graphics().setScrollFactor(0.5).setDepth(-7);
    nieve.fillStyle(0xe8eef7, 1);
    for (let x = 0; x < ancho + 300; x += 260) nieve.fillEllipse(x, SUELO_TOP, 420, 200);

    // Pinos con adornos
    const pinos = escena.add.graphics().setScrollFactor(0.9).setDepth(-2);
    for (let x = 40; x < ancho; x += Phaser.Math.Between(130, 190)) {
        const alto = Phaser.Math.Between(90, 150);
        pinos.fillStyle(0x1b5e20, 1);
        for (let t = 0; t < 3; t++) {
            const apice = SUELO_TOP - alto + t * alto * 0.3;
            const base = apice + alto * 0.5;
            const mitad = 14 + t * 10;
            pinos.fillTriangle(x, apice, x - mitad, base, x + mitad, base);
        }
        pinos.fillStyle(0xffd54f, 1);
        pinos.fillCircle(x, SUELO_TOP - alto - 4, 4);            // estrella
        pinos.fillStyle(0xe53935, 1);
        pinos.fillCircle(x - 8, SUELO_TOP - alto * 0.6, 3);
        pinos.fillStyle(0x42a5f5, 1);
        pinos.fillCircle(x + 9, SUELO_TOP - alto * 0.45, 3);
    }

    // Nieve cayendo
    escena.time.addEvent({
        delay: 120, loop: true,
        callback: () => {
            const copo = escena.add.circle(Phaser.Math.Between(0, 800), -8, Phaser.Math.FloatBetween(1, 3), 0xffffff, 0.9)
                .setScrollFactor(0).setDepth(9);
            escena.tweens.add({
                targets: copo, y: 620, x: copo.x + Phaser.Math.Between(-40, 40),
                duration: Phaser.Math.Between(3000, 5000), onComplete: () => copo.destroy()
            });
        }
    });
}

const FONDOS = {
    quito: fondoQuito,
    andes: fondoAndes,
    guayaquil: fondoGuayaquil,
    manglar: fondoManglar,
    brasil: fondoBrasil,
    colombia: fondoColombia,
    nueva: fondoNueva,
    navidad: fondoNavidad
};

// ============================================================
// Casa del Reencuentro (final del último bioma)
// ============================================================

function dibujarCasa(escena) {
    const g = escena.add.graphics().setDepth(0);
    g.fillStyle(0xfff3d6, 1);
    g.fillRect(2530, 458, 130, 110);                              // muros
    g.fillStyle(0xc0573a, 1);
    g.fillTriangle(2520, 462, 2595, 396, 2670, 462);              // techo
    g.fillStyle(0x6d4c41, 1);
    g.fillRect(2578, 500, 34, 68);                                // puerta
    g.fillStyle(0xffd54f, 1);
    g.fillCircle(2606, 536, 2);                                   // picaporte
    g.fillStyle(0x81d4fa, 1);
    g.fillRect(2545, 486, 24, 24);
    g.fillRect(2625, 486, 24, 24);
    g.lineStyle(2, 0x6d4c41, 1);
    g.strokeRect(2545, 486, 24, 24);
    g.strokeRect(2625, 486, 24, 24);

    escena.add.text(2595, 366, 'Casa del Reencuentro', {
        fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', stroke: '#5d4037', strokeThickness: 4
    }).setOrigin(0.5).setDepth(1);

    // Amigos esperando frente a la casa
    return [
        { x: 2440, tex: 'amigo_azul' },
        { x: 2475, tex: 'amigo_verde' },
        { x: 2505, tex: 'amigo_amarillo' }
    ].map(a => escena.add.container(a.x, SUELO_TOP - 14, [
        escena.add.image(0, 0, a.tex),
        escena.add.image(-5, -3, 'ojo').setScale(0.7),
        escena.add.image(5, -3, 'ojo').setScale(0.7),
        escena.add.image(-5, -3, 'pupila').setScale(0.7),
        escena.add.image(5, -3, 'pupila').setScale(0.7)
    ]).setDepth(2));
}

// ============================================================
// Escenas
// ============================================================

// Genera todas las texturas una sola vez
class Boot extends Phaser.Scene {
    constructor() { super('Boot'); }

    create() {
        crearTexturas(this);
        this.scene.start('Menu');
    }
}

// Selector de avatar, atuendo y bioma
class Menu extends Phaser.Scene {
    constructor() { super('Menu'); }

    create() {
        dibujarCielo(this, 0x6ec6ff, 0xd7f1ff);

        this.opciones = [Object.keys(AVATARES), Object.keys(ATUENDOS), BIOMAS.map((_, i) => i)];
        this.indice = [0, 0, 0];
        this.fila = 0;
        this.valores = [];
        this.marcos = [];
        const etiquetas = ['AVATAR', 'ATUENDO', 'BIOMA'];
        const filasY = [160, 240, 320];

        this.add.text(400, 40, 'La Travesía de la Pelotita', {
            fontFamily: 'Arial', fontSize: '34px', fontStyle: 'bold', color: '#1b3a4b'
        }).setOrigin(0.5);
        this.add.text(400, 85, 'Misión 1: El Alma del Juego', {
            fontFamily: 'Arial', fontSize: '18px', color: '#1b3a4b'
        }).setOrigin(0.5);

        filasY.forEach((y, r) => {
            this.marcos[r] = this.add.rectangle(300, y, 440, 56, 0xffffff, 0.35).setVisible(false);
            this.add.text(90, y, etiquetas[r], {
                fontFamily: 'Arial', fontSize: '16px', fontStyle: 'bold', color: '#1b3a4b'
            }).setOrigin(0, 0.5);
            this.valores[r] = this.add.text(300, y, '', {
                fontFamily: 'Arial', fontSize: '22px', fontStyle: 'bold', color: '#1b3a4b'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            this.valores[r].on('pointerdown', () => { this.fila = r; this.cambiar(r, 1); });
        });

        // Vista previa: pelota con su atuendo
        this.previa = this.add.container(640, 220);
        this.previaBola = this.add.image(0, 0, 'ball');
        this.previaSkin = this.add.graphics();
        this.previa.add([this.previaBola, this.previaSkin]);
        this.previa.setScale(2.4);
        this.tweens.add({ targets: this.previa, y: 205, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

        // Muestra de color del bioma
        this.muestra = this.add.rectangle(640, 330, 150, 50, 0xffffff).setStrokeStyle(2, 0x1b3a4b);

        this.descripcion = this.add.text(400, 385, '', {
            fontFamily: 'Arial', fontSize: '16px', color: '#1b3a4b', align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5, 0);

        this.boton = this.add.text(400, 470, '▶ Comenzar viaje (Enter)', {
            fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', backgroundColor: '#2e7d32',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.boton.on('pointerdown', () => this.empezar());

        this.add.text(400, 555, 'Flechas ↑↓: cambiar de fila  ·  ←→: cambiar opción  ·  Enter: comenzar', {
            fontFamily: 'Arial', fontSize: '14px', color: '#1b3a4b'
        }).setOrigin(0.5);

        const teclado = this.input.keyboard;
        teclado.on('keydown-UP', () => this.moverFila(-1));
        teclado.on('keydown-DOWN', () => this.moverFila(1));
        teclado.on('keydown-LEFT', () => this.cambiar(this.fila, -1));
        teclado.on('keydown-RIGHT', () => this.cambiar(this.fila, 1));
        teclado.on('keydown-ENTER', () => this.empezar());
        this.events.once('shutdown', () => teclado.removeAllListeners());

        this.refrescar();
    }

    opcion(r) { return this.opciones[r][this.indice[r]]; }

    moverFila(d) {
        this.fila = (this.fila + d + this.opciones.length) % this.opciones.length;
        this.refrescar();
    }

    cambiar(r, d) {
        const total = this.opciones[r].length;
        this.indice[r] = (this.indice[r] + d + total) % total;
        this.refrescar();
    }

    nombreOpcion(r, k) {
        if (r === 0) return AVATARES[k].nombre;
        if (r === 1) return ATUENDOS[k].nombre;
        return BIOMAS[k].nombre;
    }

    descripcionOpcion(r, k) {
        if (r === 0) return AVATARES[k].descripcion;
        if (r === 1) return ATUENDOS[k].descripcion;
        return BIOMAS[k].descripcion;
    }

    refrescar() {
        for (let r = 0; r < this.valores.length; r++) {
            this.valores[r].setText(`◀  ${this.nombreOpcion(r, this.opcion(r))}  ▶`);
            this.marcos[r].setVisible(r === this.fila);
        }
        const avatar = AVATARES[this.opcion(0)];
        this.previaBola.setTexture(avatar.textura);
        this.previaSkin.clear();
        dibujarAtuendo(this.previaSkin, this.opcion(1));
        this.previaSkin.setScale(avatar.radio / 16);
        this.muestra.setFillStyle(BIOMAS[this.opcion(2)].cielo[0]);
        this.descripcion.setText(this.descripcionOpcion(this.fila, this.opcion(this.fila)));
    }

    empezar() {
        this.scene.start('Juego', {
            avatar: this.opcion(0),
            skin: this.opcion(1),
            bioma: this.opcion(2)
        });
    }
}

// Nivel: un bioma por vez; al llegar a la meta se avanza al siguiente
class Juego extends Phaser.Scene {
    constructor() { super('Juego'); }

    init(datos = {}) {
        this.partida = {
            avatar: datos.avatar || 'clasica',
            skin: datos.skin || 'ninguno',
            bioma: datos.bioma || 0
        };
    }

    create() {
        this.av = AVATARES[this.partida.avatar];
        this.bio = BIOMAS[this.partida.bioma];
        this.esFinal = this.partida.bioma === BIOMAS.length - 1;
        this.ancho = this.esFinal ? ANCHO_FINAL : ANCHO_NIVEL;
        this.escala = this.av.radio / 16;
        this.puntos = 0;
        this.ganado = false;
        this.mirada = 1;
        this.ojos = [];
        this.vientoActual = 0;
        this.zonasLentas = this.bio.zonasLentas.map(([x, y, w, h]) => new Phaser.Geom.Rectangle(x, y, w, h));

        this.cameras.main.setBackgroundColor(this.bio.cielo[1]);
        this.physics.world.setBounds(0, 0, this.ancho, WORLD_H);
        this.cameras.main.setBounds(0, 0, this.ancho, WORLD_H);

        // Escenario
        FONDOS[this.bio.tex](this, this.ancho);

        this.plataformas = this.physics.add.staticGroup();
        const suelo = crearTexturaBloque(this, `suelo_${this.bio.tex}`, this.ancho, 32, this.bio.paleta.suelo);
        this.plataformas.create(this.ancho / 2, SUELO_TOP + 16, suelo);
        this.bio.plataformas.forEach(([x, y, bloques]) => {
            const key = crearTexturaBloque(this, `plat_${this.bio.tex}_${bloques}`, bloques * 32, 16, this.bio.paleta.plat);
            this.plataformas.create(x, y, key);
        });

        // Plataformas móviles (solo Guayaquil)
        this.moviles = this.physics.add.group({ allowGravity: false, immovable: true });
        this.bio.moviles.forEach(m => {
            const key = crearTexturaBloque(this, `movil_${m.tiles}`, m.tiles * 32, 16, [0xffd54f, 0xfff59d, 0xb8860b]);
            const sp = this.moviles.create(m.x, m.y, key);
            sp.rango = [m.min, m.max];
            sp.vel = m.vel;
            sp.xAnterior = m.x;
            sp.body.setVelocityX(m.vel);
        });

        // Bloques frágiles: la esfera de roca los rompe al correr
        this.ladrillos = this.physics.add.staticGroup();
        this.bio.ladrillos.forEach(x => this.ladrillos.create(x, SUELO_TOP - 16, 'fragil'));

        // Monedas: tres sobre cada plataforma y una fila en el suelo
        this.monedas = this.physics.add.staticGroup();
        this.bio.plataformas.forEach(([x, y]) => {
            for (let i = -1; i <= 1; i++) this.monedas.create(x + i * 40, y - 40, 'moneda');
        });
        for (let x = 300; x < this.ancho - 300; x += 400) this.monedas.create(x, 530, 'moneda');
        this.totalMonedas = this.monedas.getLength();

        // Pelota del avatar elegido
        this.player = this.physics.add.sprite(100, 300, this.av.textura);
        this.player.setCircle(this.av.radio);
        this.player.setBounce(this.av.rebote);
        this.player.setCollideWorldBounds(true);
        this.player.setMaxVelocity(this.av.velMax[0], 500);
        this.player.setDragX(this.av.friccion);
        this.player.setGravityY(this.av.pesoExtra);

        // Atuendo: se dibuja sobre la pelota y la sigue en cada frame
        this.atuendo = this.add.graphics().setDepth(1).setScale(this.escala);
        dibujarAtuendo(this.atuendo, this.partida.skin);

        // Ojos: blancos y pupilas que siguen a la pelota
        this.ojos = [-6, 6].map(dx => ({
            dx: dx * this.escala,
            blanco: this.add.image(0, 0, 'ojo').setDepth(2),
            pupila: this.add.image(0, 0, 'pupila').setDepth(3)
        }));
        this.time.addEvent({ delay: 2500, loop: true, callback: this.parpadear, callbackScope: this });
        if (this.bio.viento) {
            this.time.addEvent({ delay: 3000, loop: true, callback: this.cambiarViento, callbackScope: this });
        }

        // Colisiones
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.collider(this.player, this.moviles);
        this.physics.add.collider(this.player, this.ladrillos, null, () => !this.rompeAhora(), this);
        this.physics.add.overlap(this.player, this.ladrillos, (p, b) => this.romperLadrillo(b), () => this.rompeAhora(), this);
        this.physics.add.overlap(this.player, this.monedas, (p, m) => this.recogerMoneda(m), null, this);

        // Meta: poste y bandera (en el último bioma, la Casa del Reencuentro)
        this.add.rectangle(META_X, 508, 6, 120, 0x555555).setDepth(1);
        this.add.triangle(META_X + 25, 452, 0, 0, 40, 15, 0, 30, 0xff3b3b).setDepth(1);
        this.meta = this.add.zone(META_X, 480, 60, 200);
        this.physics.add.existing(this.meta, true);
        this.physics.add.overlap(this.player, this.meta, () => this.ganar(), null, this);
        this.amigos = this.esFinal ? dibujarCasa(this) : [];

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Controles
        this.cursores = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));
        this.events.once('shutdown', () => this.input.keyboard.removeAllListeners());

        // HUD (fijo en pantalla)
        this.textoMonedas = this.add.text(16, 16, '', {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff', stroke: '#1b5e20', strokeThickness: 5
        }).setScrollFactor(0).setDepth(10);
        this.add.text(784, 16, `${this.av.nombre} · ${this.bio.nombre}`, {
            fontFamily: 'Arial', fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);
        this.add.text(16, 560, 'Flechas: moverse  ·  ↑: saltar  ·  Shift: correr  ·  Esc: menú', {
            fontFamily: 'Arial', fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(10);
        this.actualizarMarcador();
    }

    update(time, delta) {
        const p = this.player;
        const mirarY = Phaser.Math.Clamp(p.body.velocity.y / 400, -1, 1);

        if (this.ganado) {
            p.setAccelerationX(0);
        } else {
            this.moverJugador(delta);
        }
        this.moverPlataformasMoviles();

        // El atuendo y los ojos siguen a la pelota
        this.atuendo.setPosition(p.x, p.y);
        this.ojos.forEach(o => {
            o.blanco.setPosition(p.x + o.dx, p.y - 4 * this.escala);
            o.pupila.setPosition(o.blanco.x + this.mirada * 2.5 * this.escala, o.blanco.y + mirarY * 2);
        });
    }

    moverJugador(delta) {
        const p = this.player;
        const av = this.av;
        const enSuelo = p.body.blocked.down || p.body.touching.down;
        const enAgua = this.zonasLentas.some(r => Phaser.Geom.Rectangle.Contains(r, p.x, p.y));
        const f = enAgua ? 0.5 : 1;
        const corriendo = this.shiftKey.isDown;

        p.setMaxVelocity((corriendo ? av.velMax[1] : av.velMax[0]) * f, 500);
        p.setDragX(this.bio.resbaladizo && enSuelo ? 200 : av.friccion);

        const acel = (corriendo ? av.aceleracion[1] : av.aceleracion[0]) * f;
        if (this.cursores.left.isDown) p.setAccelerationX(-acel);
        else if (this.cursores.right.isDown) p.setAccelerationX(acel);
        else p.setAccelerationX(0);

        // Ráfagas de viento (Andes)
        if (this.vientoActual) p.body.velocity.x += this.vientoActual * delta / 1000;

        // Salto solo desde el suelo o una plataforma
        if (Phaser.Input.Keyboard.JustDown(this.cursores.up) && enSuelo) {
            p.setVelocityY(av.salto * (enAgua ? 0.85 : 1));
        }

        // La pelota rueda según su velocidad
        const vx = p.body.velocity.x;
        p.rotation += (vx * delta / 1000) / av.radio;
        if (Math.abs(vx) > 10) this.mirada = Math.sign(vx);
    }

    moverPlataformasMoviles() {
        const p = this.player;
        this.moviles.getChildren().forEach(m => {
            const [min, max] = m.rango;
            if (m.x <= min) m.body.setVelocityX(Math.abs(m.vel));
            else if (m.x >= max) m.body.setVelocityX(-Math.abs(m.vel));
            // La pelota viaja sobre la plataforma
            if (p.body.touching.down && m.body.touching.up) p.x += m.x - m.xAnterior;
            m.xAnterior = m.x;
        });
    }

    rompeAhora() {
        return this.av.rompe && Math.abs(this.player.body.velocity.x) > 150;
    }

    romperLadrillo(b) {
        const x = b.x, y = b.y;
        b.destroy();
        this.cameras.main.shake(120, 0.005);
        for (let i = 0; i < 6; i++) {
            const trozo = this.add.rectangle(x, y, Phaser.Math.Between(5, 10), Phaser.Math.Between(5, 10), 0xc8844b).setDepth(1);
            this.tweens.add({
                targets: trozo,
                x: x + Phaser.Math.Between(-60, 60),
                y: y + Phaser.Math.Between(-60, 0),
                alpha: 0,
                duration: 600,
                onComplete: () => trozo.destroy()
            });
        }
    }

    recogerMoneda(moneda) {
        moneda.disableBody(true, true);
        this.puntos++;
        this.actualizarMarcador();
    }

    actualizarMarcador() {
        this.textoMonedas.setText(`Monedas: ${this.puntos} / ${this.totalMonedas}`);
    }

    cambiarViento() {
        const dir = Phaser.Math.Between(0, 1) ? 1 : -1;
        this.vientoActual = dir * this.bio.viento;
        this.rafagaVisual(dir);
        this.time.delayedCall(1500, () => { this.vientoActual = 0; });
    }

    rafagaVisual(dir) {
        for (let i = 0; i < 6; i++) {
            const linea = this.add.rectangle(dir > 0 ? -120 : 920, Phaser.Math.Between(60, 540),
                Phaser.Math.Between(60, 120), 3, 0xffffff, 0.6).setScrollFactor(0).setDepth(9);
            this.tweens.add({
                targets: linea,
                x: dir > 0 ? 920 : -120,
                duration: Phaser.Math.Between(700, 1000),
                delay: i * 120,
                onComplete: () => linea.destroy()
            });
        }
    }

    parpadear() {
        const partes = this.ojos.flatMap(o => [o.blanco, o.pupila]);
        this.tweens.add({ targets: partes, scaleY: 0.1, yoyo: true, duration: 80 });
    }

    ganar() {
        if (this.ganado) return;
        this.ganado = true;

        if (this.esFinal) {
            this.mostrarTexto('¡Llegaste a la Casa del Reencuentro!', 'Tus amigos te estaban esperando.  ·  Enter: volver al menú');
            this.amigos.forEach((a, i) => this.tweens.add({
                targets: a, y: a.y - 30, yoyo: true, repeat: -1, delay: i * 150, duration: 300, ease: 'Sine.easeOut'
            }));
            this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Menu'));
        } else {
            const siguiente = BIOMAS[this.partida.bioma + 1];
            this.mostrarTexto(`¡${this.bio.nombre} completado!`, `Siguiente: ${siguiente.nombre}`);
            this.time.delayedCall(3000, () => this.scene.restart({ ...this.partida, bioma: this.partida.bioma + 1 }));
        }
    }

    mostrarTexto(titulo, subtitulo) {
        this.add.text(400, 260, titulo, {
            fontFamily: 'Arial', fontSize: '34px', color: '#ffffff', stroke: '#1b5e20', strokeThickness: 6,
            align: 'center', wordWrap: { width: 700 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
        this.add.text(400, 320, subtitulo, {
            fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    }
}

// Crea las texturas base que se dibujan por código
function crearTexturas(escena) {
    const g = escena.make.graphics({ x: 0, y: 0, add: false });

    // Pelota clásica: roja con brillo y una mancha
    g.fillStyle(0xff3b3b, 1); g.fillCircle(16, 16, 16);
    g.fillStyle(0xb71c1c, 1); g.fillCircle(22, 22, 4);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(11, 11, 4);
    g.generateTexture('ball', 32, 32);
    g.clear();

    // Esfera de roca: gris con grietas
    g.fillStyle(0x9e9e9e, 1); g.fillCircle(18, 18, 18);
    g.fillStyle(0x757575, 1); g.fillCircle(24, 24, 5); g.fillCircle(10, 26, 3); g.fillCircle(26, 10, 3);
    g.lineStyle(2, 0x616161, 1);
    g.lineBetween(12, 8, 18, 16); g.lineBetween(18, 16, 15, 28);
    g.fillStyle(0xffffff, 0.35); g.fillCircle(11, 11, 4);
    g.generateTexture('roca', 36, 36);
    g.clear();

    // Bloque frágil: adobe con grietas
    g.fillStyle(0xc8844b, 1); g.fillRect(0, 0, 32, 32);
    g.fillStyle(0xe0a070, 1); g.fillRect(0, 0, 32, 4);
    g.lineStyle(2, 0x6b3a1a, 1);
    g.lineBetween(4, 10, 14, 18); g.lineBetween(14, 18, 10, 28);
    g.lineBetween(20, 6, 28, 16); g.lineBetween(26, 24, 18, 30);
    g.generateTexture('fragil', 32, 32);
    g.clear();

    // Nube
    g.fillStyle(0xffffff, 1);
    g.fillCircle(35, 45, 25); g.fillCircle(65, 32, 30); g.fillCircle(96, 45, 24);
    g.fillRect(35, 45, 61, 25);
    g.generateTexture('nube', 130, 70);
    g.clear();

    // Ojo blanco y pupila
    g.fillStyle(0xffffff, 1); g.fillCircle(7, 7, 7);
    g.generateTexture('ojo', 14, 14);
    g.clear();
    g.fillStyle(0x222222, 1); g.fillCircle(3.5, 3.5, 3.5);
    g.generateTexture('pupila', 7, 7);
    g.clear();

    // Moneda dorada
    g.fillStyle(0xffd700, 1); g.fillCircle(10, 10, 10);
    g.fillStyle(0xfff4a3, 1); g.fillCircle(7, 7, 3);
    g.generateTexture('moneda', 20, 20);
    g.clear();

    // Amigos de la Casa del Reencuentro
    [['amigo_azul', 0x42a5f5], ['amigo_verde', 0x66bb6a], ['amigo_amarillo', 0xffca28]].forEach(([key, color]) => {
        g.fillStyle(color, 1); g.fillCircle(14, 14, 14);
        g.generateTexture(key, 28, 28);
        g.clear();
    });

    g.destroy();
}

// ============================================================
// Configuración e inicio
// ============================================================

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
    scene: [Boot, Menu, Juego]
};

const game = new Phaser.Game(config);
