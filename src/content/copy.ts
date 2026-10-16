/** Textos editoriales. Frases cortas, con intención. */
export const story = {
  hero: {
    eyebrow: "Denominación de Origen Calificada Rioja",
    title: "ESTORIA",
    tagline: "Hay historias que merecen ser compartidas.",
    play: "Ver la historia",
    playHint: (seconds: number) => `Con música · ${seconds} segundos`,
    sound: "Sonido",
    pause: "Pausar",
    resume: "Continuar",
    skip: "Saltar",
    replay: "Ver de nuevo",
    more: "Conocer la marca",
  },
  origin: { title: "Toda historia tiene un origen.", subtitle: "El nuestro se expresa en Rioja." },
  rioja: ["El tiempo deja huella.", "La tierra guarda memoria.", "Y cada historia encuentra su momento."],
  return: { title: "El carácter de Rioja, en ESTORIA." },
  brand: {
    eyebrow: "La marca",
    title: "Un vino para contar historias.",
    lead: "Estoria es la forma antigua de la palabra «historia». ESTORIA nace en la Denominación de Origen Calificada Rioja con una idea sencilla: que el vino es, ante todo, una excusa para reunirse.",
    body: "Dos variedades de la tierra, Tempranillo y Viura, y una manera de entender la mesa: sin prisa, con buena compañía y con el tiempo necesario para que las conversaciones lleguen lejos.",
    pillars: [
      { title: "Origen", text: "Rioja: una tierra con siglos de tradición vinícola y una denominación que vela por cada botella." },
      { title: "Tiempo", text: "La tierra guarda memoria. Cada cosecha recuerda a la anterior y prepara la siguiente." },
      { title: "Compartir", text: "Hay historias que merecen ser compartidas. Y casi todas empiezan alrededor de una mesa." },
    ],
    cta: "Conocer los vinos",
  },
  collection: {
    eyebrow: "Nuestros vinos",
    title: "Dos vinos, una misma historia.",
    viewerHint: "Arrastra la botella para girarla",
  },
  riojaPage: {
    eyebrow: "Rioja",
    motto: ["La tierra guarda memoria", "y cada historia encuentra su momento."],
    body: [
      "La etiqueta de ESTORIA lleva dibujado un paisaje: un pueblo reunido en torno a su iglesia, las montañas al fondo y los viñedos en primer plano.",
      "Es la imagen de Rioja que inspira la marca: una tierra donde el tiempo deja huella, donde cada cosecha recuerda a la anterior y donde el vino acompaña a quienes se sientan a compartir una mesa.",
    ],
    tradition: {
      eyebrow: "Una tradición",
      title: "Una tierra que lleva siglos haciendo vino.",
      paragraphs: [
        "En Rioja el vino forma parte del paisaje y de la vida de sus pueblos desde hace siglos. Las viñas se extienden a lo largo del valle del Ebro y de sus afluentes, entre las sierras que lo protegen, en tierras de La Rioja, Álava y Navarra.",
        "A finales del siglo XIX, cuando la filoxera arrasó los viñedos franceses, llegaron a Rioja comerciantes y elaboradores del otro lado de los Pirineos. Aquel intercambio dejó huella en la manera de elaborar y de guardar el vino.",
        "En 1925 Rioja fue reconocida como denominación de origen y en 1991 se convirtió en la primera Denominación de Origen Calificada de España. Hoy se organiza en tres zonas, Rioja Alta, Rioja Alavesa y Rioja Oriental, y su Consejo Regulador garantiza el origen de cada botella.",
      ],
      facts: [
        { value: "1925", label: "Reconocimiento como denominación de origen" },
        { value: "1991", label: "Primera Denominación de Origen Calificada de España" },
        { value: "3", label: "Zonas: Rioja Alta, Rioja Alavesa y Rioja Oriental" },
      ],
    },
    grapes: {
      eyebrow: "Nuestras uvas",
      title: "Dos variedades de la tierra.",
      intro: "ESTORIA se elabora con dos de las variedades más ligadas a la historia de Rioja.",
      items: [
        {
          name: "Tempranillo",
          kind: "Variedad tinta",
          text: "Es la uva emblemática de Rioja y la más cultivada de la Denominación. Su nombre viene de «temprano»: madura antes que otras variedades tintas. Es la base del ESTORIA tinto.",
        },
        {
          name: "Viura",
          kind: "Variedad blanca",
          text: "También conocida como Macabeo, es la variedad blanca tradicional de Rioja y la más extendida entre las blancas de la Denominación. Es la base del ESTORIA blanco.",
        },
      ],
    },
    galleryTitle: "Paisajes de la Denominación",
    galleryNote: "Fotografías ilustrativas de la Denominación de Origen Calificada Rioja. No corresponden a viñedos propios de ESTORIA.",
  },
  table: {
    eyebrow: "La mesa",
    title: "Las buenas historias siempre encuentran una mesa.",
    body: "ESTORIA nace para acompañar conversaciones sin prisa: una comida que se alarga, una mesa compartida, la sobremesa.",
    moments: [
      {
        title: "Un vino para compartir",
        text: "Una botella que se abre en el centro de la mesa y pasa de mano en mano. Las comidas de domingo, las cenas con amigos, los reencuentros que se prometen durante meses. ESTORIA está pensado para esos momentos en los que lo importante es quién se sienta a tu lado.",
      },
      {
        title: "Para las ocasiones especiales",
        text: "Hay fechas que se recuerdan durante años: una celebración familiar, un aniversario, una buena noticia que merece un brindis. Momentos que se convierten en historia y que piden un vino a su altura.",
      },
      {
        title: "Para los pequeños momentos",
        text: "No todas las historias son grandes. A veces basta una copa al final del día, una conversación tranquila o una tapa en buena compañía para que un momento cualquiera merezca la pena.",
      },
    ],
    pairings: {
      eyebrow: "Dos vinos, dos mesas",
      title: "Para disfrutar de una buena comida.",
      intro: "La cocina de siempre, el producto bien tratado, los platos que se preparan con tiempo. Un buen vino acompaña, realza los sabores y convierte una comida en una sobremesa larga.",
      items: [
        {
          wine: "ESTORIA Tempranillo",
          title: "El tinto, con un buen cocido.",
          text: "Los platos de cuchara, los guisos a fuego lento y las comidas de invierno que reúnen a toda la familia alrededor de la mesa. La cocina de siempre pide un tinto de Rioja.",
        },
        {
          wine: "ESTORIA Viura",
          title: "El blanco, con un pescado.",
          text: "Un pescado al horno o a la plancha, la cocina del mar y los platos más frescos y luminosos. Un blanco de Rioja para las comidas que se alargan con la luz del mediodía.",
        },
      ],
    },
    closing: "Porque el vino, como las buenas historias, se disfruta más cuando se comparte.",
    moderation: "Disfruta del vino con calma y con moderación. Venta y consumo reservados a mayores de 18 años.",
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos.",
    body: "Información de producto, distribución, venta para hostelería y comercios, colaboraciones o disponibilidad.",
  },
};
