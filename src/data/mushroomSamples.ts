// Liste des échantillons de champignons disponibles
export interface MushroomSample {
  file: string;
  species: string;
  description?: string;
  toxic?: boolean;
}

export const MUSHROOM_SAMPLES: MushroomSample[] = [
  {
    file: '00_Amanita_muscaria.jpg',
    species: 'Amanita muscaria',
    description: 'Amanite tue-mouches - Très toxique, hallucinogène',
    toxic: true
  },
  {
    file: '01_Boletus_edulis.jpg',
    species: 'Boletus edulis',
    description: 'Cèpe de Bordeaux - Excellent comestible',
    toxic: false
  },
  {
    file: '02_Cantharellus_cibarius.jpg',
    species: 'Cantharellus cibarius',
    description: 'Girolle - Excellent comestible',
    toxic: false
  },
  {
    file: '03_Psilocybe_cyanescens.jpg',
    species: 'Psilocybe cyanescens',
    description: 'Psilocybe azurescente - Hallucinogène',
    toxic: true
  },
  {
    file: '04_Lactarius_deliciosus.jpg',
    species: 'Lactarius deliciosus',
    description: 'Lactaire délicieux - Bon comestible',
    toxic: false
  },
  {
    file: '05_Phallus_impudicus.jpg',
    species: 'Phallus impudicus',
    description: 'Phallus impudique - Comestible jeune',
    toxic: false
  },
  {
    file: '06_Trametes_versicolor.jpg',
    species: 'Trametes versicolor',
    description: 'Tramète versicolore - Non comestible',
    toxic: false
  },
  {
    file: '07_Ganoderma_applanatum.jpg',
    species: 'Ganoderma applanatum',
    description: 'Ganoderme aplani - Non comestible',
    toxic: false
  },
  {
    file: '08_Grifola_frondosa.jpg',
    species: 'Grifola frondosa',
    description: 'Poule des bois - Bon comestible',
    toxic: false
  },
  {
    file: '09_Cerioporus_squamosus.jpg',
    species: 'Cerioporus squamosus',
    description: 'Polypore écailleux - Comestible jeune',
    toxic: false
  },
  {
    file: '10_Cladonia_fimbriata.jpg',
    species: 'Cladonia fimbriata',
    description: 'Cladonie frangée - Lichen',
    toxic: false
  },
  {
    file: '11_Agaricus_augustus.jpg',
    species: 'Agaricus augustus',
    description: 'Agaric auguste - Bon comestible',
    toxic: false
  }
];

export const getSamplePath = (filename: string) => `/samples/${filename}`;
