import { User, NewsItem, POI, Activity, Event, Notice, Notification, KPI, ChartData, Settings } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Jávea',
    email: 'admin@javea.es',
    role: 'admin',
    language: 'es',
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Editor Turisme',
    email: 'editor@javea.es',
    role: 'editor',
    language: 'va',
    createdAt: new Date('2024-02-01'),
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: '3',
    name: 'Auditor Municipal',
    email: 'auditor@javea.es',
    role: 'auditor',
    language: 'en',
    createdAt: new Date('2024-01-20'),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Nuevo parque infantil en el Arenal',
    summary: 'Se inaugura un moderno parque infantil con juegos adaptativos.',
    content: '# Nuevo parque infantil\n\nEl Ayuntamiento de Jávea ha inaugurado...',
    coverImage: 'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg',
      'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg'
    ],
    publishDate: new Date(),
    status: 'published',
    author: 'Editor Turisme',
    tags: ['parques', 'familias', 'arenal'],
    featured: true,
    versions: [
      {
        id: '1',
        version: 1,
        title: 'Nuevo parque infantil en el Arenal',
        content: '# Nuevo parque infantil\n\nEl Ayuntamiento de Jávea ha inaugurado...',
        author: 'Editor Turisme',
        createdAt: new Date(),
      }
    ],
  },
  {
    id: '2',
    title: 'Festivales de verano 2025',
    summary: 'Programa completo de eventos culturales para el próximo verano.',
    content: '# Festivales de verano\n\nEste año contaremos con...',
    coverImage: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'
    ],
    publishDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    author: 'Admin Jávea',
    tags: ['cultura', 'verano', 'festivales'],
    featured: false,
    versions: [],
  },
];

export const mockPOIs: POI[] = [
  {
    id: '1',
    name: 'Playa del Arenal',
    type: 'beach',
    category: 'Playas',
    description: 'Playa principal de Jávea con todos los servicios',
    address: 'Playa del Arenal, Jávea',
    latitude: 38.7965,
    longitude: 0.1759,
    occupancy: 75,
    featuredImage: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
    gallery: [
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
      'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg'
    ],
    features: ['parking', 'duchas', 'familias', 'accesible'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Mirador Cabo de la Nao',
    type: 'viewpoint',
    category: 'Miradores y Vistas',
    description: 'Espectacular mirador sobre el Mediterráneo',
    address: 'Cabo de la Nao, Jávea',
    latitude: 38.7325,
    longitude: 0.2089,
    occupancy: 45,
    featuredImage: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg'
    ],
    features: ['parking', 'miradors'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Cala Granadella',
    type: 'beach',
    category: 'Playas',
    description: 'Cala de aguas cristalinas rodeada de pinos',
    address: 'Cala Granadella, Jávea',
    latitude: 38.7456,
    longitude: 0.2123,
    occupancy: 85,
    featuredImage: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg'
    ],
    features: ['parking', 'buceo', 'familias'],
    isActive: true,
  },
  {
    id: '4',
    name: 'Restaurante Casa Pepa',
    type: 'restaurant',
    category: 'Gastronomía',
    description: 'Cocina mediterránea con vistas al mar',
    address: 'Puerto Deportivo, Jávea',
    latitude: 38.7912,
    longitude: 0.1698,
    occupancy: 60,
    featuredImage: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    gallery: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'
    ],
    features: ['terraza', 'parking', 'wifi'],
    isActive: true,
  },
  {
    id: '5',
    name: 'Mercado Municipal',
    type: 'shop',
    category: 'Comercios',
    description: 'Mercado tradicional con productos locales',
    address: 'Plaza del Mercado, Jávea',
    latitude: 38.7934,
    longitude: 0.1712,
    occupancy: 40,
    featuredImage: 'https://images.pexels.com/photos/1028742/pexels-photo-1028742.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1028742/pexels-photo-1028742.jpeg'
    ],
    features: ['parking', 'productos locales'],
    isActive: true,
  },
  {
    id: '6',
    name: 'Parque Montaner',
    type: 'park',
    category: 'Parques y Jardines',
    description: 'Parque urbano con zona infantil y merendero',
    address: 'Av. Montaner, Jávea',
    latitude: 38.7923,
    longitude: 0.1734,
    occupancy: 25,
    featuredImage: 'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg'
    ],
    features: ['parking', 'familias', 'merendero', 'accesible'],
    isActive: true,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '7',
    name: 'Centro Deportivo Municipal',
    type: 'sports',
    category: 'Instalaciones Deportivas',
    description: 'Centro deportivo con piscina y gimnasio',
    address: 'Av. Príncipe de Asturias, Jávea',
    latitude: 38.7919,
    longitude: 0.1736,
    occupancy: 60,
    featuredImage: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
    gallery: [],
    features: ['parking', 'accesible'],
    isActive: true,
    price: 15,
    duration: 60,
    maxCapacity: 30,
    requiresReservation: true,
    reservationUrl: 'https://reservas.javea.es',
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '21:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '21:00', isAvailable: true },
    ],
  },
  {
    id: '8',
    name: 'Alquiler de Kayaks',
    type: 'activity',
    category: 'Deportes Acuáticos',
    description: 'Alquiler de kayaks para explorar las calas',
    address: 'Playa del Arenal, Jávea',
    latitude: 38.7965,
    longitude: 0.1759,
    occupancy: 70,
    featuredImage: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    gallery: [
      'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg'
    ],
    features: ['equipamiento incluido', 'instructor'],
    isActive: true,
    price: 25,
    duration: 120,
    maxCapacity: 8,
    requiresReservation: true,
    reservationUrl: 'https://kayaks-javea.com',
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
    ],
  },
  {
    id: '9',
    name: 'Excursión Cabo de la Nao',
    type: 'activity',
    category: 'Excursiones',
    description: 'Ruta guiada por el Cabo de la Nao y sus miradores',
    address: 'Cabo de la Nao, Jávea',
    latitude: 38.7325,
    longitude: 0.2089,
    occupancy: 45,
    featuredImage: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg'
    ],
    features: ['guía incluido', 'transporte'],
    isActive: true,
    price: 35,
    duration: 180,
    maxCapacity: 15,
    requiresReservation: true,
    reservationUrl: 'https://excursiones-javea.com',
    schedule: [
      { dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isAvailable: true },
      { dayOfWeek: 0, startTime: '09:00', endTime: '12:00', isAvailable: true },
    ],
  },
  {
    id: '10',
    name: 'Buceo en Cala Granadella',
    type: 'activity',
    category: 'Deportes Acuáticos',
    description: 'Inmersión guiada en las aguas cristalinas de Granadella',
    address: 'Cala Granadella, Jávea',
    latitude: 38.7456,
    longitude: 0.2123,
    occupancy: 80,
    featuredImage: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    gallery: [
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg'
    ],
    features: ['equipamiento incluido', 'instructor certificado'],
    isActive: true,
    price: 45,
    duration: 90,
    maxCapacity: 6,
    requiresReservation: true,
    reservationUrl: 'https://buceo-javea.com',
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '10:00', endTime: '16:00', isAvailable: true },
    ],
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Fiestas de San Juan',
    description: 'Celebración tradicional de las fiestas patronales',
    location: 'Centro histórico',
    image: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-24'),
    category: 'Tradiciones',
    isPublic: true,
    status: 'published',
  },
  {
    id: '2',
    title: 'Mercado de Artesanía',
    description: 'Mercado semanal de productos artesanales locales',
    location: 'Plaza de la Iglesia',
    image: 'https://images.pexels.com/photos/1028742/pexels-photo-1028742.jpeg',
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-02-15'),
    category: 'Cultura',
    isPublic: true,
    status: 'published',
  },
  {
    id: '3',
    title: 'Festival de Jazz',
    description: 'Conciertos de jazz al aire libre en el puerto',
    location: 'Puerto Deportivo',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    startDate: new Date('2025-07-15'),
    endDate: new Date('2025-07-17'),
    category: 'Música',
    isPublic: true,
    status: 'published',
  },
  {
    id: '4',
    title: 'Ruta Gastronómica',
    description: 'Degustación de platos típicos en restaurantes locales',
    location: 'Varios restaurantes',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-03-12'),
    category: 'Gastronomía',
    isPublic: true,
    status: 'published',
  },
  {
    id: '5',
    title: 'Torneo de Pádel',
    description: 'Campeonato municipal de pádel',
    location: 'Centro Deportivo Municipal',
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
    startDate: new Date('2025-04-05'),
    endDate: new Date('2025-04-07'),
    category: 'Deportes',
    isPublic: true,
    status: 'draft',
  },
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Cortes de tráfico por obras',
    description: 'Se realizarán obras en la Av. del Mediterráneo del 15 al 20 de febrero',
    date: new Date(),
    category: 'obras',
    sendPush: true,
    isActive: true,
  },
  {
    id: '2',
    title: 'Nuevo horario de recogida',
    description: 'Cambio en los horarios de recogida de residuos urbanos',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: 'general',
    sendPush: false,
    isActive: true,
  },
  {
    id: '3',
    title: 'Corte de agua programado',
    description: 'Corte de suministro de agua en zona centro el 20 de febrero de 9:00 a 14:00',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    category: 'general',
    sendPush: true,
    isActive: true,
  },
  {
    id: '4',
    title: 'Desvío por obras en el puerto',
    description: 'Desvío temporal en el acceso al puerto deportivo por obras de mejora',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'trafico',
    sendPush: true,
    isActive: true,
  },
  {
    id: '5',
    title: 'Alerta meteorológica',
    description: 'Aviso amarillo por vientos fuertes para mañana',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    category: 'emergencias',
    sendPush: true,
    isActive: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Recordatorio: Evento próximo',
    message: 'El mercado de artesanía comenzará mañana a las 10:00',
    type: 'reminder',
    internalLink: '/events/2',
    status: 'scheduled',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
];

export const mockKPIs: KPI[] = [
  { label: 'Usuarios Registrados', value: '2,847', change: 12.5, changeType: 'increase', icon: 'users' },
  { label: 'Sesiones Activas', value: '1,234', change: -3.2, changeType: 'decrease', icon: 'activity' },
  { label: 'Ítems Publicados', value: '156', change: 8.1, changeType: 'increase', icon: 'map-pin' },
  { label: 'Incidencias Resueltas', value: '23', change: 15.3, changeType: 'increase', icon: 'check-circle' },
];

export const mockChartData: Record<string, ChartData> = {
  visits: {
    labels: ['1 Feb', '5 Feb', '10 Feb', '15 Feb', '20 Feb', '25 Feb', '28 Feb'],
    datasets: [{
      label: 'Visitas',
      data: [1200, 1350, 1100, 1400, 1250, 1600, 1450],
      borderColor: '#00788A',
      backgroundColor: 'rgba(0, 120, 138, 0.1)',
    }],
  },
  categories: {
    labels: ['Playas', 'Miradores', 'Actividades', 'Restaurantes', 'Tiendas', 'Parques'],
    datasets: [{
      label: 'Visualizaciones',
      data: [850, 620, 480, 390, 290, 180],
      backgroundColor: '#00788A',
    }],
  },
  languages: {
    labels: ['Español', 'English', 'Deutsch', 'Français', 'Nederlands', 'Valencià'],
    datasets: [{
      label: 'Usuarios',
      data: [45, 25, 12, 8, 6, 4],
      backgroundColor: ['#00788A', '#16A34A', '#F4AC47', '#DC2626', '#8B5CF6', '#06B6D4'],
    }],
  },
};

export const mockSettings: Settings = {
  branding: {
    logo: 'https://images.pexels.com/photos/1001850/pexels-photo-1001850.jpeg',
    title: 'Javea2Live · Ayuntamiento',
  },
  homeBlocks: [
    { id: '1', type: 'kpis', title: 'KPIs', isActive: true, order: 1 },
    { id: '2', type: 'charts', title: 'Gráficas', isActive: true, order: 2 },
    { id: '3', type: 'news', title: 'Últimas Noticias', isActive: true, order: 3 },
  ],
  translations: {
    es: {
      'nav.home': 'Inicio',
      'nav.news': 'Noticias',
      'nav.items': 'Ítems',
      'nav.activities': 'Actividades',
      'nav.events': 'Eventos',
      'nav.notices': 'Avisos',
      'nav.users': 'Usuarios',
      'nav.analytics': 'Estadísticas',
      'nav.notifications': 'Notificaciones',
      'nav.settings': 'Ajustes',
    },
    va: {
      'nav.home': 'Inici',
      'nav.news': 'Notícies',
      'nav.items': 'Ítems',
      'nav.activities': 'Activitats',
      'nav.events': 'Esdeveniments',
      'nav.notices': 'Avisos',
      'nav.users': 'Usuaris',
      'nav.analytics': 'Estadístiques',
      'nav.notifications': 'Notificacions',
      'nav.settings': 'Configuració',
    },
    en: {
      'nav.home': 'Home',
      'nav.news': 'News',
      'nav.items': 'Items',
      'nav.activities': 'Activities',
      'nav.events': 'Events',
      'nav.notices': 'Notices',
      'nav.users': 'Users',
      'nav.analytics': 'Analytics',
      'nav.notifications': 'Notifications',
      'nav.settings': 'Settings',
    },
  },
  aiProvider: 'deepseek',
};

// Mock API functions with delays to simulate real API calls
export const mockAPI = {
  // Users
  getUsers: (): Promise<User[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockUsers]), 300)),
  
  // News
  getNews: (): Promise<NewsItem[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockNews]), 500)),
  
  createNews: (news: Omit<NewsItem, 'id' | 'versions'>): Promise<NewsItem> =>
    new Promise(resolve => {
      const newNews: NewsItem = {
        ...news,
        id: String(Date.now()),
        versions: [],
      };
      mockNews.push(newNews);
      setTimeout(() => resolve(newNews), 800);
    }),
  
  // POIs
  getPOIs: (): Promise<POI[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockPOIs]), 400)),
  
  // Activities
  getActivities: (): Promise<Activity[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockActivities]), 400)),
  
  // Events
  getEvents: (): Promise<Event[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockEvents]), 350)),
  
  // Notices
  getNotices: (): Promise<Notice[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockNotices]), 300)),
  
  // Notifications
  getNotifications: (): Promise<Notification[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockNotifications]), 250)),
  
  // Analytics
  getKPIs: (): Promise<KPI[]> => 
    new Promise(resolve => setTimeout(() => resolve([...mockKPIs]), 600)),
  
  getChartData: (type: string): Promise<ChartData> => 
    new Promise(resolve => setTimeout(() => resolve(mockChartData[type]), 700)),
  
  // Settings
  getSettings: (): Promise<Settings> => 
    new Promise(resolve => setTimeout(() => resolve({ ...mockSettings }), 200)),
};