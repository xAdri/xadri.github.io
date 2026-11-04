const preferredDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let hasStoredTheme = false;
let currentTheme = preferredDarkScheme.matches ? 'dark' : 'light';

try {
  const storedTheme = window.localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    currentTheme = storedTheme;
    hasStoredTheme = true;
  }
} catch {
  // The device preference remains the default when storage is unavailable.
}

document.documentElement.dataset.theme = currentTheme;

const updateThemeControls = () => {
  const isDark = currentTheme === 'dark';
  const isSpanish = document.documentElement.lang === 'es';
  const label = isDark
    ? (isSpanish ? 'Cambiar a modo claro' : 'Switch to light mode')
    : (isSpanish ? 'Cambiar a modo oscuro' : 'Switch to dark mode');

  document.querySelectorAll('.site-theme-toggle').forEach((toggle) => {
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.title = label;
  });
};

const applyTheme = (theme) => {
  currentTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = currentTheme;
  updateThemeControls();
};

const animateThemeChange = (theme) => {
  document.documentElement.classList.add('is-theme-changing');
  applyTheme(theme);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove('is-theme-changing');
    });
  });
};

preferredDarkScheme.addEventListener('change', (event) => {
  if (!hasStoredTheme) animateThemeChange(event.matches ? 'dark' : 'light');
});

const spanishTranslations = new Map(Object.entries({
  'Home': 'Inicio',
  'Works': 'Proyectos',
  'About me': 'Sobre mí',
  'Portfolio': 'Portafolio',
  'Innovation': 'Innovación',
  'Prototypes': 'Prototipos',
  'Engineering': 'Ingeniería',
  'Experiments': 'Experimentos',
  'Selected work': 'Proyectos destacados',
  'Selected projects': 'Proyectos destacados',
  'View all projects': 'Ver todos los proyectos',
  'See more work': 'Ver más proyectos',
  'Loading interactive badge...': 'Cargando acreditación interactiva...',
  'XR Software Engineer': 'Ingeniero de Software XR',
  'Senior XR Software Engineer': 'Ingeniero de software XR sénior',
  'With': 'Con',
  'With +': 'Con +',
  'years of experience in software development, I work with emerging technologies to create immersive products, from initial research and prototyping to software architecture, development, and the final product.': 'años de experiencia en desarrollo de software, trabajo con tecnologías emergentes para crear productos inmersivos, desde la investigación inicial y el prototipado hasta la arquitectura de software, el desarrollo y el producto final.',
  '+ years of experience in software development, I work with emerging technologies to create immersive products, from initial research and prototyping to software architecture, development, and the final product.': '+ años de experiencia en desarrollo de software, trabajo con tecnologías emergentes para crear productos inmersivos, desde la investigación inicial y el prototipado hasta la arquitectura de software, el desarrollo y el producto final.',
  'Explore immersive products, technical prototypes and software engineering work.': 'Explora productos inmersivos, prototipos técnicos y proyectos de ingeniería de software.',
  'Realistic physics and hand interactions designed to make a digital skateboard feel as close to a real one as possible.': 'Físicas realistas e interacción con las manos diseñadas para que un monopatín digital se sienta lo más parecido posible a uno real.',
  'A portable HMI that lets operators control different machines and keep their daily tasks connected to the factory’s existing systems.': 'Una HMI portátil que permite a los operarios controlar distintas máquinas y mantener sus tareas diarias conectadas con los sistemas existentes de la fábrica.',
  'An adaptive mixed reality platform combining gamification and real-time biofeedback for mental health and physical and cognitive rehabilitation.': 'Una plataforma adaptativa de realidad mixta que combina gamificación y biofeedback en tiempo real para la salud mental y la rehabilitación física y cognitiva.',
  'A mixed reality platform using gamification and biofeedback for mental health and physical and cognitive rehabilitation.': 'Una plataforma de realidad mixta que utiliza gamificación y biofeedback para la salud mental y la rehabilitación física y cognitiva.',
  'An industrial metaverse platform for collaborative product design, process simulation and remote quality inspection.': 'Una plataforma de metaverso industrial para el diseño colaborativo de productos, la simulación de procesos y la inspección remota de calidad.',
  'A mixed reality experience using biosensors and biofeedback to support patients managing anxiety before surgery.': 'Una experiencia de realidad mixta que utiliza biosensores y biofeedback para ayudar a los pacientes a gestionar la ansiedad antes de una operación.',
  'Immersive products developed through research, prototyping and production for healthcare, industry and education.': 'Productos inmersivos desarrollados mediante investigación, prototipado y producción para salud, industria y educación.',
  'Playable and technical studies combining game development, interaction design, procedural systems and real-time worlds.': 'Estudios jugables y técnicos que combinan desarrollo de videojuegos, diseño de interacción, sistemas procedurales y mundos en tiempo real.',
  'Software products spanning native applications, backend systems, administration tools and connected services.': 'Productos de software que abarcan aplicaciones nativas, sistemas backend, herramientas de administración y servicios conectados.',
  'Gameplay programming and development for a 2.5D atmospheric puzzle-platformer.': 'Programación y desarrollo de gameplay para un plataformas de puzles atmosférico en 2.5D.',
  'A fast local multiplayer game created collaboratively during a game jam.': 'Un juego multijugador local rápido creado de forma colaborativa durante una game jam.',
  'A compact collaborative game built around timing, atmosphere and focused interaction.': 'Un juego colaborativo compacto construido alrededor del ritmo, la atmósfera y una interacción precisa.',
  'An art-directed Houdini tool for building editable asteroid belts in Unreal Engine.': 'Una herramienta de Houdini con dirección artística para crear cinturones de asteroides editables en Unreal Engine.',
  'A Unity tool that turns layered PSD files into rule-based layouts and editable terrain.': 'Una herramienta de Unity que convierte archivos PSD por capas en distribuciones basadas en reglas y terrenos editables.',
  'Image processing and desktop interface experiments in Python.': 'Experimentos de procesamiento de imágenes e interfaces de escritorio en Python.',
  'A native application centralising workplace documentation, employee services, calendars, medical areas and maps.': 'Una aplicación nativa que centraliza documentación laboral, servicios para empleados, calendarios, áreas médicas y mapas.',
  'Table ordering and home delivery connected to the restaurant backend and administration platform.': 'Pedidos en mesa y a domicilio conectados con el backend y la plataforma de administración del restaurante.',
  'A travel social network combining destination discovery, matching, messaging and shared photographs.': 'Una red social de viajes que combina descubrimiento de destinos, conexiones, mensajería y fotografías compartidas.',
  'A native restaurant experience supported by a Django backend and administration system.': 'Una experiencia nativa para restaurantes respaldada por un backend en Django y un sistema de administración.',
  'A connected application built across the product interface, backend and supporting web services.': 'Una aplicación conectada desarrollada entre la interfaz del producto, el backend y los servicios web de soporte.',
  'A Class IIa certified medical device using AI-powered gameplay to support children with ADHD.': 'Un dispositivo médico certificado de clase IIa que utiliza gameplay impulsado por IA para ayudar a niños con TDAH.',
  'An AI-powered serious game featuring adaptive minigames for children’s cognitive development.': 'Un serious game impulsado por IA con minijuegos adaptativos para el desarrollo cognitivo infantil.',
  'I’m Adrián,': 'Soy Adrián,',
  'My career started in graphic design before moving into software development, real-time 3D and XR. That mix helps me test ideas, choose the right tools and take a project from the first sketch to the final result.': 'Mi trayectoria comenzó en el diseño gráfico antes de pasar al desarrollo de software, el 3D en tiempo real y XR. Esa combinación me ayuda a probar ideas, elegir las herramientas adecuadas y llevar un proyecto desde el primer boceto hasta el resultado final.',
  'I’m always curious about new technology and what can actually be done with it, especially with Unity, new hardware and research. The best part is when it goes beyond the screen and becomes something useful in the real world.': 'Siempre siento curiosidad por las nuevas tecnologías y por lo que realmente se puede hacer con ellas, especialmente con Unity, nuevo hardware e investigación. Lo mejor es cuando van más allá de la pantalla y se convierten en algo útil en el mundo real.',
  'Thanks for taking the time to look through my portfolio and learn more about me and my work! ♥': '¡Gracias por dedicar tiempo a ver mi portafolio y conocer mejor mi trabajo! ♥',
  'Valencia, Spain': 'Valencia, España',
  'Experience': 'Experiencia',
  'Education': 'Formación',
  'Present': 'Actualidad',
  'Feb 2026 — Present': 'Feb 2026 — Actualidad',
  'Oct 2025 — Present': 'Oct 2025 — Actualidad',
  'Jul 2025 — Feb 2026': 'Jul 2025 — Feb 2026',
  'Sep 2024 — Jun 2025': 'Sep 2024 — Jun 2025',
  'Mar 2023 — Aug 2024': 'Mar 2023 — Ago 2024',
  'Mar 2021 — Feb 2023': 'Mar 2021 — Feb 2023',
  'Mar 2019 — May 2019': 'Mar 2019 — May 2019',
  'Mar 2017 — May 2017': 'Mar 2017 — May 2017',
  'Freelance': 'Autónomo',
  'R&D XR Software Engineer': 'Ingeniero de software XR de I+D',
  'Python Technical Art Instructor (PySide & Pipeline Tools)': 'Instructor de arte técnico con Python (PySide y herramientas de pipeline)',
  'Fullstack XR Developer': 'Desarrollador XR full stack',
  'Unity 3D Mobile Developer': 'Desarrollador móvil Unity 3D',
  'Tech Lead R&D Software Department': 'Tech Lead del departamento de software de I+D',
  'Backend Python & Django REST Framework Developer': 'Desarrollador backend Python y Django REST Framework',
  'R&D XR Unity 3D Developer': 'Desarrollador XR Unity 3D de I+D',
  'Graphic Designer': 'Diseñador gráfico',
  'Unity XR application development for digital health R&D, focused on healthcare, rehabilitation, training and industrial solutions.': 'Desarrollo de aplicaciones XR con Unity para I+D en salud digital, centrado en salud, rehabilitación, formación y soluciones industriales.',
  'Python training focused on tool development for artists and developers: Blender add-ons, Houdini tools and PySide interfaces integrated into Unity 6, Unreal Engine 5 and production pipelines. Clients include': 'Formación en Python centrada en el desarrollo de herramientas para artistas y desarrolladores: complementos de Blender, herramientas de Houdini e interfaces PySide integradas en Unity 6, Unreal Engine 5 y pipelines de producción. Entre los clientes se incluyen',
  'Django web and REST API solutions, internal workflow tools with Python and PySide, and XR experiences in Unity.': 'Soluciones web y API REST con Django, herramientas internas de flujo de trabajo con Python y PySide, y experiencias XR en Unity.',
  'Gamified cognitive training for Android and iOS apps built with Unity 3D, including neurorehabilitation exercises, .NET Entity Framework features and Python implementation tools.': 'Entrenamiento cognitivo gamificado para aplicaciones Android e iOS creadas con Unity 3D, con ejercicios de neurorrehabilitación, funcionalidades de .NET Entity Framework y herramientas de implementación en Python.',
  'R&D software leadership, desktop and XR applications for logistics and industry, backend systems with Python and Django, and process automation across departments.': 'Liderazgo de software de I+D, aplicaciones de escritorio y XR para logística e industria, sistemas backend con Python y Django y automatización de procesos entre departamentos.',
  'REST APIs in Python and Django for mobile applications, using Docker, PostgreSQL and DigitalOcean.': 'API REST en Python y Django para aplicaciones móviles, utilizando Docker, PostgreSQL y DigitalOcean.',
  'Gamified rehabilitation exercises in Unity 3D with VR technologies for patients with reduced mobility.': 'Ejercicios gamificados de rehabilitación en Unity 3D con tecnologías de realidad virtual para pacientes con movilidad reducida.',
  'Digital and print design, editorial layout and T-shirt graphics using Photoshop, Illustrator and InDesign.': 'Diseño digital e impreso, maquetación editorial y gráficos para camisetas con Photoshop, Illustrator e InDesign.',
  'Master’s degree in technical art and 3D procedural generation.': 'Máster en arte técnico y generación procedural 3D.',
  'Advanced vocational degree in multiplatform application development.': 'Grado superior en desarrollo de aplicaciones multiplataforma.',
  'Advanced vocational degree in 3D animation, games and interactive environments.': 'Grado superior en animación 3D, juegos y entornos interactivos.',
  'Intermediate vocational degree in digital prepress.': 'Grado medio en preimpresión digital.',
  'Direct interaction': 'Interacción directa',
  'Board physics': 'Físicas del monopatín',
  'Real-time procedural generation': 'Generación procedural en tiempo real',
  'The player controls the virtual skateboard directly with their hands. Finger-scale contact replaces conventional buttons and controllers, keeping the interaction close to the gestures of physical fingerboarding.': 'El jugador controla el monopatín virtual directamente con las manos. El contacto a escala de los dedos sustituye a los botones y mandos convencionales, manteniendo la interacción cercana a los gestos del fingerboarding físico.',
  'Picking up the board, positioning the fingers and attempting a trick all happen in the same mixed reality space, without switching interaction modes.': 'Coger la tabla, colocar los dedos e intentar un truco sucede en el mismo espacio de realidad mixta, sin cambiar de modo de interacción.',
  'The physics system turns small hand movements into force, rotation and momentum. The board responds continuously to finger input, the table and the geometry of each obstacle rather than relying on predefined trick animations.': 'El sistema de físicas convierte pequeños movimientos de la mano en fuerza, rotación e impulso. La tabla responde continuamente a los dedos, a la mesa y a la geometría de cada obstáculo en lugar de depender de animaciones de trucos predefinidas.',
  'This makes every attempt slightly different and keeps balance, timing, collisions and recovery at the centre of the experience.': 'Esto hace que cada intento sea ligeramente distinto y sitúa el equilibrio, el ritmo, las colisiones y la recuperación en el centro de la experiencia.',
  'The environment is built from procedural obstacles instead of fixed assets. In-world controls let the player place a ramp on the physical surface and modify its form and proportions while the geometry updates in real time.': 'El entorno se construye con obstáculos procedurales en lugar de recursos fijos. Los controles dentro del mundo permiten colocar una rampa sobre la superficie física y modificar su forma y proporciones mientras la geometría se actualiza en tiempo real.',
  'The generated obstacle remains immediately playable, creating a continuous loop between level design and interaction: reshape the ramp, test a line and adjust it again without leaving mixed reality.': 'El obstáculo generado se puede usar al instante, creando un ciclo continuo entre diseño de niveles e interacción: modifica la rampa, prueba una línea y vuelve a ajustarla sin salir de la realidad mixta.',
  'direct hand interaction, responsive board physics and a procedural skatepark': 'interacción directa con las manos, físicas reactivas del monopatín y un skatepark procedural',
  'Responsive therapeutic mixed reality': 'Realidad mixta terapéutica adaptativa',
  'Connected care system': 'Sistema asistencial conectado',
  'Research-backed health': 'Salud respaldada por la investigación',
  'The patient uses their hands to interact with gamified activities placed in the real environment, working on emotional regulation, attention, movement and cognitive stimulation.': 'El paciente utiliza las manos para interactuar con actividades gamificadas situadas en el entorno real, trabajando la regulación emocional, la atención, el movimiento y la estimulación cognitiva.',
  'Wearable sensors adapt each scene to the patient in real time, while a connected app lets the therapist monitor and control the session and review the results.': 'Los sensores corporales adaptan cada escena al paciente en tiempo real, mientras una aplicación conectada permite al terapeuta supervisar y controlar la sesión y revisar los resultados.',
  'The workflow connects four parts: the XR application, wearable sensors, the therapist’s control app and a web platform for reviewing session history, results and progress.': 'El flujo conecta cuatro partes: la aplicación XR, los sensores corporales, la aplicación de control del terapeuta y una plataforma web para revisar el historial, los resultados y el progreso de las sesiones.',
  'The technical challenge is synchronizing hand input, biometric data, live streaming and remote controls while keeping every activity responsive. Together, these capabilities support emotional regulation, mindfulness, animal-assisted therapy, and physical, cognitive and occupational rehabilitation.': 'El reto técnico consiste en sincronizar la interacción manual, los datos biométricos, el streaming en directo y los controles remotos manteniendo la respuesta de cada actividad. En conjunto, estas capacidades apoyan la regulación emocional, el mindfulness, la terapia asistida con animales y la rehabilitación física, cognitiva y ocupacional.',
  'The platform builds on peer-reviewed research including': 'La plataforma se apoya en investigaciones revisadas por pares, entre ellas',
  'extended reality for mental health': 'realidad extendida para la salud mental',
  'adaptive mental health metaverses': 'metaversos adaptativos para la salud mental',
  'The underlying experiences were co-designed and evaluated with mental-health professionals from': 'Las experiencias se codiseñaron y evaluaron con profesionales de la salud mental de',
  'as well as therapists and patients. ITI Mind remains a preclinical support platform, not a medical device or a replacement for professional judgement.': 'además de terapeutas y pacientes. ITI Mind sigue siendo una plataforma de apoyo preclínico, no un dispositivo médico ni un sustituto del criterio profesional.',
  ', as well as therapists and patients. ITI Mind remains a preclinical support platform, not a medical device or a replacement for professional judgement.': ', además de terapeutas y pacientes. ITI Mind sigue siendo una plataforma de apoyo preclínico, no un dispositivo médico ni un sustituto del criterio profesional.',
  'mixed reality, real-time biofeedback and live therapist control': 'realidad mixta, biofeedback en tiempo real y control en directo por parte del terapeuta',
  'Biofeedback patients can see': 'Biofeedback que el paciente puede ver',
  'Built inside the hospital': 'Desarrollado dentro del hospital',
  'A pilot in real clinical care': 'Un piloto en atención clínica real',
  'Comfortable, non-invasive sensors capture signals such as heart rate and breathing. Inside the headset, a virtual emotional mascot reflects those signals so the patient can recognise changes in their own state.': 'Sensores cómodos y no invasivos capturan señales como el ritmo cardíaco y la respiración. Dentro del visor, una mascota emocional virtual refleja esas señales para que el paciente pueda reconocer cambios en su propio estado.',
  'Guided relaxation turns that awareness into action. Because the experience uses mixed reality, patients can interact with digital content without losing sight of the hospital room or the people supporting them.': 'La relajación guiada convierte esa conciencia en acción. Como la experiencia utiliza realidad mixta, los pacientes pueden interactuar con contenido digital sin perder de vista la habitación del hospital ni a las personas que los acompañan.',
  'The real hospital room was scanned and integrated into the application, grounding the mixed reality experience in the same space where patients prepare for surgery. My contribution focused on this spatial setup and on developing the responsive mascot that receives and represents the patient’s biofeedback.': 'La habitación real del hospital se escaneó e integró en la aplicación, situando la experiencia de realidad mixta en el mismo espacio donde los pacientes se preparan para la operación. Mi contribución se centró en esta configuración espacial y en desarrollar la mascota reactiva que recibe y representa el biofeedback del paciente.',
  'MixCare brings together ITI and the': 'MixCare reúne a ITI y al',
  'with psycho-oncology specialists from the Spanish Association Against Cancer contributing to the emotional assessment and validation of anxiety-management strategies.': 'con especialistas en psicooncología de la Asociación Española Contra el Cáncer que contribuyen a la evaluación emocional y la validación de estrategias para gestionar la ansiedad.',
  ', with psycho-oncology specialists from the Spanish Association Against Cancer contributing to the emotional assessment and validation of anxiety-management strategies.': ', con especialistas en psicooncología de la Asociación Española Contra el Cáncer que contribuyen a la evaluación emocional y la validación de estrategias para gestionar la ansiedad.',
  'Preoperative anxiety affects more than 40% of patients and can reach 80% in complex procedures such as oncological surgery. Launched in January 2026, the first pilot at Hospital La Fe evaluates comfort, acceptability, patient satisfaction, anxiety reduction and usefulness for clinical staff.': 'La ansiedad preoperatoria afecta a más del 40 % de los pacientes y puede alcanzar el 80 % en procedimientos complejos como la cirugía oncológica. Iniciado en enero de 2026, el primer piloto en el Hospital La Fe evalúa la comodidad, la aceptación, la satisfacción del paciente, la reducción de la ansiedad y la utilidad para el personal clínico.',
  'The goal is to refine the experience through participatory design and explore its future integration into preoperative waiting areas and other hospital settings.': 'El objetivo es perfeccionar la experiencia mediante diseño participativo y explorar su futura integración en zonas de espera preoperatorias y otros entornos hospitalarios.',
  'Read the official project overview at ITI': 'Lee la presentación oficial del proyecto en ITI',
  'One interface across every machine': 'Una interfaz para todas las máquinas',
  'Low latency and safe control': 'Baja latencia y control seguro',
  'CRM synchronized task workflow': 'Flujo de tareas sincronizado con el CRM',
  'The setup has two parts. Operators carry a tablet from one machine to another, while each machine keeps its own fixed screen.': 'La configuración tiene dos partes. Los operarios llevan una tableta de una máquina a otra, mientras cada máquina mantiene su propia pantalla fija.',
  'When they dock the tablet, both screens work together. They can control a trolley, crane or stacker while staying close to the equipment and seeing exactly what it is doing.': 'Al acoplar la tableta, ambas pantallas trabajan juntas. Pueden controlar un carro, una grúa o un apilador permaneciendo cerca del equipo y viendo exactamente qué está haciendo.',
  'Commands reach the machinery in 180 to 220 milliseconds, so the controls feel responsive and predictable across every type of equipment.': 'Las órdenes llegan a la maquinaria en 180–220 milisegundos, por lo que los controles responden de forma rápida y predecible en cualquier tipo de equipo.',
  'A safety system checks every action in the background. If a movement could cause a conflict or put the operation at risk, the machine simply will not carry it out.': 'Un sistema de seguridad comprueba cada acción en segundo plano. Si un movimiento puede provocar un conflicto o poner en riesgo la operación, la máquina simplemente no lo ejecuta.',
  'The CRM assigns a task to an operator and sends it to the HMI. From there, the same task record moves through tool selection, inventory validation, transport and delivery, with every step writing its status back to the shared database.': 'El CRM asigna una tarea a un operario y la envía a la HMI. Desde ahí, el mismo registro avanza por la selección de herramientas, la validación de inventario, el transporte y la entrega, actualizando su estado en la base de datos compartida en cada paso.',
  'The HMI and CRM always work with the same workflow state, so pending and completed operations remain synchronized in real time. When the operator confirms the final action on the machinery, the task is closed in the CRM and recorded as completed.': 'La HMI y el CRM trabajan siempre con el mismo estado del flujo, por lo que las operaciones pendientes y completadas permanecen sincronizadas en tiempo real. Cuando el operario confirma la acción final en la maquinaria, la tarea se cierra en el CRM y queda registrada como completada.',
  'one portable control system': 'un único sistema de control portátil',
  'Back to Innovation': 'Volver a Innovación',
  'Back to Prototypes': 'Volver a Prototipos',
  'Back to Projects': 'Volver a Proyectos',
  '← Back to Innovation': '← Volver a Innovación',
  '← Back to Prototypes': '← Volver a Prototipos',
  '← Back to Projects': '← Volver a Proyectos',
  'Next project: Void of Light →': 'Siguiente proyecto: Void of Light →',
  'Next project: Smart Tooling Intralogistics →': 'Siguiente proyecto: Smart Tooling Intralogistics →',
  'Continue to Ecosidea →': 'Continuar a Ecosidea →',
  'Continue to Sea of Heroes →': 'Continuar a Sea of Heroes →',
  'Continue to Prototypes': 'Continuar a Prototipos',
  'Game development and technical art across playable experiences, real-time worlds and artist-friendly procedural tools.': 'Desarrollo de videojuegos y arte técnico en experiencias jugables, mundos en tiempo real y herramientas procedurales pensadas para artistas.',
  'Game development and technical art across': 'Desarrollo de videojuegos y arte técnico en',
  'playable prototypes, real-time worlds and artist-friendly tools': 'prototipos jugables, mundos en tiempo real y herramientas pensadas para artistas',
  'Technical experiments and procedural studies exploring': 'Experimentos técnicos y estudios procedurales que exploran',
  'real-time worlds, interactive systems and artist-friendly tools': 'mundos en tiempo real, sistemas interactivos y herramientas pensadas para artistas',
  'Procedural asteroid generator': 'Generador procedural de asteroides',
  'Procedural landscape world generator': 'Generador procedural de paisajes',
  'Unity map generator': 'Generador de mapas para Unity',
  'Layered Photoshop maps converted into editable worlds through Python, Houdini and Unreal Engine.': 'Mapas de Photoshop por capas convertidos en mundos editables mediante Python, Houdini y Unreal Engine.',
  'Rule-based layouts and terrain generation using Houdini Engine inside Unity.': 'Distribuciones basadas en reglas y generación de terrenos con Houdini Engine dentro de Unity.',
  'Backend development': 'Desarrollo backend',
  'focused on APIs and server-side systems for': 'centrado en API y sistemas del lado del servidor para',
  'cross-platform mobile applications': 'aplicaciones móviles multiplataforma',
  ', supported by web-based administration tools for internal operations.': ', respaldadas por herramientas web de administración para operaciones internas.',
  'I focus on building': 'Me centro en desarrollar',
  'backend systems, administration tools and APIs consumed by mobile applications': 'sistemas backend, herramientas de administración y API consumidas por aplicaciones móviles',
  '. I also have frontend experience, but': '. También tengo experiencia frontend, pero',
  'backend development is my primary focus': 'el desarrollo backend es mi especialidad principal',
  'combines': 'combina',
  'connects': 'conecta',
  'gives operators': 'ofrece a los operarios',
  'that can be reshaped in real time.': 'que puede modificarse en tiempo real.',
  'to create adaptive health and rehabilitation sessions.': 'para crear sesiones adaptativas de salud y rehabilitación.',
  'for trolleys, cranes and stackers, keeping their work in sync as they move through the factory.': 'para carros, grúas y apiladores, manteniendo su trabajo sincronizado mientras se desplazan por la fábrica.',
  ', by': ', de',
  ', uses': ', utiliza',
  'mixed reality and biofeedback': 'realidad mixta y biofeedback',
  'to help manage preoperative anxiety.': 'para ayudar a gestionar la ansiedad preoperatoria.',
  'and': 'y',
  'Project navigation': 'Navegación de proyectos',
  'Open menu': 'Abrir menú',
  'Close menu': 'Cerrar menú',
  'Copy email': 'Copiar correo',
  'Copy aperezgfx@gmail.com': 'Copiar aperezgfx@gmail.com',
  'Email copied': 'Correo copiado',
  'Social and contact links': 'Enlaces sociales y de contacto',
  'Adrián — Home': 'Adrián — Inicio',
  'Interactive identity badge': 'Acreditación de identidad interactiva',
  'At ITI, I develop products across healthcare, industry and education.': 'Desde ITI, desarrollo productos para los sectores de salud, industria y educación.',
  'Portfolio / 2026': 'Portafolio / 2026',
  'View Fingerboarding XR project': 'Ver el proyecto Fingerboarding XR',
  'View Smart tooling intralogistics project': 'Ver el proyecto Smart Tooling Intralogistics',
  'View the ITI Mind project': 'Ver el proyecto ITI Mind',
  'View the MixCare project': 'Ver el proyecto MixCare',
  'View the Fingerboarding XR interaction at full size': 'Ver la interacción de Fingerboarding XR a tamaño completo',
  'View the procedural ramp editing at full size': 'Ver la edición de la rampa procedural a tamaño completo',
  'View the procedural skatepark generation at full size': 'Ver la generación del skatepark procedural a tamaño completo',
  'View the ITI Mind biofeedback experience at full size': 'Ver la experiencia de biofeedback de ITI Mind a tamaño completo',
  'View the ITI Mind therapeutic interaction at full size': 'Ver la interacción terapéutica de ITI Mind a tamaño completo',
  'View more ITI Mind therapeutic activities at full size': 'Ver más actividades terapéuticas de ITI Mind a tamaño completo',
  'View the ITI Mind digital animal therapy at full size': 'Ver la terapia digital con animales de ITI Mind a tamaño completo',
  'View another ITI Mind mixed reality activity at full size': 'Ver otra actividad de realidad mixta de ITI Mind a tamaño completo',
  'View MixCare in the preoperative environment at full size': 'Ver MixCare en el entorno preoperatorio a tamaño completo',
  'View MixCare being tested inside the operating room at full size': 'Ver las pruebas de MixCare dentro del quirófano a tamaño completo',
  'View the MixCare spatial setup inside the operating room at full size': 'Ver la configuración espacial de MixCare dentro del quirófano a tamaño completo',
  'View the MixCare biofeedback experience at full size': 'Ver la experiencia de biofeedback de MixCare a tamaño completo',
  'View MixCare entering the operating room at full size': 'Ver MixCare entrando en el quirófano a tamaño completo',
  'View the Smart Tooling Intralogistics interface at full size': 'Ver la interfaz de Smart Tooling Intralogistics a tamaño completo',
  'View the Essential crane interface at full size': 'Ver la interfaz de la grúa Essential a tamaño completo',
  'View the smart tooling workflow at full size': 'Ver el flujo de Smart Tooling a tamaño completo',
  'View the smart tooling installation at full size': 'Ver la instalación de Smart Tooling a tamaño completo',
  'View the trolley cassette workflow at full size': 'Ver el flujo del cassette del carro a tamaño completo',
  'View the Enterprise automated storage system at full size': 'Ver el sistema automatizado de almacenamiento Enterprise a tamaño completo',
  'Visit Masutapp.com': 'Visitar Masutapp.com',
  'About Adrián Pérez': 'Sobre Adrián Pérez',
  'Photographs of Adrián Pérez': 'Fotografías de Adrián Pérez',
  'Adrián Pérez in Santiago de Compostela': 'Adrián Pérez en Santiago de Compostela',
  'Adrián Pérez smiling outdoors': 'Adrián Pérez sonriendo al aire libre',
  'Adrián Pérez in the mountains': 'Adrián Pérez en la montaña',
  'Adrián Pérez using a Meta Quest headset in a hospital operating room': 'Adrián Pérez utilizando un visor Meta Quest en un quirófano',
  'ITI logo': 'Logotipo de ITI',
  'Many-Worlds logo': 'Logotipo de Many-Worlds',
  'Sincrolab logo': 'Logotipo de Sincrolab',
  'USA Flexo Solutions logo': 'Logotipo de USA Flexo Solutions',
  'Rudo Apps logo': 'Logotipo de Rudo Apps',
  'LabLENI logo': 'Logotipo de LabLENI',
  'Imprenta Rocher logo': 'Logotipo de Imprenta Rocher',
  'TechArt Worlds logo': 'Logotipo de TechArt Worlds',
  'Florida Universitària logo': 'Logotipo de Florida Universitària',
  'FP La Safor logo': 'Logotipo de FP La Safor',
  'Engineering projects': 'Proyectos de ingeniería',
  'Technical experiments': 'Experimentos técnicos',
  'Game prototypes and technical art projects': 'Prototipos de videojuegos y proyectos de arte técnico',
  'Software systems projects': 'Proyectos de sistemas de software',
  'STM Ford mobile application': 'Aplicación móvil STM Ford',
  'Hundred Burgers ordering application': 'Aplicación de pedidos de Hundred Burgers',
  'Chatripp travel social application': 'Aplicación social de viajes Chatripp',
  'The Fitzgerald mobile application': 'Aplicación móvil de The Fitzgerald',
  'Procedural Asteroid Generator animation': 'Animación del generador procedural de asteroides',
  'PSD layers converted into a procedural map': 'Capas PSD convertidas en un mapa procedural',
  'Procedural map generator in Unity': 'Generador procedural de mapas en Unity',
  'PhotoPython image processing experiment': 'Experimento de procesamiento de imágenes PhotoPython',
  'Fingerboarding XR running on a table with a virtual skateboard, ramp and editing controls': 'Fingerboarding XR ejecutándose sobre una mesa con un monopatín virtual, una rampa y controles de edición',
  'Procedural skatepark tools': 'Herramientas de skatepark procedural',
  'A procedural Fingerboarding XR ramp being placed and adjusted on a real table': 'Una rampa procedural de Fingerboarding XR colocándose y ajustándose sobre una mesa real',
  'A procedural skatepark being generated in mixed reality on a real table': 'Un skatepark procedural generándose en realidad mixta sobre una mesa real',
  'Hand-drawn portrait of Adrián Pérez with a handwritten greeting': 'Retrato dibujado a mano de Adrián Pérez con un saludo manuscrito',
  'Fingerboarding XR procedural ramp and physics prototype': 'Prototipo de rampa procedural y físicas de Fingerboarding XR',
  'HMI Smart tooling intralogistics': 'HMI de Smart Tooling Intralogistics',
  'ITI Mind mixed reality rehabilitation experience': 'Experiencia de rehabilitación en realidad mixta ITI Mind',
  'ITI Mind augmented reality rehabilitation experience': 'Experiencia de rehabilitación en realidad aumentada ITI Mind',
  'Ecosidea collaborative metaverse environment': 'Entorno de metaverso colaborativo Ecosidea',
  'MixCare immersive healthcare application': 'Aplicación inmersiva de salud MixCare',
  'ITI Mind mixed reality experience with a digital companion and a biofeedback heart': 'Experiencia de realidad mixta ITI Mind con un compañero digital y un corazón de biofeedback',
  'Hand interaction with gamified therapeutic elements in ITI Mind': 'Interacción manual con elementos terapéuticos gamificados en ITI Mind',
  'Colourful interactive characters used in an ITI Mind mixed reality activity': 'Personajes interactivos de colores utilizados en una actividad de realidad mixta de ITI Mind',
  'ITI Mind immersive therapeutic activities': 'Actividades terapéuticas inmersivas de ITI Mind',
  'Interacting with a digital horse in the ITI Mind mixed reality experience': 'Interacción con un caballo digital en la experiencia de realidad mixta ITI Mind',
  'Interactive glowing elements placed in the real environment by ITI Mind': 'Elementos luminosos interactivos colocados por ITI Mind en el entorno real',
  'Patient wearing a mixed reality headset while clinical staff prepare the MixCare experience': 'Paciente con un visor de realidad mixta mientras el personal clínico prepara la experiencia MixCare',
  'Adrián Pérez testing MixCare with a mixed reality headset inside an operating room': 'Adrián Pérez probando MixCare con un visor de realidad mixta dentro de un quirófano',
  'Adrián Pérez testing the MixCare spatial setup inside an operating room at Hospital La Fe': 'Adrián Pérez probando la configuración espacial de MixCare en un quirófano del Hospital La Fe',
  'MixCare clinical pilot at Hospital La Fe': 'Piloto clínico de MixCare en el Hospital La Fe',
  'MixCare mixed reality relaxation and biofeedback experience': 'Experiencia de relajación y biofeedback en realidad mixta MixCare',
  'Patient wearing a mixed reality headset while entering an operating room at Hospital La Fe': 'Paciente con un visor de realidad mixta entrando en un quirófano del Hospital La Fe',
  'Void of Light environment': 'Entorno de Void of Light',
  'Age of Warfare animated gameplay': 'Gameplay animado de Age of Warfare',
  'Bonfire Brothers animated gameplay': 'Gameplay animado de Bonfire Brothers',
  'Smart Tooling Intralogistics operator interface': 'Interfaz de operador de Smart Tooling Intralogistics',
  'Operator using the Essential HMI tablet beside the industrial crane controls': 'Operario utilizando la tableta HMI Essential junto a los controles de la grúa industrial',
  'CRM synchronized smart tooling workflow': 'Flujo de Smart Tooling sincronizado con el CRM',
  'Smart tooling production installations': 'Instalaciones de producción de Smart Tooling',
  'Industrial smart tooling HMI installed on production machinery': 'HMI industrial de Smart Tooling instalada en maquinaria de producción',
  'Smart tooling HMI showing the trolley cassette workflow on industrial machinery': 'HMI de Smart Tooling mostrando el flujo del cassette del carro en maquinaria industrial',
  'Enterprise automated storage system operating across industrial warehouse racks': 'Sistema automatizado de almacenamiento Enterprise operando entre estanterías industriales',
  'Sea of Heroes: New World cognitive training game': 'Juego de entrenamiento cognitivo Sea of Heroes: New World',
  'Map Generator from PSD in Unity': 'Generador de mapas desde PSD en Unity',
  'Lunar Adventure serious game': 'Serious game Lunar Adventure',
  'Works — Adrián Pérez': 'Proyectos — Adrián Pérez',
  'About me — Adrián Pérez': 'Sobre mí — Adrián Pérez',
  'Engineering — Adrián Pérez': 'Ingeniería — Adrián Pérez',
  'Experiments — Adrián Pérez': 'Experimentos — Adrián Pérez',
  'Prototypes — Adrián Pérez': 'Prototipos — Adrián Pérez',
  'Adrián Pérez — Portfolio': 'Adrián Pérez — Portafolio',
  'I’m Adrián Pérez, a senior XR software engineer in R&D with +7 years in the industry, focused on creative ways to apply emerging technologies across healthcare, industry and education.': 'Soy Adrián Pérez, ingeniero de software XR sénior en I+D con más de 7 años en el sector, centrado en aplicar de forma creativa tecnologías emergentes en salud, industria y educación.',
  'Selected innovation, prototype and engineering projects by XR Software Engineer Adrián Pérez.': 'Proyectos seleccionados de innovación, prototipado e ingeniería del ingeniero de software XR Adrián Pérez.',
  'About Adrián Pérez and his experience as a senior XR software engineer in R&D across immersive systems, healthcare, industry and education.': 'Sobre Adrián Pérez y su experiencia como ingeniero de software XR sénior en I+D de sistemas inmersivos para salud, industria y educación.',
  'Backend systems, administration tools and APIs for mobile applications, with additional frontend experience.': 'Sistemas backend, herramientas de administración y API para aplicaciones móviles, además de experiencia frontend.',
  'Technical experiments, procedural systems and real-time studies by Adrián Pérez.': 'Experimentos técnicos, sistemas procedurales y estudios en tiempo real de Adrián Pérez.',
  'Game development and playable prototypes by Adrián Pérez.': 'Desarrollo de videojuegos y prototipos jugables de Adrián Pérez.',
  'Game development, technical art and procedural world projects.': 'Proyectos de desarrollo de videojuegos, arte técnico y mundos procedurales.',
  'Fingerboarding XR combines direct hand interaction, responsive skateboard physics and a procedural skatepark that can be edited in real time.': 'Fingerboarding XR combina interacción directa con las manos, físicas reactivas del monopatín y un skatepark procedural editable en tiempo real.',
  'ITI Mind combines mixed reality, natural interaction and biofeedback to support emotional wellbeing and physical or cognitive rehabilitation.': 'ITI Mind combina realidad mixta, interacción natural y biofeedback para apoyar el bienestar emocional y la rehabilitación física o cognitiva.',
  'MixCare combines mixed reality, non-invasive sensors and biofeedback to help patients manage anxiety before surgery while remaining connected to their surroundings.': 'MixCare combina realidad mixta, sensores no invasivos y biofeedback para ayudar a los pacientes a gestionar la ansiedad antes de una operación sin desconectarse de su entorno.',
  'A shared control system that lets operators use the same tablet across trolleys, cranes and stackers while their work stays in sync with the company’s CRM.': 'Un sistema de control compartido que permite utilizar la misma tableta en carros, grúas y apiladores mientras el trabajo permanece sincronizado con el CRM de la empresa.'
}));

let currentLanguage = 'en';
try {
  currentLanguage = window.localStorage.getItem('portfolio-language') === 'es' ? 'es' : 'en';
} catch {
  currentLanguage = 'en';
}

const originalTextByNode = new WeakMap();
const originalAttributesByElement = new WeakMap();
const translatableAttributes = [
  'aria-label',
  'title',
  'alt',
  'data-underline',
  'data-badge-role',
  'data-badge-back-label',
  'data-badge-back-title',
  'data-badge-back-copy',
];

const normaliseTranslationKey = (value) => value.replace(/\s+/g, ' ').trim();

const translateValue = (value, language) => {
  if (language !== 'es') return value;
  return spanishTranslations.get(normaliseTranslationKey(value)) || value;
};

const applyLanguage = (language) => {
  currentLanguage = language === 'es' ? 'es' : 'en';
  document.documentElement.lang = currentLanguage;

  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parentTag = node.parentElement?.tagName;
      if (!node.nodeValue.trim() || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(parentTag)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let textNode = walker.nextNode();
  while (textNode) {
    if (!originalTextByNode.has(textNode)) originalTextByNode.set(textNode, textNode.nodeValue);
    const originalValue = originalTextByNode.get(textNode);
    if (currentLanguage === 'en') {
      textNode.nodeValue = originalValue;
    } else {
      const leadingSpace = originalValue.match(/^\s*/)?.[0] || '';
      const trailingSpace = originalValue.match(/\s*$/)?.[0] || '';
      textNode.nodeValue = `${leadingSpace}${translateValue(originalValue, currentLanguage)}${trailingSpace}`;
    }
    textNode = walker.nextNode();
  }

  document.querySelectorAll(translatableAttributes.map((attribute) => `[${attribute}]`).join(','))
    .forEach((element) => {
      let originals = originalAttributesByElement.get(element);
      if (!originals) {
        originals = {};
        originalAttributesByElement.set(element, originals);
      }

      translatableAttributes.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
        element.setAttribute(attribute, currentLanguage === 'en'
          ? originals[attribute]
          : translateValue(originals[attribute], currentLanguage));
      });
    });

  document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]')
    .forEach((element) => {
      let originals = originalAttributesByElement.get(element);
      if (!originals) {
        originals = {};
        originalAttributesByElement.set(element, originals);
      }
      if (!('content' in originals)) originals.content = element.content;
      element.content = currentLanguage === 'en' ? originals.content : translateValue(originals.content, currentLanguage);
    });

  document.querySelectorAll('.home-language-toggle').forEach((toggle) => {
    const isEnglish = currentLanguage === 'en';
    toggle.classList.toggle('is-english', isEnglish);
    toggle.querySelector('.home-language-code').textContent = isEnglish ? 'EN' : 'ES';
    toggle.setAttribute('aria-label', isEnglish ? 'Cambiar a español' : 'Switch to English');
    toggle.title = isEnglish ? 'Español' : 'English';
  });

  document.querySelectorAll('.site-header-menu').forEach((header) => {
    const menuToggle = header.querySelector('.site-menu-toggle');
    if (!menuToggle) return;
    const isOpen = header.classList.contains('is-menu-open');
    menuToggle.setAttribute('aria-label', currentLanguage === 'es'
      ? (isOpen ? 'Cerrar menú' : 'Abrir menú')
      : (isOpen ? 'Close menu' : 'Open menu'));
  });

  updateThemeControls();

  window.dispatchEvent(new CustomEvent('portfolio-language-change', {
    detail: { language: currentLanguage },
  }));
};

const siteNavigation = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'works', label: 'Works', href: 'works.html' },
  { id: 'about', label: 'About me', href: 'about.html' },
];

const sectionByPage = {
  'index.html': 'home',
  'works.html': 'works',
  'iti-mind.html': 'works',
  'mixcare.html': 'works',
  'smart-tooling-intralogistics.html': 'works',
  'prototypes.html': 'works',
  'fingerboarding-xr.html': 'works',
  'games.html': 'works',
  'experiments.html': 'works',
  'engineering.html': 'works',
  'software.html': 'works',
  'about.html': 'about',
};

const currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
let menuScrollPosition = 0;

const lockSiteMenuScroll = () => {
  if (document.body.classList.contains('is-site-menu-open')) return;
  menuScrollPosition = window.scrollY;
  document.documentElement.classList.add('is-site-menu-open');
  document.body.classList.add('is-site-menu-open');
  document.body.style.top = `-${menuScrollPosition}px`;
};

const unlockSiteMenuScroll = () => {
  if (!document.body.classList.contains('is-site-menu-open')) return;
  document.documentElement.classList.remove('is-site-menu-open');
  document.body.classList.remove('is-site-menu-open');
  document.body.style.top = '';
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, menuScrollPosition);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
};

document.querySelectorAll('[data-site-header]').forEach((header, headerIndex) => {
  const activeSection = header.dataset.activeSection || sectionByPage[currentPage] || 'home';
  const actionsId = `site-header-actions-${headerIndex}`;
  const navigationLinks = siteNavigation.map(({ id, label, href }) => {
    const currentAttribute = id === activeSection ? ' aria-current="page"' : '';
    return `<a href="${href}" data-underline="${label}"${currentAttribute}>${label}</a>`;
  }).join('');

  header.innerHTML = `<a class="site-brand" href="/" aria-label="Adrián — Home">
      <img src="favicon.svg" alt="" aria-hidden="true">
      <span class="site-brand-name">DRIÁN</span>
    </a>
    <button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="${actionsId}"
      aria-label="Open menu"><span></span><span></span></button>
    <button class="site-menu-backdrop" type="button" aria-label="Close menu" tabindex="-1"></button>
    <div class="site-header-actions" id="${actionsId}">
      <div class="site-navigation-links">${navigationLinks}</div>
      <div class="site-preference-controls">
        <button class="site-theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false" title="Switch to dark mode">
          <img class="site-theme-icon site-theme-icon--dark" src="assets/night-mode.png" alt="" aria-hidden="true">
          <img class="site-theme-icon site-theme-icon--light" src="assets/contrast.png" alt="" aria-hidden="true">
        </button>
        <button class="home-language-toggle is-english" type="button" aria-label="Cambiar a español" title="Español">
          <span class="home-language-flag" aria-hidden="true"></span>
          <span class="home-language-code">EN</span>
        </button>
      </div>
    </div>`;

  const menuToggle = header.querySelector('.site-menu-toggle');
  const menuBackdrop = header.querySelector('.site-menu-backdrop');
  const menuActions = header.querySelector('.site-header-actions');
  const siteBrand = header.querySelector('.site-brand');
  const mobileMenuQuery = window.matchMedia('(max-width: 768px)');
  const setMenuAccessibility = (isOpen) => {
    if (!mobileMenuQuery.matches) {
      menuActions.removeAttribute('aria-hidden');
      menuActions.removeAttribute('aria-modal');
      menuActions.removeAttribute('role');
      menuActions.inert = false;
      siteBrand.inert = false;
      return;
    }
    menuActions.setAttribute('role', 'dialog');
    menuActions.setAttribute('aria-hidden', String(!isOpen));
    menuActions.toggleAttribute('aria-modal', isOpen);
    menuActions.inert = !isOpen;
    siteBrand.inert = isOpen;
  };
  const closeMenu = () => {
    if (!header.classList.contains('is-menu-open')) return;
    header.classList.remove('is-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', currentLanguage === 'es' ? 'Abrir menú' : 'Open menu');
    setMenuAccessibility(false);
    unlockSiteMenuScroll();
    if (mobileMenuQuery.matches) menuToggle.focus({ preventScroll: true });
  };

  setMenuAccessibility(false);

  menuToggle.addEventListener('click', () => {
    const isOpening = !header.classList.contains('is-menu-open');
    header.classList.toggle('is-menu-open', isOpening);
    menuToggle.setAttribute('aria-expanded', String(isOpening));
    menuToggle.setAttribute('aria-label', currentLanguage === 'es'
      ? (isOpening ? 'Cerrar menú' : 'Abrir menú')
      : (isOpening ? 'Close menu' : 'Open menu'));
    setMenuAccessibility(isOpening);
    if (isOpening) {
      lockSiteMenuScroll();
    } else {
      unlockSiteMenuScroll();
    }
  });

  menuBackdrop.addEventListener('click', closeMenu);

  header.querySelectorAll('.site-navigation-links a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key !== 'Tab' || !header.classList.contains('is-menu-open')) return;
    const focusableItems = [
      menuToggle,
      ...menuActions.querySelectorAll('a[href], button:not([disabled])'),
    ];
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];
    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  mobileMenuQuery.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
    setMenuAccessibility(false);
  });

  const languageToggle = header.querySelector('.home-language-toggle');
  const themeToggle = header.querySelector('.site-theme-toggle');
  applyTheme(currentTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    hasStoredTheme = true;
    try {
      window.localStorage.setItem('portfolio-theme', nextTheme);
    } catch {
      // The theme still changes for this page when storage is unavailable.
    }
    animateThemeChange(nextTheme);
  });

  languageToggle?.addEventListener('click', () => {
    const nextLanguage = currentLanguage === 'en' ? 'es' : 'en';
    try {
      window.localStorage.setItem('portfolio-language', nextLanguage);
    } catch {
      // The language still changes for this page when storage is unavailable.
    }
    applyLanguage(nextLanguage);
  });
});

document.querySelectorAll('[data-site-footer]').forEach((footer) => {
  footer.innerHTML = `
    <nav class="social-links" aria-label="Social and contact links">
      <a href="https://www.linkedin.com/in/aperezgfx" target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src="icons/linkedin.png" alt="" aria-hidden="true"></a>
      <a href="https://www.youtube.com/@adrixnperez" target="_blank" rel="noreferrer" aria-label="YouTube"><img src="icons/youtube.png" alt="" aria-hidden="true"></a>
      <span class="email-copy-control">
        <button class="footer-email-copy" type="button" aria-label="Copy aperezgfx@gmail.com" title="Copy email"><img src="icons/email.png" alt="" aria-hidden="true"></button>
        <span class="copy-toast" role="status" aria-live="polite"></span>
      </span>
      <a href="https://www.artstation.com/adriperez" target="_blank" rel="noreferrer" aria-label="ArtStation"><img src="icons/artstation.png" alt="" aria-hidden="true"></a>
      <a href="https://adriperez.itch.io/" target="_blank" rel="noreferrer" aria-label="Itch.io"><img src="icons/itchio.png" alt="" aria-hidden="true"></a>
    </nav>
    <p class="footer-meta">Adrián Pérez © 2026</p>`;

  const emailButton = footer.querySelector('.footer-email-copy');
  const copyToast = footer.querySelector('.copy-toast');
  let toastTimer;

  emailButton.addEventListener('click', async () => {
    const email = 'aperezgfx@gmail.com';

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = email;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand('copy');
      temporaryInput.remove();
    }

    window.clearTimeout(toastTimer);
    copyToast.classList.remove('is-visible');
    copyToast.textContent = currentLanguage === 'es' ? 'Correo copiado' : 'Email copied';
    void copyToast.offsetWidth;
    copyToast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => {
      copyToast.classList.remove('is-visible');
      copyToast.textContent = '';
    }, 1500);
  });
});

applyLanguage(currentLanguage);

const waitForMedia = (media) => {
  if (media instanceof HTMLImageElement) {
    if (media.complete) return Promise.resolve();
    return new Promise((resolve) => {
      media.addEventListener('load', resolve, { once: true });
      media.addEventListener('error', resolve, { once: true });
    });
  }

  if (media instanceof HTMLVideoElement) {
    if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
    return new Promise((resolve) => {
      media.addEventListener('loadeddata', resolve, { once: true });
      media.addEventListener('error', resolve, { once: true });
    });
  }

  return Promise.resolve();
};

const projectItems = document.querySelectorAll('.project');
const caseStudyMediaItems = document.querySelectorAll('.case-study-media');
const mediaLoaderBlob = projectItems.length || caseStudyMediaItems.length
  ? fetch('assets/loading.gif')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load the media loader');
        return response.blob();
      })
      .catch(() => null)
  : Promise.resolve(null);

const loadMediaFrame = (frame, media) => {
  let loaderStartTimer;
  let individualLoaderUrl;

  mediaLoaderBlob.then((loaderBlob) => {
    if (!loaderBlob || !frame || frame.classList.contains('is-media-loaded')) return;

    const randomStartDelay = Math.random() * 1400;
    loaderStartTimer = window.setTimeout(() => {
      if (frame.classList.contains('is-media-loaded')) return;

      individualLoaderUrl = URL.createObjectURL(loaderBlob);
      frame.style.backgroundImage = `url("${individualLoaderUrl}")`;
    }, randomStartDelay);
  });

  waitForMedia(media).then(() => {
    window.clearTimeout(loaderStartTimer);
    frame?.classList.add('is-media-loaded');

    if (individualLoaderUrl) {
      window.setTimeout(() => {
        frame.style.removeProperty('background-image');
        URL.revokeObjectURL(individualLoaderUrl);
      }, 700);
    }
  });
};

projectItems.forEach((item) => {
  const media = item.querySelector('img, video');
  loadMediaFrame(media?.closest('.project-cover'), media);
});

caseStudyMediaItems.forEach((frame) => {
  loadMediaFrame(frame, frame.querySelector('img, video'));
});

document.querySelectorAll('.about-gallery-item').forEach((item) => {
  const media = item.querySelector('img, video');
  waitForMedia(media).then(() => item.classList.add('is-loaded'));
});

requestAnimationFrame(() => {
  projectItems.forEach((item) => item.classList.add('is-loaded'));
  document.querySelectorAll('.case-study > .case-study-section, .case-study > .case-study-topics, .case-study > .case-study-gallery, .case-study > .case-study-nav')
    .forEach((content) => content.classList.add('is-loaded'));
  document.querySelectorAll('.about-copy, .resume').forEach((content) => content.classList.add('is-loaded'));
});

document.querySelectorAll('[data-language-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const switchingToSpanish = button.dataset.currentLanguage === 'en';

    button.dataset.currentLanguage = switchingToSpanish ? 'es' : 'en';
    button.querySelector('[aria-hidden="true"]').textContent = switchingToSpanish ? '🇪🇳' : '🇪🇸';
    button.setAttribute('aria-label', switchingToSpanish ? 'Switch to English' : 'Cambiar a español');
    button.title = switchingToSpanish ? 'English' : 'Español';
  });
});

const lightboxTriggers = document.querySelectorAll('[data-media-lightbox]');

if (lightboxTriggers.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'media-lightbox';
  lightbox.setAttribute('aria-label', 'Expanded project media');
  lightbox.innerHTML = '<div class="media-lightbox-stage"><img class="media-lightbox-image media-lightbox-content" alt="" hidden><video class="media-lightbox-video media-lightbox-content" muted loop playsinline hidden></video><button class="media-lightbox-close" type="button" aria-label="Close expanded media"></button><button class="media-lightbox-arrow media-lightbox-arrow--previous" type="button" aria-label="View previous project media"></button><button class="media-lightbox-arrow media-lightbox-arrow--next" type="button" aria-label="View next project media"></button></div>';
  document.body.append(lightbox);

  const triggers = Array.from(lightboxTriggers);
  const lightboxImage = lightbox.querySelector('.media-lightbox-image');
  const lightboxVideo = lightbox.querySelector('.media-lightbox-video');
  const closeButton = lightbox.querySelector('.media-lightbox-close');
  const previousButton = lightbox.querySelector('.media-lightbox-arrow--previous');
  const nextButton = lightbox.querySelector('.media-lightbox-arrow--next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let activeLightboxMedia = null;
  let mediaRequestId = 0;

  lightbox.classList.toggle('has-single-media', triggers.length < 2);

  const fitLightboxMedia = () => {
    if (!activeLightboxMedia) return;

    const mediaWidth = activeLightboxMedia instanceof HTMLVideoElement
      ? activeLightboxMedia.videoWidth
      : activeLightboxMedia.naturalWidth;
    const mediaHeight = activeLightboxMedia instanceof HTMLVideoElement
      ? activeLightboxMedia.videoHeight
      : activeLightboxMedia.naturalHeight;
    if (!mediaWidth || !mediaHeight) return;

    const isMobileViewport = Math.min(window.innerWidth, window.innerHeight) <= 600;
    const isPortraitViewport = window.innerHeight >= window.innerWidth;
    const usesThumbControls = isMobileViewport && isPortraitViewport;
    const horizontalMargin = usesThumbControls ? 24 : isMobileViewport ? 136 : 176;
    const maxWidth = Math.max(160, window.innerWidth - horizontalMargin);
    const maxHeight = Math.max(160, isMobileViewport
      ? window.innerHeight - (usesThumbControls ? 88 : 24)
      : window.innerHeight * .82);
    const aspectRatio = mediaWidth / mediaHeight;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    lightbox.classList.toggle('uses-thumb-controls', usesThumbControls);
    activeLightboxMedia.style.width = `${Math.round(width)}px`;
    activeLightboxMedia.style.height = `${Math.round(height)}px`;
  };

  const revealMedia = (media, requestId) => {
    if (requestId !== mediaRequestId) return;

    activeLightboxMedia = media;
    media.hidden = false;
    fitLightboxMedia();
    lightbox.classList.remove('is-media-loading');
    media.classList.remove('is-changing');
    void media.offsetWidth;
    media.classList.add('is-changing');

    if (media instanceof HTMLVideoElement) {
      media.play().catch(() => {});
    }
  };

  const showMedia = (index) => {
    const nextIndex = Math.min(Math.max(index, 0), triggers.length - 1);
    if (lightbox.open && nextIndex === currentIndex) return;

    const sourceMedia = triggers[nextIndex].querySelector('img, video');
    if (!sourceMedia) return;

    currentIndex = nextIndex;
    const requestId = ++mediaRequestId;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === triggers.length - 1;
    lightbox.classList.add('is-media-loading');
    activeLightboxMedia = null;

    lightboxImage.hidden = true;
    lightboxVideo.hidden = true;
    lightboxImage.classList.remove('is-changing');
    lightboxVideo.classList.remove('is-changing');
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxVideo.style.removeProperty('width');
    lightboxVideo.style.removeProperty('height');
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    lightboxVideo.pause();
    lightboxVideo.controls = false;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();

    if (sourceMedia instanceof HTMLVideoElement) {
      const source = sourceMedia.currentSrc || sourceMedia.querySelector('source')?.src || sourceMedia.src;
      if (!source) return;

      lightboxVideo.controls = triggers[currentIndex].hasAttribute('data-video-controls');
      lightboxVideo.setAttribute('aria-label', sourceMedia.getAttribute('aria-label') || 'Expanded project video');
      lightboxVideo.addEventListener('loadedmetadata', () => revealMedia(lightboxVideo, requestId), { once: true });
      lightboxVideo.src = source;
      lightboxVideo.load();
    } else {
      lightboxImage.alt = sourceMedia.alt;
      lightboxImage.addEventListener('load', () => revealMedia(lightboxImage, requestId), { once: true });
      lightboxImage.src = sourceMedia.currentSrc || sourceMedia.src;
    }
  };

  const closeLightbox = () => {
    if (!lightbox.open || lightbox.classList.contains('is-closing')) return;

    if (reducedMotion.matches) {
      lightbox.close();
      return;
    }

    lightbox.classList.add('is-closing');
    window.setTimeout(() => lightbox.close(), 220);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      showMedia(index);
      lightbox.classList.remove('is-closing');
      lightbox.showModal();
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showMedia(currentIndex - 1));
  nextButton.addEventListener('click', () => showMedia(currentIndex + 1));
  window.addEventListener('resize', () => {
    if (lightbox.open) fitLightboxMedia();
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showMedia(currentIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showMedia(currentIndex + 1);
    }
  });
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
  lightbox.addEventListener('close', () => {
    mediaRequestId += 1;
    lightbox.classList.remove('is-closing');
    lightbox.classList.remove('is-media-loading');
    lightboxImage.classList.remove('is-changing');
    lightboxVideo.classList.remove('is-changing');
    lightboxImage.removeAttribute('src');
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxImage.alt = '';
    lightboxVideo.pause();
    lightboxVideo.controls = false;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.removeAttribute('aria-label');
    lightboxVideo.style.removeProperty('width');
    lightboxVideo.style.removeProperty('height');
    lightboxVideo.load();
    lightboxVideo.hidden = true;
    lightboxImage.hidden = true;
    activeLightboxMedia = null;
  });
}
