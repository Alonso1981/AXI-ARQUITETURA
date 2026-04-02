import { Style, SiteSettings } from './types';

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "AXIS ARQUITETURA & URBANISMO",
  siteNameTop: "AXIS",
  siteNameBottom: "ARQUITETURA & URBANISMO",
  tagline: "Arquitetura que transforma ideias em espaços únicos.",
  description: "Nosso escritório desenvolve projetos arquitetônicos que unem criatividade, técnica e funcionalidade, criando ambientes modernos, elegantes e personalizados.",
  address: "Rua Fabio Cassio, 270, Porto Grande, São Sebastião - SP",
  phone: "(12) 98112-1214",
  whatsapp: "5512981121214",
  email: "axiarquiteturaurbanismo@gmail.com",
  socialLinks: {
    instagram: "https://instagram.com/axiarquitetura"
  },
  heroImage: "https://placehold.co/1920x1080/18181b/18181b",
  aboutTitle: "Transformamos sonhos em monumentos de funcionalidade.",
  aboutImage: "https://images.unsplash.com/photo-1503387762-592dee582a7b?q=80&w=1931&auto=format&fit=crop",
  stylesTitle: "Uma vitrine de possibilidades para o seu projeto.",
  renderExpressTitle: "Renderização de Fachada Express",
  renderExpressDescription: "Quer ver como sua casa pode ficar antes de reformar? Mande uma foto da sua fachada atual via WhatsApp e nós entregamos um estudo de renderização profissional em tempo recorde.",
  renderExpressImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  processTitle: "Nosso Processo de Trabalho",
  portfolioTitle: "Nosso Portfólio",
  portfolioTagline: "Projetos que inspiram.",
  stylesPageTitle: "Enciclopédia Arquitetônica",
  stylesPageTagline: "Estilos que definem épocas.",
  blogPageTitle: "Blog & Tendências",
  blogPageTagline: "O mundo da arquitetura.",
  blogPageDescription: "Artigos, dicas e novidades sobre design de interiores, urbanismo e tecnologias construtivas.",
  contactPageTitle: "Fale Conosco",
  contactPageTagline: "Vamos construir algo juntos.",
  logoFontSize: 24,
  heroLogoFontSize: 48,
  heroTitle: "AXIS",
  heroTitlePosition: { x: 0, y: 0 },
  taglinePosition: { x: 0, y: 0 },
  heroButtonsPosition: { x: 0, y: 0 },
  logoTopPosition: { x: 0, y: 0 },
  logoBottomPosition: { x: 0, y: 0 },
};

export const INITIAL_STYLES: Style[] = [
  {
    title: "Modernismo Brasileiro",
    slug: "modernismo-brasileiro",
    description: "O Modernismo Brasileiro, fundamentado na 'Escola Carioca', revolucionou a construção civil com o uso extensivo do concreto armado. As soluções adotadas incluem os cinco pontos de Le Corbusier, com destaque para os pilotis que liberam o solo para uso público e os brises-soleil para controle térmico passivo.",
    context: "Surgido na década de 1920 e consolidado nos anos 40 e 50, o modernismo no Brasil buscou uma identidade nacional aliada ao progresso tecnológico. A 'Escola Carioca' liderada por Oscar Niemeyer e Lúcio Costa, trouxe leveza e curvas ao concreto, rompendo com a rigidez europeia. O contexto era de urbanização acelerada e a necessidade de novos símbolos para a república, culminando na construção de Brasília.",
    characteristics: ["Uso de concreto armado", "Pilotis", "Planta livre", "Fachada livre", "Janelas em fita", "Brise-soleil", "Integração com paisagismo"],
    architects: "Oscar Niemeyer, Lúcio Costa, Affonso Eduardo Reidy",
    architectWorks: [
      { architect: "Oscar Niemeyer", works: ["Congresso Nacional", "Catedral de Brasília", "Museu de Arte Contemporânea de Niterói"] },
      { architect: "Lúcio Costa", works: ["Plano Piloto de Brasília", "Edifício Gustavo Capanema", "Parque Guinle"] },
      { architect: "Affonso Eduardo Reidy", works: ["Museu de Arte Moderna do Rio de Janeiro", "Conjunto Habitacional Pedregulho"] }
    ],
    examples: "Congresso Nacional (Brasília), Museu de Arte da Pampulha (BH), Edifício Gustavo Capanema (RJ)",
    images: [
      "https://images.unsplash.com/photo-1590424744295-8834405f5db6?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592dee582a7b?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Brutalismo Paulista",
    slug: "brutalismo-paulista",
    description: "O Brutalismo Paulista foca na 'verdade dos materiais' e na infraestrutura como expressão estética. Utiliza tecnologia de concreto aparente e estruturas protendidas para criar grandes vãos urbanos.",
    context: "Diferente da Escola Carioca, a Escola Paulista (Brutalismo) buscava uma arquitetura mais ética do que estética, focada na função social e na crueza dos materiais. Liderada por Vilanova Artigas, enfatizava o concreto aparente, grandes estruturas e a integração com a cidade através de espaços públicos generosos sob os edifícios.",
    characteristics: ["Concreto aparente", "Estruturas pesadas", "Grandes vãos livres", "Funcionalidade social", "Exposição de sistemas hidráulicos e elétricos", "Rigor geométrico"],
    architects: "Lina Bo Bardi, Paulo Mendes da Rocha, Vilanova Artigas",
    architectWorks: [
      { architect: "Lina Bo Bardi", works: ["MASP", "SESC Pompéia", "Casa de Vidro"] },
      { architect: "Paulo Mendes da Rocha", works: ["MuBE", "Pinacoteca de São Paulo (Reforma)", "Ginásio do Clube Atlético Paulistano"] },
      { architect: "Vilanova Artigas", works: ["Faculdade de Arquitetura e Urbanismo da USP (FAU-USP)", "Estádio do Morumbi"] }
    ],
    examples: "MASP (São Paulo), SESC Pompéia, MuBE (Museu Brasileiro da Escultura)",
    images: [
      "https://images.unsplash.com/photo-1518005020250-685945330982?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Minimalismo Contemporâneo",
    slug: "minimalismo-contemporaneo",
    description: "O Minimalismo contemporâneo utiliza tecnologias de precisão milimétrica em esquadrias de alumínio ocultas e vidros de alto desempenho térmico (Low-E).",
    context: "Inspirado no lema 'Less is More' de Mies van der Rohe, o minimalismo contemporâneo busca a pureza das formas e a redução dos elementos ao essencial. Foca na luz, no espaço e na qualidade dos materiais, criando ambientes de serenidade e clareza visual, muitas vezes integrando a tecnologia de forma invisível.",
    characteristics: ["Pureza formal", "Cores neutras", "Ausência de ornamentos", "Valorização da luz natural", "Espaços abertos", "Materiais de alta qualidade"],
    architects: "Mies van der Rohe, John Pawson, Tadao Ando",
    architectWorks: [
      { architect: "Mies van der Rohe", works: ["Pavilhão de Barcelona", "Seagram Building", "Farnsworth House"] },
      { architect: "John Pawson", works: ["Mosteiro de Novy Dvur", "Design Museum London", "Sackler Crossing"] },
      { architect: "Tadao Ando", works: ["Igreja da Luz", "Museu de Arte Moderna de Fort Worth", "Chichu Art Museum"] }
    ],
    examples: "Pavilhão de Barcelona, Igreja da Luz (Osaka), Casa de Retiro (Espanha)",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Arquitetura Orgânica",
    slug: "arquitetura-organica",
    description: "A Arquitetura Orgânica promove a simbiose entre o ambiente construído e o ecossistema. Utiliza tecnologias de construção com materiais vernaculares.",
    context: "Desenvolvida por Frank Lloyd Wright no início do século XX, a arquitetura orgânica defende que a construção deve ser uma extensão da natureza. As formas, materiais e o próprio layout do edifício devem harmonizar-se com o local, como se tivessem 'nascido' ali. É uma filosofia que preza pela unidade e pelo equilíbrio entre o homem e o meio ambiente.",
    characteristics: ["Integração com a natureza", "Uso de materiais naturais", "Formas fluidas e orgânicas", "Harmonia entre interior e exterior", "Sustentabilidade"],
    architects: "Frank Lloyd Wright, Alvar Aalto, Antoni Gaudí",
    architectWorks: [
      { architect: "Frank Lloyd Wright", works: ["Fallingwater", "Museu Guggenheim (NY)", "Taliesin West"] },
      { architect: "Alvar Aalto", works: ["Villa Mairea", "Sanatório de Paimio", "Auditório Finlândia"] },
      { architect: "Antoni Gaudí", works: ["Sagrada Família", "Park Güell", "Casa Batlló"] }
    ],
    examples: "Fallingwater (EUA), Museu Guggenheim Bilbao, Sagrada Família (Barcelona)",
    images: [
      "https://images.unsplash.com/photo-1503387762-592dee58ef4e?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "High-Tech",
    slug: "high-tech",
    description: "O estilo High-Tech aplica tecnologias aeroespaciais na arquitetura, utilizando tensoestruturas de PTFE e polímeros de alta resistência.",
    context: "Surgido nos anos 70, o High-Tech celebra a tecnologia industrial, deixando expostos elementos estruturais e de serviço que normalmente seriam escondidos. É uma arquitetura de flexibilidade, transparência e precisão técnica, frequentemente associada ao uso intensivo de aço, vidro e materiais sintéticos avançados.",
    characteristics: ["Exposição de estruturas e sistemas", "Uso de materiais industriais", "Flexibilidade espacial", "Transparência", "Estética da máquina"],
    architects: "Norman Foster, Richard Rogers, Renzo Piano",
    architectWorks: [
      { architect: "Norman Foster", works: ["The Gherkin", "Hearst Tower", "Hong Kong and Shanghai Bank"] },
      { architect: "Richard Rogers", works: ["Centro Pompidou", "Lloyd's Building", "Terminal 4 de Barajas"] },
      { architect: "Renzo Piano", works: ["The Shard", "Centro Pompidou", "Academia de Ciências da Califórnia"] }
    ],
    examples: "Centro Pompidou (Paris), Hearst Tower (NY), The Shard (Londres)",
    images: [
      "https://images.unsplash.com/photo-1449156001935-d2863fb72690?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Desconstrutivismo",
    slug: "desconstrutivismo",
    description: "O Desconstrutivismo desafia a lógica estrutural tradicional através de softwares de modelagem paramétrica e fabricação digital.",
    context: "Influenciado pela filosofia da desconstrução, este estilo busca fragmentar a forma e criar instabilidade visual. Caracteriza-se por geometrias não-euclidianas, ângulos agudos e a aparente falta de ordem. É uma arquitetura que provoca o observador e redefine os limites do que é possível construir com o auxílio da computação avançada.",
    characteristics: ["Geometrias complexas", "Fragmentação da forma", "Instabilidade visual", "Uso de design paramétrico", "Ruptura com a simetria"],
    architects: "Zaha Hadid, Frank Gehry, Daniel Libeskind",
    architectWorks: [
      { architect: "Zaha Hadid", works: ["Centro Heydar Aliyev", "MAXXI Museum", "London Aquatics Centre"] },
      { architect: "Frank Gehry", works: ["Museu Guggenheim Bilbao", "Walt Disney Concert Hall", "Dancing House"] },
      { architect: "Daniel Libeskind", works: ["Museu Judaico de Berlim", "Royal Ontario Museum", "Denver Art Museum"] }
    ],
    examples: "Museu Guggenheim Bilbao, Centro Heydar Aliyev (Baku), Museu Judaico de Berlim",
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592dee582a7b?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Arquitetura Gótica",
    slug: "arquitetura-gotica",
    description: "A arquitetura gótica é caracterizada por sua verticalidade, o uso do arco quebrado (ogival), a abóbada de cruzaria e o arcobotante, permitindo grandes janelas com vitrais.",
    context: "Surgida na França no século XII, a arquitetura gótica evoluiu a partir do estilo românico. Foi uma revolução técnica que permitiu construir igrejas e catedrais muito mais altas e iluminadas, simbolizando a ascensão espiritual. O contexto era de crescimento urbano e o fortalecimento da igreja e das monarquias europeias.",
    characteristics: ["Verticalidade", "Arco ogival", "Abóbada de cruzaria", "Arcobotantes", "Vitrais coloridos", "Gárgulas e ornamentação detalhada"],
    architects: "Abade Suger (precursor), Jean d'Orbais, Robert de Luzarches",
    architectWorks: [
      { architect: "Abade Suger", works: ["Basílica de Saint-Denis (Reforma)"] },
      { architect: "Jean d'Orbais", works: ["Catedral de Reims"] },
      { architect: "Robert de Luzarches", works: ["Catedral de Amiens"] }
    ],
    examples: "Catedral de Notre-Dame de Paris, Catedral de Chartres, Catedral de Milão",
    images: [
      "https://images.unsplash.com/photo-1548678967-f1fc5d33934d?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516496636080-14fb876e029d?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Renascimento",
    slug: "renascimento",
    description: "A arquitetura renascentista resgatou os elementos da antiguidade clássica, focando na simetria, proporção e geometria, utilizando colunas, frontões e cúpulas.",
    context: "Iniciado na Itália no século XV, o Renascimento marcou a transição da Idade Média para a Idade Moderna. Foi um período de redescoberta da cultura greco-romana e de valorização do humanismo. A arquitetura buscava a harmonia ideal, baseada em proporções matemáticas e na observação da natureza.",
    characteristics: ["Simetria", "Proporção áurea", "Uso de ordens clássicas (colunas)", "Cúpulas", "Frontões triangulares", "Racionalidade geométrica"],
    architects: "Filippo Brunelleschi, Leon Battista Alberti, Andrea Palladio",
    architectWorks: [
      { architect: "Filippo Brunelleschi", works: ["Cúpula da Catedral de Florença", "Ospedale degli Innocenti"] },
      { architect: "Leon Battista Alberti", works: ["Basílica de Santa Maria Novella (Fachada)", "Palazzo Rucellai"] },
      { architect: "Andrea Palladio", works: ["Villa La Rotonda", "Basílica Palladiana", "Teatro Olímpico"] }
    ],
    examples: "Basílica de São Pedro (Vaticano), Villa La Rotonda (Vicenza), Palazzo Pitti (Florença)",
    images: [
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515542641795-85ed383ce282?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Barroco",
    slug: "barroco",
    description: "O Barroco é conhecido por sua dramaticidade, exuberância e uso de formas curvas, contrastes de luz e sombra (chiaroscuro) e ornamentação rica.",
    context: "Surgido no final do século XVI na Itália, o Barroco foi impulsionado pela Contrarreforma da Igreja Católica, que buscava emocionar e impressionar os fiéis. É uma arquitetura de movimento e teatralidade, que utiliza a ilusão de ótica e a integração entre arquitetura, escultura e pintura para criar espaços impactantes.",
    characteristics: ["Dinamismo e movimento", "Formas curvas e elípticas", "Ornamentação exuberante", "Contrastes de luz e sombra", "Teatralidade", "Integração das artes"],
    architects: "Gian Lorenzo Bernini, Francesco Borromini, Aleijadinho (Brasil)",
    architectWorks: [
      { architect: "Gian Lorenzo Bernini", works: ["Praça de São Pedro", "Igreja de Sant'Andrea al Quirinale"] },
      { architect: "Francesco Borromini", works: ["San Carlo alle Quattro Fontane", "Sant'Ivo alla Sapienza"] },
      { architect: "Aleijadinho", works: ["Santuário do Bom Jesus de Matosinhos", "Igreja de São Francisco de Assis (Ouro Preto)"] }
    ],
    examples: "Palácio de Versalhes (França), Fontana di Trevi (Roma), Igreja de São Francisco de Assis (Ouro Preto)",
    images: [
      "https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1920&auto=format&fit=crop"
    ]
  },
  {
    title: "Art Déco",
    slug: "art-deco",
    description: "O Art Déco combina formas geométricas modernas com materiais luxuosos e ornamentação estilizada, simbolizando o glamour e o progresso tecnológico do início do século XX.",
    context: "Popularizado nos anos 1920 e 1930, o Art Déco foi um estilo internacional que influenciou desde a arquitetura até o design de objetos. Surgiu após a Primeira Guerra Mundial como uma celebração da modernidade, da velocidade e da máquina, utilizando materiais como cromo, baquelite e vidro, além de motivos exóticos e geométricos.",
    characteristics: ["Geometria estilizada", "Simetria", "Uso de materiais luxuosos", "Motivos em zigue-zague e raios de sol", "Influências exóticas", "Aerodinâmica"],
    architects: "William Van Alen, Raymond Hood, Gregori Warchavchik (Brasil)",
    architectWorks: [
      { architect: "William Van Alen", works: ["Chrysler Building"] },
      { architect: "Raymond Hood", works: ["Rockefeller Center", "American Radiator Building"] },
      { architect: "Gregori Warchavchik", works: ["Casa Modernista da Rua Santa Cruz"] }
    ],
    examples: "Chrysler Building (NY), Empire State Building (NY), Cristo Redentor (RJ)",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
    ]
  }
];
