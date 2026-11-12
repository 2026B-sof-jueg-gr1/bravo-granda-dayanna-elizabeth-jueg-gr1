# La Travesía de la Pelotita: Narrativa Oficial (Misión 1: *El Alma del Juego*)

> Escrito para: estudiantes y colaboradores del taller, y lectores de la documentación del repositorio.

## 1. Logline

Una pelotita de goma sin nombre ha perdido el camino de vuelta a casa. Para reencontrarse con sus amigos, deberá rodar por las calles empinadas de Quito, cruzar el calor húmedo del Malecón de Guayaquil y superar cada obstáculo que el camino le ponga, todo para llegar a la *Casa del Reencuentro* antes de que la última luz del día se apague.

## 2. Lore y Sinopsis del Universo

### 2.1 Historia de fondo

Hace mucho tiempo, en un rincón de los Andes y la costa del Pacífico, un grupo de esferas vivía en armonía en la *Casa del Reencuentro*, un lugar en lo alto de una colina donde cada tarde se reunían a contar historias. Una tormenta inesperada dispersó a sus habitantes por todo el territorio. Cada uno cayó en un paisaje distinto, y las historias se fragmentaron.

Nuestra protagonista despierta en el Centro Histórico de Quito, rodeada de fachadas coloniales, balcones de madera y adoquines pulidos por siglos de pasos. Sabe apenas dos cosas: que sus amigos la esperan, y que el camino de regreso está marcado por las señales que cada barrio conserva en sus muros.

### 2.2 Biomas inspirados en Ecuador

| Bioma | Inspiración | Carácter | Desafío principal |
|---|---|---|---|
| **Quito Colonial** | Centro Histórico, calles empinadas y escalinatas | Atardecer cálido, piedra y teja | Cuestas y escalinatas que exigen control |
| **Andes Verdes** | Páramo y valles andinos | Niebla, hierba húmeda, viento constante | Superficies resbaladizas y ráfagas que desvían la trayectoria |
| **Guayaquil Tropical** | Malecón 2000, calles del puerto y el Río Guayas | Calor denso, luz dorada, río y palmeras | Plataformas móviles y bloques frágiles |
| **Costa de Manglar** | Esteros y manglares del litoral | Aguas tranquilas, raíces y bruma | Charcos que frenan el avance y raíces en el camino |

Cada bioma cuenta una parte de la historia. Al completarlo, la pelotita avanza al siguiente, y el mapa se descubre al recorrerlo.

### 2.3 Sistema de personalización: el atuendo del viaje

La pelotita puede vestirse para el viaje. El jugador elige el atuendo antes de comenzar:

- **Chullo andino:** gorro de lana con franjas, para las alturas de Quito.
- **Bufanda:** abriga el cuello en las mañanas frías.
- **Ruana:** poncho de lana con franjas, para el viento del páramo.
- **Sombrero de paja toquilla:** fresco y elegante, para el sol de Guayaquil.
- **Impermeable:** capa amarilla para los esteros y la lluvia del manglar.

Los atuendos son accesorios visuales. Su función es expresiva: cada uno tiene una descripción que lo vincula con su bioma de origen.

### 2.4 Avatares jugables

**La Pelota Clásica (alta movilidad).** Ligera, rápida y con rebote generoso. Responde de inmediato a cada impulso y salta más alto. Su debilidad es que se desvía con facilidad en pendientes y ante ráfagas de viento.

**La Esfera de Roca (peso pesado).** Lenta para arrancar y difícil de frenar. Su inercia la hace ideal para mantener el impulso en tramos llanos y para romper bloques frágiles cuando corre a toda velocidad. Su salto es más bajo y exige planificar cada trayectoria con antelación.

## 3. Resonancia Ludonarrativa

La narrativa y la ingeniería de software comparten una misma idea: un sistema sólido se construye con piezas independientes que se componen entre sí.

- **Biomas como módulos.** Cada bioma es una unidad autónoma, con su propio diseño, reglas de física y contenido. Agregar un bioma nuevo no exige reescribir el resto del proyecto. Esto refleja la modularidad: el cambio queda contenido y el sistema sigue funcionando.

- **Pesos como parámetros de configuración.** La pelota clásica y la esfera de roca comparten la misma lógica de física, con valores distintos de peso, aceleración, fricción y salto. En lugar de duplicar código, el juego define un comportamiento base y lo parametriza.

- **Atuendos como capas desacopladas.** El atuendo cambia la apariencia sin alterar la mecánica del personaje. La apariencia y el comportamiento viven en capas distintas, de modo que se pueden crear nuevos atuendos sin tocar el código de movimiento.

- **Escalabilidad narrativa.** Así como el código crece por incorporación de módulos, la historia crece por incorporación de biomas y personajes. La *Casa del Reencuentro* funciona como un punto de integración: todos los caminos convergen en un mismo destino.

En síntesis, la travesía de la pelotita es también una lección de arquitectura: cada bioma, cada peso y cada atuendo son componentes independientes que, al unirse, forman un viaje completo.
