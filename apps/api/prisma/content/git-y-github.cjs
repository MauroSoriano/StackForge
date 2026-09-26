"use strict";
// Contenido del track: Git y GitHub.

/* ===========================================================================
 * ESTRUCTURA DEL OBJETO EXPORTADO (un archivo .cjs = un track del curso)
 * ---------------------------------------------------------------------------
 * module.exports = {
 *   slug:        string   // identificador único del track (clave del seed)
 *   title:       string   // nombre visible del track
 *   description: string   // resumen de lo que enseña el track
 *   type:        string   // TrackType: "JUNIOR" | "MID" | "SENIOR"
 *   order:       number   // posición del track dentro del curso
 *   modules: [            // módulos del track, en orden
 *     {
 *       slug:           string  // identificador del módulo dentro del track
 *       title:          string  // nombre visible del módulo
 *       description:    string  // resumen del módulo
 *       order:          number  // posición del módulo dentro del track
 *       estimatedHours: number  // horas estimadas de trabajo
 *       lessons: [              // lecciones del módulo
 *         {
 *           slug:            string   // identificador de la lección
 *           title:           string   // nombre visible de la lección
 *           markdown:        string   // cuerpo de la lección (texto markdown)
 *           order:           number   // posición de la lección dentro del módulo
 *           durationMinutes: number   // duración estimada en minutos
 *           exercises: [              // ejercicios prácticos de la lección
 *             {
 *               title:        string    // nombre del ejercicio (clave natural del seed)
 *               description:  string    // resumen breve del ejercicio
 *               instructions: string    // consigna detallada para el estudiante
 *               difficulty:   string    // Difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
 *               maxAttempts:  number    // intentos máximos permitidos
 *               requirements: string[]  // requisitos que debe cumplir la entrega
 *               tests:        string[]  // pruebas/verificaciones que se ejecutan
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * NOTA: el contenido de los strings `markdown` es texto del curso y NO debe
 * modificarse desde aquí; este archivo solo aporta datos al seed.
 * ===========================================================================
 */

module.exports = {
  slug: "git-y-github",
  title: "Git y GitHub",
  description:
    "Domina Git desde cero hasta el flujo de trabajo real: repositorio, commits, ramas, merges, conflictos, rebase, remotes, pull requests, integración continua y trabajo en equipo.",
  type: "JUNIOR",
  order: 0,
  modules: [
    {
      slug: "fundamentos-de-git",
      title: "Fundamentos de Git",
      description: "Qué es Git, cómo configurarlo, el repositorio, los commits y el historial.",
      order: 1,
      estimatedHours: 6,
      lessons: [
        {
          slug: "que-es-git",
          title: "¿Qué es Git y por qué importa?",
          order: 1,
          durationMinutes: 40,
          markdown:
            "# ¿Qué es Git?\n\nGit es un **sistema de control de versiones distribuido**: guarda el historial completo de tu proyecto y permite que muchas personas trabajen en paralelo sin pisarse los cambios.\n\nCada vez que haces un **commit** guardas una foto (snapshot) del estado de todos tus archivos, con autor, fecha y un mensaje que explica el cambio. Puedes volver a cualquier foto anterior en cualquier momento.\n\n## Versionado centralizado vs distribuido\n\nEn un sistema **centralizado** (como SVN) existe un único servidor con el historial: si el servidor cae, nadie puede ver el historial.\n\nEn Git, que es **distribuido**, cada persona tiene una copia completa del repositorio en su máquina. Esto significa:\n\n- Puedes trabajar **offline**: commits, ramas y consultas al historial funcionan sin internet.\n- Si el servidor remoto se pierde, cualquiera con un clon puede restaurar todo.\n- La mayoría de las operaciones son locales y por eso son muy rápidas.\n\n## El repositorio\n\nUn **repositorio** (o *repo*) es una carpeta versionada por Git. Toda la información del historial vive en una subcarpeta oculta llamada `.git`.\n\n```bash\ngit init\n```\n\nEste comando convierte la carpeta actual en un repositorio. A partir de ahí Git empieza a observar los archivos.\n\n## Un poco de historia\n\nGit nació en 2005, creado por Linus Torvalds para el desarrollo del kernel de Linux. Necesitaban algo rápido, distribuido y que soportara miles de contribuyentes. Hoy es el estándar de la industria: lo usan prácticamente todos los equipos de software del mundo.\n\n## Las tres zonas de Git\n\nEntender esto es la clave para no perderse:\n\n- **Working directory**: tu carpeta de trabajo, donde editas los archivos.\n- **Staging area** (índice): la antesala del commit; eliges qué cambios entran.\n- **Repositorio local**: el historial de commits ya guardados.\n\n```\nWorking directory  ->  git add  ->  Staging area  ->  git commit  ->  Repositorio\n```\n\n## Por qué importa aprenderlo\n\n- Puedes experimentar sin miedo: siempre hay una versión anterior a la que volver.\n- Es requisito de casi cualquier trabajo de desarrollo.\n- Facilita el trabajo en equipo: ramas, revisiones y merges.\n- Es la base para herramientas como GitHub, GitLab y la integración continua.\n\n## Buenas prácticas desde el día uno\n\n- Haz commits pequeños y frecuentes, no un commit gigante al final.\n- Escribe mensajes claros que expliquen *qué* y *por qué*.\n- Nunca subas secretos (`.env`, llaves, contraseñas).\n- Mantén tu repositorio ordenado con un buen `.gitignore`.\n\n> Tip: ejecuta `git help` o `git <comando> --help` para ver la ayuda de cualquier comando. La documentación está siempre a mano.\n\n## Resumen y práctica\n\nEn esta clase viste qué es Git, por qué es distribuido, qué es un repositorio y las tres zonas. Practica creando una carpeta, ejecutando `git init` y observando cómo aparece la carpeta oculta `.git`.",
          exercises: [
            {
              title: "Inicia tu primer repositorio",
              description: "Convierte una carpeta en un repo Git y observa su estado.",
              instructions:
                "Crea una carpeta nueva, entra en ella e inicializa un repositorio con git init. Verifica que se creó la carpeta oculta .git y ejecuta git status para ver que estás en la rama principal sin commits todavía. Guarda la salida de git status como evidencia.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "Creas una carpeta y ejecutas git init dentro.",
                "Verificas la existencia de la carpeta oculta .git.",
                "Ejecutas git status y muestras su salida.",
              ],
              tests: ["Verificar git init", "Verificar carpeta .git", "Verificar git status"],
            },
          ],
        },
        {
          slug: "instalacion-y-configuracion",
          title: "Instalación y configuración inicial",
          order: 2,
          durationMinutes: 35,
          markdown:
            "# Instalación y configuración inicial\n\nAntes de trabajar necesitas Git instalado y con tu identidad configurada. Git firma cada commit con un nombre y un correo, así que sin esto los commits quedan sin autor claro.\n\n## Verificar la instalación\n\n```bash\ngit --version\n```\n\nSi el comando no existe, instala Git según tu sistema:\n\n- **Windows**: descarga el instalador desde git-scm.com (incluye Git Bash).\n- **macOS**: usa Homebrew (`brew install git`) o las herramientas de línea de comandos de Xcode.\n- **Linux**: con el gestor de paquetes (`sudo apt install git` en Debian/Ubuntu).\n\n## Tu identidad global\n\n```bash\ngit config --global user.name 'Ana Pérez'\ngit config --global user.email 'ana@ejemplo.com'\n```\n\nEl correo debería ser el mismo que usarás en GitHub para que tus commits se te atribuyan.\n\n## Configuraciones recomendadas\n\n```bash\ngit config --global init.defaultBranch main\ngit config --global core.editor 'code --wait'\ngit config --global core.autocrlf input   # o true en Windows\n```\n\n- `init.defaultBranch main` fija el nombre de la rama inicial.\n- `core.editor` define el editor que Git abre para mensajes largos.\n- `core.autocrlf` evita problemas de saltos de línea entre Windows y Linux.\n\n## Atajos (alias)\n\n```bash\ngit config --global alias.st status\ngit config --global alias.lg 'log --oneline --graph --decorate'\n```\n\nAhora `git st` y `git lg` funcionan como atajos. Úsalos con criterio para no olvidar los comandos reales.\n\n## Autenticación con GitHub\n\nPara subir código necesitas autenticarte. Tienes dos opciones principales:\n\n- **HTTPS + token**: GitHub ya no acepta contraseñas; necesitas un *personal access token*.\n- **SSH**: generas una llave `ssh-keygen -t ed25519 -C 'ana@ejemplo.com'`, copias la llave pública a GitHub y trabajas sin escribir credenciales.\n\n```bash\nssh-keygen -t ed25519 -C 'ana@ejemplo.com'\nssh -T git@github.com\n```\n\n## Revisar la configuración\n\n```bash\ngit config --list\n```\n\nEste comando muestra todos los valores activos, útil para depurar por qué un comportamiento no es el esperado.\n\n## Buenas prácticas\n\n- Configura tu identidad real: los commits son tu historial público.\n- Nunca uses el correo de un tercero ni un nombre genérico.\n- Guarda tus llaves SSH en un lugar seguro y protégelas con passphrase.\n\n> Si trabajas en varias cuentas (personal y laboral), puedes usar `git config --local` dentro de cada repo para sobrescribir la identidad global.\n\n## Resumen y práctica\n\nInstala Git, define tu nombre y correo, fija `main` como rama por defecto y verifica todo con `git config --list`.",
          exercises: [
            {
              title: "Configura tu identidad de Git",
              description: "Define nombre, correo y rama por defecto.",
              instructions:
                "Instala Git si no lo tienes, configura user.name y user.email de forma global, define init.defaultBranch como main y confirma con git config --list que los tres valores quedaron guardados.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "Ejecutas git --version correctamente.",
                "Configuras user.name y user.email globales.",
                "Defines init.defaultBranch main.",
                "Muestras los valores con git config --list.",
              ],
              tests: ["Verificar Git instalado", "Verificar identidad configurada", "Verificar rama por defecto"],
            },
          ],
        },
        {
          slug: "primeros-commits",
          title: "Tu primer commit",
          order: 3,
          durationMinutes: 45,
          markdown:
            "# Tu primer commit\n\nUn commit es una foto del estado de tus archivos. Para crearlo pasas por la **staging area**: eliges exactamente qué entra.\n\n## El ciclo básico\n\n```bash\n# 1. Marca qué archivos entran al próximo commit\ngit add index.html estilos.css\n\n# 2. Confirma la foto con un mensaje\ngit commit -m 'agrega pagina de inicio'\n\n# 3. Verifica el historial\ngit log --oneline\n```\n\nPuedes usar `git add .` para agregar todo lo modificado, pero agregar archivo por archivo es más preciso y evita incluir cosas que no querías.\n\n## Qué contiene un commit\n\n- Un identificador único (hash SHA-1).\n- El autor, la fecha y el mensaje.\n- Una referencia a los archivos tal como estaban (la foto).\n- Un puntero al commit anterior (por eso se forma una cadena/historial).\n\n## Buenos mensajes de commit\n\nUn buen mensaje describe **qué** hace el cambio y por qué, en modo imperativo y breve:\n\n- `agrega formulario de login`\n- `corrige redirección tras el logout`\n- `refactoriza validación de tareas`\n\nEvita mensajes como `cambios`, `arreglos` o `final`. No aportan nada al historial.\n\n## Commits atómicos\n\nUn commit atómico representa **un solo cambio lógico**. Si haces varias cosas mezcladas, sepáralas en commits distintos: es mucho más fácil revisar, revertir y entender después.\n\n```bash\ngit add src/login.js\ngit commit -m 'agrega validacion de login'\ngit add README.md\ngit commit -m 'documenta como correr el proyecto'\n```\n\n## Corregir el último commit\n\nSi olvidaste un archivo o el mensaje tiene un error y **aún no subiste** el commit:\n\n```bash\ngit add archivo-olvidado\ngit commit --amend\n```\n\nEl amend reemplaza el último commit por uno nuevo. No lo uses en commits ya publicados, porque reescribe el historial.\n\n## Buenas prácticas\n\n- Commitea seguido: commits pequeños son más fáciles de entender.\n- Revisa con `git status` y `git diff` antes de commitear.\n- Un commit debería poder describirse en una sola frase.\n- Nunca mezcles refactors grandes con cambios funcionales en el mismo commit.\n\n> Regla práctica: si tu mensaje de commit necesita la palabra *y* varias veces, probablemente sean dos commits.\n\n## Resumen y práctica\n\nAprendiste el ciclo `add` → `commit` y qué hace bueno a un commit. Practica creando un archivo, agregándolo y confirmando tu primer commit con un mensaje claro.",
          exercises: [
            {
              title: "Ciclo add y commit",
              description: "Guarda tu primer cambio en el historial.",
              instructions:
                "Crea un archivo nuevo con contenido, agrégalo al staging con git add y crea tu primer commit con git commit -m y un mensaje descriptivo. Verifica con git log --oneline que el commit aparece y con git status que el árbol quedó limpio.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "Creas un archivo con contenido.",
                "Lo agregas al staging con git add.",
                "Creás el commit con un mensaje claro.",
                "Verificas con git log y git status.",
              ],
              tests: ["Verificar git add", "Verificar git commit", "Verificar historial"],
            },
          ],
        },
        {
          slug: "historial-y-estado",
          title: "Historial y estado del working tree",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Historial y estado\n\nSaber leer el estado de tu repositorio es la habilidad más importante del día a día. Git te dice exactamente qué cambió, dónde y cuándo.\n\n## Los comandos de inspección\n\n```bash\ngit status             # estado actual: qué cambió y en qué zona\ngit log --oneline      # historial resumido, un commit por línea\ngit log --oneline --graph --decorate   # historial con ramas\ngit show <commit>      # detalle completo de un commit\ngit diff               # cambios sin stage\ngit diff --staged      # cambios ya en stage\ngit blame archivo      # quién cambió cada línea\n```\n\n## Interpretar git status\n\n- **modified**: el archivo cambió pero todavía no lo agregaste al staging.\n- **Changes to be committed**: el archivo ya está preparado para el próximo commit.\n- **Untracked**: Git ve el archivo pero todavía no lo sigue (nunca lo agregaste).\n\n\n```\nOn branch main\nChanges not staged for commit:\n  modified:   app.js\nUntracked files:\n  notas.txt\n```\n\n## Filtrar el historial\n\n```bash\ngit log --author='Ana'\ngit log --since='2 weeks ago'\ngit log --stat          # archivos tocados por commit\ngit log -p              # diff completo de cada commit\n```\n\n## Deshacer antes de commitear\n\nPara sacar un archivo del staging sin perder los cambios:\n\n```bash\ngit restore --staged archivo.txt\n```\n\nPara descartar los cambios locales de un archivo (¡se pierden!):\n\n```bash\ngit restore archivo.txt\n```\n\n## Buenas prácticas\n\n- Pasa por `git status` antes y después de cada operación.\n- Usa `git diff` para revisar lo que vas a commitear, no commitees a ciegas.\n- Un historial limpio se lee con `git log --oneline`: mantén mensajes claros.\n- Si algo no cuadra, `git status` casi siempre te dice qué hacer.\n\n> Error común: agregar al staging archivos que no querías. Solución: `git restore --staged` para sacarlos sin perder el trabajo.\n\n## Resumen y práctica\n\nDomina `status`, `log`, `diff` y `show`. Son las herramientas de diagnóstico que usarás cientos de veces por semana.",
          exercises: [
            {
              title: "Inspecciona tu historial",
              description: "Lee el estado y el log de tu repositorio.",
              instructions:
                "En un repo con al menos dos commits, ejecuta git log --oneline y muestra la salida. Luego modifica un archivo sin hacer add y muestra git status con el archivo en estado modified, y git diff con los cambios.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "El repo tiene al menos dos commits.",
                "Ejecutas git log --oneline.",
                "git status muestra un archivo modificado.",
                "Ejecutas git diff mostrando los cambios.",
              ],
              tests: ["Verificar dos commits", "Verificar git log", "Verificar git status", "Verificar git diff"],
            },
          ],
        },
        {
          slug: "deshacer-cambios",
          title: "Deshacer cambios con seguridad",
          order: 5,
          durationMinutes: 45,
          markdown:
            "# Deshacer cambios con seguridad\n\nTarde o temprano vas a querer revertir algo. Git tiene varios niveles de *deshacer*, y elegir bien evita perder trabajo irreversiblemente.\n\n## Descartar cambios locales\n\n```bash\ngit restore archivo.txt        # descarta los cambios del archivo (no se puede recuperar)\ngit restore --staged archivo.txt  # lo saca del staging pero conserva los cambios\n```\n\n## Mover el historial: git reset\n\n`git reset` mueve la punta de la rama a otro commit. Tiene tres modos:\n\n```bash\ngit reset --soft HEAD~1   # deshace el commit, deja los cambios en staging\ngit reset --mixed HEAD~1  # deshace el commit, deja los cambios sin staging (modo por defecto)\ngit reset --hard HEAD~1   # deshace el commit Y borra los cambios (peligroso)\n```\n\n`--hard` es destructivo: puede borrar trabajo no commiteado sin posibilidad de recuperarlo. Úsalo solo cuando estés seguro.\n\n## Deshacer sin borrar: git revert\n\n`revert` crea un **commit nuevo** que invierte los cambios de otro commit. No reescribe el historial, por eso es la opción segura en ramas compartidas:\n\n```bash\ngit revert <hash-del-commit>\n```\n\n## Recuperar lo perdido: git reflog\n\nEl `reflog` registra todos los movimientos de HEAD, incluso commits que ya no pertenecen a ninguna rama. Es tu red de seguridad:\n\n```bash\ngit reflog\ngit reset --hard <hash-que-quieres-recuperar>\n```\n\n## Correcciones puntuales\n\n```bash\ngit commit --amend              # corrige el último commit (mensaje o contenido)\ngit restore --source=HEAD~2 archivo.txt  # recupera un archivo de una versión anterior\n```\n\n## Buenas prácticas\n\n- Prefiere `revert` cuando el commit ya está publicado.\n- Reserva `reset --hard` para ramas locales y trabajo tuyo.\n- Antes de cualquier operación destructiva, corre `git status` y `git stash` si dudas.\n- Si crees que perdiste algo, revisa `git reflog` antes de rendirte.\n\n> Regla de oro: lo commiteado casi nunca se pierde; lo no commiteado sí. Commitea temprano para poder deshacer con tranquilidad.\n\n## Resumen y práctica\n\nViste `restore`, `reset` (soft/mixed/hard), `revert` y `reflog`. Practica deshacer un commit con `reset --soft` y recuperarlo con `reflog`.",
          exercises: [
            {
              title: "Deshaz y recupera un commit",
              description: "Practica reset y reflog sin perder trabajo.",
              instructions:
                "Crea un commit, deshazlo con git reset --soft HEAD~1 (los cambios deben quedar en staging) y luego recupera el estado usando git reflog para volver al commit original. Muestra la salida de git log --oneline al final.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Creás al menos un commit de prueba.",
                "Usás git reset (soft o mixed).",
                "Consultás y usás git reflog.",
                "El historial final conserva el commit.",
              ],
              tests: ["Verificar reset", "Verificar reflog", "Verificar historial final"],
            },
          ],
        },
      ],
    },
    {
      slug: "branches-y-merge",
      title: "Branches y merge",
      description: "Ramas, fusión, conflictos, rebase, stash y estrategias de ramificación.",
      order: 2,
      estimatedHours: 7,
      lessons: [
        {
          slug: "trabajar-con-ramas",
          title: "Trabajar con ramas",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# Ramas (branches)\n\nUna **rama** es un puntero móvil a un commit. `main` es la rama principal, y cada rama nueva te permite experimentar sin romper lo que ya funciona.\n\nCrear una rama es instantáneo y barato: no copia archivos, solo crea un puntero.\n\n## HEAD: dónde estás parado\n\n`HEAD` es el puntero a la rama en la que estás trabajando. Cuando haces un commit, la rama a la que apunta HEAD avanza.\n\n## Crear y moverse entre ramas\n\n```bash\ngit branch                    # listar ramas (la actual con *)\ngit switch -c feature/login   # crear rama y moverte a ella (moderno)\ngit checkout -b feature/login # equivalente clásico\ngit switch main               # volver a main\ngit branch -d feature/login   # borrar rama ya fusionada\ngit branch -D feature/login   # forzar borrado (pierde commits no fusionados)\n```\n\n## Nombres de rama\n\nUsa nombres descriptivos y con prefijo según el tipo de trabajo:\n\n- `feature/login`, `feature/carrito`\n- `fix/navbar-mobile`\n- `refactor/api-client`\n- `chore/update-deps`\n\n## Flujo típico\n\n```bash\ngit switch main\ngit pull                    # trae lo último del remoto\ngit switch -c feature/login # rama nueva desde main actualizado\n# ... editas, add, commit ...\ngit switch main\ngit merge feature/login     # integras la rama\ngit branch -d feature/login # limpias\n```\n\n## Buenas prácticas\n\n- Una rama por funcionalidad o bug, corta y enfocada.\n- Mantén `main` siempre en estado desplegable (que se pueda publicar).\n- Actualiza tu rama con `main` con frecuencia para evitar conflictos grandes.\n- Borra las ramas que ya fusionaste.\n\n> Las ramas hacen que experimentar sea seguro: si algo sale mal, `main` sigue intacto.\n\n## Resumen y práctica\n\nAprendiste qué es una rama, qué es HEAD y cómo crear, moverte y borrar ramas. Practica el ciclo desde `main` hasta fusionar una rama.",
          exercises: [
            {
              title: "Rama feature desde main",
              description: "Crea una rama, trabaja en ella y vuelve a main.",
              instructions:
                "Desde main, crea la rama feature/login y muévete a ella. Haz un commit en la rama, vuelve a main con git switch main y verifica que los cambios de la rama no están en main. Lista las ramas con git branch.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Creas la rama feature/login.",
                "Haces al menos un commit en la rama.",
                "Vuelves a main con git switch o git checkout.",
                "Verificas que main no tiene los cambios.",
              ],
              tests: ["Verificar rama creada", "Verificar commit en la rama", "Verificar vuelta a main"],
            },
          ],
        },
        {
          slug: "merge-y-conflictos",
          title: "Merge y resolución de conflictos",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# Merge y conflictos\n\nFusionas una rama con `git merge`. Si las dos ramas avanzaron sin tocar lo mismo, Git hace el merge solo. Cuando ambas modificaron la misma parte de un archivo, Git no puede decidir y aparece un **conflicto**.\n\n## Tipos de merge\n\n- **Fast-forward**: `main` no avanzó desde que creaste la rama; Git solo mueve el puntero. Historial lineal.\n- **Merge commit (3-way)**: ambas ramas avanzaron; Git crea un commit que une las dos historias.\n\n```bash\ngit switch main\ngit merge feature/login\n```\n\n## Cómo se ve un conflicto\n\nCuando hay conflicto, Git marca el archivo así:\n\n```\n<<<<<<< HEAD\nversión de main\n=======\nversión de la rama\n>>>>>>> feature/login\n```\n\n## Resolver un conflicto, paso a paso\n\n1. Ejecuta `git status`: te muestra los archivos en conflicto.\n2. Abre cada archivo y lee **ambas** versiones.\n3. Decide el resultado final (una de las dos o una mezcla).\n4. Borra las marcas `<<<<<<<`, `=======`, `>>>>>>>`.\n5. `git add archivo` para marcar el conflicto resuelto.\n6. `git commit` para cerrar el merge.\n\nSi te complicas, siempre puedes cancelar:\n\n```bash\ngit merge --abort\n```\n\n## Reducir conflictos\n\n- Ramas cortas, fusionadas seguido.\n- Trae `main` a tu rama con frecuencia (`git merge main` o `git rebase main`).\n- Divide el trabajo por archivos/módulos distintos.\n- Commits pequeños: los conflictos grandes nacen de ramas viejas.\n\n> Los conflictos no son errores: son un pedido de decisión. Entiende qué quería cada rama antes de resolver.\n\n## Resumen y práctica\n\nAprendiste fast-forward vs merge commit, cómo leer y resolver conflictos y cómo cancelar un merge. Practica fusionando una rama y resolviendo un conflicto provocado.",
          exercises: [
            {
              title: "Fusiona una rama y resuelve un conflicto",
              description: "Integra cambios y resuelve un conflicto.",
              instructions:
                "Crea una rama feature, modifica un archivo y commitea. Vuelve a main, modifica la misma línea del mismo archivo y commitea. Fusiona la rama en main con git merge, resuelve el conflicto dejando una versión coherente, y cierra el merge con git add y git commit.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Ejecutas git merge entre las ramas.",
                "Provocás y resolvés un conflicto.",
                "El merge queda cerrado con un commit.",
                "main contiene la versión final resuelta.",
              ],
              tests: ["Verificar merge realizado", "Verificar conflicto resuelto", "Verificar main actualizado"],
            },
          ],
        },
        {
          slug: "rebase-stash-reset",
          title: "Rebase, stash y deshacer",
          order: 3,
          durationMinutes: 50,
          markdown:
            "# Rebase, stash y deshacer\n\nHerramientas para mantener un historial ordenado y recuperarte de situaciones incómodas.\n\n## Stash: guardar trabajo sin commitear\n\nCuando tienes cambios a medias y necesitas cambiar de rama, guarda todo temporalmente:\n\n```bash\ngit stash            # guarda y deja el árbol limpio\ngit stash -u         # incluye archivos nuevos (untracked)\ngit stash list       # lista los stashes guardados\ngit stash pop        # recupera el último y lo borra de la lista\ngit stash apply      # recupera sin borrar de la lista\ngit stash drop       # descarta un stash\n```\n\n## Rebase: reorganizar la historia\n\n`rebase` toma tus commits y los vuelve a aplicar sobre otra base, dejando un historial lineal:\n\n```bash\ngit switch feature\ngit rebase main\n```\n\nSi hay conflictos durante el rebase, se resuelven uno por uno y continúas con:\n\n```bash\ngit rebase --continue\ngit rebase --abort   # cancelar todo\n```\n\n## Rebase interactivo\n\nPermite reescribir, reordenar, unir (*squash*) o editar commits:\n\n```bash\ngit rebase -i HEAD~3\n```\n\n## La regla de oro del rebase\n\n**Nunca hagas rebase de commits que ya publicaste** (por ejemplo, sobre `main` compartido). Reescribir commits ajenos rompe el repositorio de los demás. Para ramas públicas usa `merge`; el rebase es para tu rama local antes de compartirla.\n\n## Rebase vs merge\n\n- **Merge**: conserva la historia real, agrega un commit de fusión.\n- **Rebase**: historia lineal y limpia, pero reescribe commits.\n\n## Deshacer\n\n- `git revert <commit>`: commit inverso, seguro en ramas compartidas.\n- `git reset --hard <commit>`: destructivo, solo en ramas locales.\n\n## Buenas prácticas\n\n- Usa `stash` para cambios rápidos; commitea si el trabajo es serio.\n- Aplica rebase solo a tu rama local antes de abrir la pull request.\n- Squashea commits ruidosos antes de fusionar para un historial legible.\n\n> Error común: hacer rebase de una rama que otros ya bajaron. Si el rebase reescribió commits compartidos, todos tendrán que arreglar su repo. Cuando dudes, usa merge.\n\n## Resumen y práctica\n\nPractica `stash`/`stash pop` y un `rebase` de tu rama sobre `main` con un conflicto resuelto.",
          exercises: [
            {
              title: "Guarda trabajo con stash y rebasea tu rama",
              description: "Aplica stash y rebase en un flujo real.",
              instructions:
                "Con un archivo modificado sin commitear, ejecuta git stash, verifica que el árbol quedó limpio, y recupera con git stash pop. Luego crea una rama, hazla divergir de main y actualízala con git rebase main, resolviendo el conflicto si aparece.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Ejecutas git stash con cambios pendientes y recuperas con git stash pop.",
                "Ejecutas git rebase de tu rama sobre main.",
                "El historial de tu rama queda sobre main.",
              ],
              tests: ["Verificar git stash", "Verificar git stash pop", "Verificar rebase aplicado"],
            },
          ],
        },
        {
          slug: "estrategias-de-ramas",
          title: "Estrategias de ramas y flujo de equipo",
          order: 4,
          durationMinutes: 40,
          markdown:
            "# Estrategias de ramas\n\nSaber crear ramas es la mitad; la otra mitad es acordar **cómo** las usa el equipo. Existen modelos probados; elige según el tamaño y la madurez del equipo.\n\n## Trunk-based development\n\nTodos integran cambios pequeños y frecuentes en la rama principal (`main` o *trunk*). Las ramas viven horas o pocos días.\n\n- Ventajas: integración continua real, menos conflictos, feedback rápido.\n- Requiere: buenas pruebas automatizadas y *feature flags* para ocultar trabajo a medias.\n- Ideal para: equipos con CI sólida y despliegue frecuente.\n\n## Git Flow\n\nDefine varias ramas de larga vida con roles claros:\n\n- `main`: solo versiones listas para producción.\n- `develop`: integración del trabajo en curso.\n- `feature/*`: una por funcionalidad, sale de `develop`.\n- `release/*`: preparación de una versión.\n- `hotfix/*`: correcciones urgentes sobre `main`.\n\n- Ventajas: orden para releases versionados y equipos grandes.\n- Desventajas: más ceremonia; puede ralentizar equipos pequeños.\n\n## GitHub Flow\n\nUna sola rama principal más ramas cortas por cambio, integradas por pull request:\n\n1. Crea una rama desde `main`.\n2. Commitea y sube con push.\n3. Abre una pull request.\n4. Revisión y checks automáticos.\n5. Merge a `main` y despliegue.\n\nEs simple y funciona muy bien con despliegue continuo. Hoy es el modelo más popular para equipos web.\n\n## Feature flags\n\nPermiten fusionar código incompleto sin mostrarlo al usuario, activándolo cuando esté listo. Combinan perfecto con trunk-based: integras seguido y decides cuándo se activa cada función.\n\n## Cómo elegir\n\n- Equipo chico, deploy continuo: **GitHub Flow** o **trunk-based**.\n- Producto con versiones y releases formales: **Git Flow**.\n- Lo más importante es acordar el modelo y respetarlo.\n\n> El mejor flujo es el que el equipo entiende y cumple. La herramienta es Git; el proceso lo define el equipo.\n\n## Resumen y práctica\n\nConociste trunk-based, Git Flow y GitHub Flow. Escribe en tu entrega qué estrategia usarías para un equipo de 4 personas con deploy diario y por qué.",
          exercises: [
            {
              title: "Propón un flujo de ramas",
              description: "Elige y justifica una estrategia.",
              instructions:
                "Elige una estrategia de ramas (trunk-based, Git Flow o GitHub Flow) para un equipo de 4 personas que despliega a producción todos los días. Documenta en un archivo ramas.md el flujo paso a paso, los nombres de rama que usarían y por qué elegiste esa estrategia frente a las otras.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Elegís una estrategia concreta.",
                "Describís el flujo paso a paso.",
                "Justificás la elección frente a las alternativas.",
              ],
              tests: ["Verificar archivo ramas.md", "Verificar justificación"],
            },
          ],
        },
      ],
    },
    {
      slug: "github-remotes",
      title: "GitHub y trabajo remoto",
      description: "Remotes, push/pull, pull requests, .gitignore, tags, integración continua y equipo.",
      order: 3,
      estimatedHours: 7,
      lessons: [
        {
          slug: "remotes-push-pull",
          title: "Remotes, push y pull",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# Remotes: trabajar con GitHub\n\nUn **remote** es un repositorio alojado en otro lado (GitHub, GitLab…) al que tu repo local se conecta. El nombre convencional del remoto principal es `origin`.\n\n## Conectar un repo local con GitHub\n\n```bash\ngit remote add origin https://github.com/tu-usuario/mi-proyecto.git\ngit remote -v                       # ver los remotes configurados\ngit push -u origin main             # subir y asociar la rama\n```\n\nEl `-u` (upstream) asocia tu rama local con la remota, así después basta `git push` y `git pull`.\n\n## Clonar un proyecto existente\n\n```bash\ngit clone https://github.com/usuario/repo.git\n```\n\n`clone` descarga el proyecto completo, con todo el historial, y configura `origin` automáticamente.\n\n## push vs fetch vs pull\n\n- `git push`: sube tus commits locales al remoto.\n- `git fetch`: descarga los cambios del remoto **sin** tocar tu working tree.\n- `git pull`: hace `fetch` **y** fusiona (`merge`) en tu rama actual.\n\n```bash\ngit fetch origin\ngit log origin/main --oneline   # inspeccionar antes de fusionar\ngit pull                        # traer y fusionar\n```\n\n## Cuando las ramas divergen\n\nSi alguien subió cambios y tú también, `git pull` puede pedir un merge o un rebase. Trae primero con `--rebase` para un historial más limpio:\n\n```bash\ngit pull --rebase\n```\n\n## Autenticación\n\n- **HTTPS**: requiere un *personal access token* (ya no se aceptan contraseñas).\n- **SSH**: configuras una llave y trabajas sin escribir credenciales.\n\n## Buenas prácticas\n\n- Haz `git pull` antes de empezar a trabajar para evitar divergencias.\n- Nunca hagas `push --force` sobre ramas compartidas.\n- Revisa con `git fetch` + `git log` antes de fusionar cuando algo sea delicado.\n- Escribe un README claro: es la cara de tu proyecto en GitHub.\n\n> `git pull` a ciegas puede fusionar cambios que no querías. En proyectos activos, prefiere `git fetch` y revisa primero.\n\n## Resumen y práctica\n\nConectaste un repo local con GitHub, aprendiste push, fetch, pull y clonar. Practica subiendo tu proyecto con `push -u origin main`.",
          exercises: [
            {
              title: "Sube tu proyecto a GitHub",
              description: "Conecta el repo local con un remoto.",
              instructions:
                "Crea un repositorio vacío en GitHub, agrega el remote origin con su URL, y sube tu rama principal con git push -u origin main. Verifica con git remote -v que origin está configurado y con git log origin/main que el remoto recibió los commits.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Creás un repo en GitHub.",
                "Agregás el remote origin.",
                "Subís la rama principal con push -u.",
                "Verificás el remoto con git remote -v.",
              ],
              tests: ["Verificar remote origin", "Verificar push", "Verificar rama remota"],
            },
          ],
        },
        {
          slug: "pull-requests",
          title: "Pull requests y flujo real",
          order: 2,
          durationMinutes: 45,
          markdown:
            "# Pull requests\n\nEn el trabajo real casi nunca se hace `push` directo a `main`. Se crea una rama, se sube, y se abre una **pull request (PR)**: una propuesta de integración que el equipo revisa antes de fusionar.\n\n## El ciclo completo\n\n```bash\ngit switch -c fix/navbar-mobile\ngit add .\ngit commit -m 'fix: corrige navbar en mobile'\ngit push -u origin fix/navbar-mobile\n```\n\nLuego, en GitHub, abres la PR desde tu rama hacia `main`.\n\n## Qué revisa una buena PR\n\n- Que el cambio resuelva lo que dice resolver.\n- Que el código sea legible y consistente.\n- Que no rompa nada (pruebas y CI en verde).\n- Que no incluya secretos ni archivos generados.\n\n## Una buena descripción de PR\n\n- **Qué** cambia.\n- **Por qué** (contexto, issue que cierra).\n- **Cómo** probarlo (pasos).\n- Capturas si hay cambios visuales.\n\n## Estrategias de merge en GitHub\n\n- **Merge commit**: conserva todos los commits y agrega uno de fusión.\n- **Squash and merge**: une todos los commits de la PR en uno solo. Historial limpio.\n- **Rebase and merge**: reaplica los commits sobre `main` sin commit de fusión.\n\n## Draft PR y revisiones\n\n- Usa **draft** cuando aún no está lista para revisión.\n- Responde los comentarios con nuevos commits (no reescribas lo ya revisado).\n- Vuelve a pedir revisión cuando apliques cambios.\n- Si `main` avanzó, actualiza tu rama con `git merge main` (o `rebase`).\n\n## Ramas protegidas\n\nEn GitHub puedes proteger `main`: exigir PR, aprobaciones y checks de CI antes de permitir el merge. Es la red de seguridad del equipo.\n\n## Buenas prácticas\n\n- PRs pequeñas y enfocadas: se revisan mejor y se fusionan más rápido.\n- Títulos con prefijo `feat:`, `fix:`, `refactor:`.\n- Cierra el issue con `Closes #12` en la descripción.\n- Revisa tu propio diff antes de pedir revisión.\n\n> La pull request es también una herramienta de aprendizaje: las revisiones enseñan mucho a ambos lados.\n\n## Resumen y práctica\n\nAprendiste el ciclo rama → push → PR → revisión → merge. Practica abriendo una PR con una buena descripción.",
          exercises: [
            {
              title: "Ciclo completo con pull request",
              description: "Rama, push y PR como en el trabajo.",
              instructions:
                "Crea una rama nueva, haz un cambio, súbela a GitHub y abre una pull request hacia main. En la descripción explica qué hiciste, por qué y cómo se prueba. Aplica al menos un comentario de revisión simulado y actualiza la rama si main avanzó.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Creás una rama y la subís con push.",
                "Abrís una pull request hacia main.",
                "La descripción explica qué, por qué y cómo probarlo.",
                "La PR incluye al menos un commit con prefijo feat/fix.",
              ],
              tests: ["Verificar rama remota", "Verificar PR abierta", "Verificar descripción"],
            },
          ],
        },
        {
          slug: "gitignore-y-flujo-equipo",
          title: ".gitignore, tags y flujo de equipo",
          order: 3,
          durationMinutes: 40,
          markdown:
            "# Trabajo profesional con Git\n\n## .gitignore\n\nExcluye archivos que no deben versionarse. Un `.gitignore` correcto evita subir secretos y archivos pesados:\n\n```\nnode_modules/\ndist/\n.env\n.env.*\n*.log\n.DS_Store\n```\n\n- Si un archivo ya estaba versionado, hay que quitarlo del índice: `git rm --cached .env`.\n- Puedes tener un `.gitignore` global para tu editor: `git config --global core.excludesfile ~/.gitignore_global`.\n\n## README, LICENSE y CONTRIBUTING\n\nUn repo profesional incluye:\n\n- **README.md**: qué es el proyecto, cómo instalarlo y cómo correrlo.\n- **LICENSE**: los términos de uso (MIT, Apache, etc.).\n- **CONTRIBUTING.md**: cómo contribuir, estilo de código y cómo correr las pruebas.\n\n## Tags y versiones\n\nLos tags marcan puntos importantes, como una release:\n\n```bash\ngit tag v1.0.0\ngit tag -a v1.0.1 -m 'corrige login'\ngit push --tags\n```\n\nSe usa **versionado semántico**: `MAJOR.MINOR.PATCH`.\n\n- MAJOR: cambios incompatibles.\n- MINOR: nuevas funcionalidades compatibles.\n- PATCH: correcciones compatibles.\n\n## Flujo de equipo recomendado\n\n1. `git pull` antes de empezar.\n2. Crea una rama por tarea.\n3. Commits pequeños con mensajes claros.\n4. Push y pull request.\n5. Revisión, aprobación y merge.\n6. Borra la rama y actualiza tu `main`.\n\n## Conventional Commits\n\nConvención de mensajes que facilita generar changelogs y versiones automáticas:\n\n```\nfeat: agrega carrito de compras\nfix: corrige total con descuento\ndocs: actualiza el README\nrefactor: separa el cliente de API\nchore: actualiza dependencias\n```\n\n## Hooks\n\nGit permite ejecutar scripts en eventos (pre-commit, pre-push) para correr linters o pruebas antes de commitear. Herramientas como Husky lo hacen simple.\n\n## Buenas prácticas\n\n- Versiona configuración de ejemplo (`.env.example`), nunca secretos.\n- Mantén el README actualizado: es lo primero que lee quien llega.\n- Usa tags para cada release.\n- Un `.gitignore` desde el primer commit ahorra dolores de cabeza.\n\n> Error común: subir `.env` con credenciales. Si pasa, rota las claves de inmediato y limpia el historial: el secreto ya quedó comprometido.\n\n## Resumen y práctica\n\nAprendiste `.gitignore`, tags, semver, Conventional Commits y el flujo de equipo. Practica creando un `.gitignore` eficaz.",
          exercises: [
            {
              title: "Ignora lo que no debe versionarse",
              description: "Crea un .gitignore eficaz y documenta el proyecto.",
              instructions:
                "Crea un archivo .gitignore que excluya node_modules/, dist/, .env y archivos de log. Verifica con git status que esos archivos no aparecen como untracked. Además, crea un README.md con el nombre del proyecto, requisitos e instrucciones para correrlo, y crea un tag v0.1.0.",
              difficulty: "BEGINNER",
              maxAttempts: 2,
              requirements: [
                "El .gitignore incluye node_modules/, dist/ y .env.",
                "Los archivos ignorados no aparecen en git status.",
                "Existe un README.md con instrucciones.",
                "Creas un tag v0.1.0.",
              ],
              tests: ["Verificar .gitignore", "Verificar exclusión con git status", "Verificar README", "Verificar tag"],
            },
          ],
        },
        {
          slug: "github-actions-ci",
          title: "Integración continua con GitHub Actions",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Integración continua (CI) con GitHub Actions\n\nLa **integración continua** significa que, cada vez que subes código, un servidor corre automáticamente las pruebas, el linter y el build. Así los errores se detectan en minutos, no en producción.\n\n## Qué es GitHub Actions\n\nEs el sistema de CI/CD integrado en GitHub. Se configura con archivos YAML dentro de `.github/workflows/`. Cada **workflow** tiene **jobs**, y cada job tiene **steps**.\n\n## Un workflow de CI básico\n\n```yaml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n      - run: npm run build\n```\n\n## Qué significan las partes\n\n- `on`: los eventos que disparan el workflow (push, pull_request).\n- `runs-on`: el sistema operativo del runner.\n- `steps`: pasos; `uses` usa acciones existentes, `run` ejecuta comandos.\n- `cache: npm`: acelera instalaciones guardando dependencias.\n\n## Checks obligatorios en PRs\n\nPuedes exigir que el workflow pase antes de permitir el merge. Esto garantiza que nunca se fusiona código que rompe las pruebas.\n\n## Secretos\n\nLos valores sensibles (tokens, claves) se guardan en **Settings → Secrets** y se leen con `${{ secrets.NOMBRE }}`. Nunca los pongas en el YAML.\n\n## Más allá de CI: CD\n\nCon **despliegue continuo** puedes publicar automáticamente al fusionar en `main`: subir a un servidor, publicar en un registry, desplegar en la nube. El mismo workflow puede hacerlo con un job adicional.\n\n## Buenas prácticas\n\n- Corre lint, tests y build en cada PR: son la base de la calidad.\n- Mantén los jobs rápidos; cachea dependencias.\n- Fija versiones de las acciones (`@v4`) por reproducibilidad.\n- Falla rápido: pon los chequeos más rápidos primero.\n\n> Un CI en verde es un contrato: el código en `main` compila, pasa las pruebas y se puede desplegar.\n\n## Resumen y práctica\n\nCreaste un workflow de CI que corre en cada push y pull request. Practica agregando `.github/workflows/ci.yml` a tu proyecto.",
          exercises: [
            {
              title: "Configura un pipeline de CI",
              description: "Corre lint, tests y build en cada push.",
              instructions:
                "Crea el archivo .github/workflows/ci.yml con un job que en cada push y pull request: haga checkout, instale Node, ejecute npm ci, npm run lint, npm test y npm run build. Súbelo a GitHub y verifica que el workflow corre y pasa en la pestaña Actions.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "Existe .github/workflows/ci.yml.",
                "El workflow se dispara en push y pull_request.",
                "Corre lint, test y build.",
                "El workflow pasa en GitHub Actions.",
              ],
              tests: ["Verificar archivo de workflow", "Verificar trigger", "Verificar pasos lint/test/build"],
            },
          ],
        },
      ],
    },
  ],
};
