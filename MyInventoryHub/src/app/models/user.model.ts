export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
    createdAt: Date;
    lastLogin?: Date;
  }

  export interface Owner extends User {
    storeName: string;
    storeLocation: string;
    // Otros atributos específicos para el dueño de la tienda
  }

  export interface Employee extends User {
    jobTitle: string;
    shift: 'morning' | 'afternoon' | 'night';
    supervisorId?: number; // Si el empleado tiene un supervisor
    // Otros atributos específicos para el empleado
  }
  