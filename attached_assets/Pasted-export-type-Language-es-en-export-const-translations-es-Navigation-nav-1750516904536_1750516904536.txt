export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Navigation
    nav: {
      inicio: 'Inicio',
      programas: 'Programas',
      escuela: 'La Escuela',
      noticias: 'Noticias',
      contacto: 'Contacto',
      admision: 'Admisión'
    },
    
    // Home page
    home: {
      title: 'Especialistas en',
      titleHighlight: 'Derecho',
      titleEnd: 'y Recursos Humanos',
      subtitle: 'Formación especializada en Derecho del Trabajo, Acceso a la Abogacía y gestión de Recursos Humanos',
      explorePrograms: 'Explorar Programas',
      moreInfo: 'Más Información',
      ourPrograms: 'Nuestros Programas',
      programsSubtitle: 'Programas especializados diseñados para impulsar tu carrera profesional en el ámbito jurídico-laboral',
      stats: {
        experience: 'Años de Experiencia',
        professionals: 'Profesionales Formados',
        professors: 'Profesores Expertos',
        employability: 'Empleabilidad'
      },
      viewMore: 'Ver Más',
      whyChooseUs: '¿Por qué elegir Sagardoy?',
      whySubtitle: 'Líderes en formación jurídica especializada',
      reasons: {
        specialization: {
          title: 'Especialización Jurídica',
          description: 'Programas especializados en Derecho del Trabajo y acceso a la abogacía'
        },
        practical: {
          title: 'Formación Práctica',
          description: 'Metodología basada en casos reales del ámbito laboral y empresarial'
        },
        networking: {
          title: 'Red Profesional',
          description: 'Networking con abogados laboralistas y directivos de RRHH'
        },
        employability: {
          title: 'Alta Empleabilidad',
          description: '95% de inserción laboral en despachos especializados'
        }
      }
    },

    // Programs page
    programs: {
      title: 'Nuestros Programas',
      subtitle: 'Formación especializada en Derecho del Trabajo, Acceso a la Abogacía y Recursos Humanos',
      filters: {
        all: 'Todos los Programas',
        master: 'Másters',
        executive: 'Executive'
      },
      duration: 'Duración',
      price: 'Precio',
      consult: 'Consultar',
      moreInfo: 'Más información',
      noResults: 'No se encontraron programas para este filtro.',
      cta: {
        title: '¿No encuentras el programa ideal?',
        subtitle: 'Contacta con nuestro equipo de admisiones para recibir asesoramiento personalizado',
        contact: 'Contactar Asesor',
        apply: 'Solicitar Admisión'
      }
    },

    // About page
    about: {
      title: 'La',
      titleHighlight: 'Escuela',
      subtitle: 'Con más de 50 años de experiencia, Sagardoy Business School es referente en formación especializada en Derecho del Trabajo, Acceso a la Abogacía y Gestión de Recursos Humanos.',
      mission: 'Nuestra Misión',
      missionText: 'Formar profesionales del derecho y recursos humanos altamente cualificados, proporcionando formación especializada y práctica que responda a las demandas del mercado laboral.',
      missionDetails: 'Combinamos la experiencia de profesionales en activo con metodologías innovadoras, ofreciendo una formación integral en el ámbito jurídico-laboral y empresarial.',
      values: 'Nuestros Valores',
      valuesList: {
        specialization: {
          title: 'Especialización Jurídica',
          description: 'Programas especializados en Derecho del Trabajo, acceso a la abogacía y compliance laboral.'
        },
        experience: {
          title: 'Experiencia Profesional',
          description: 'Profesores en activo con amplia experiencia en despachos de prestigio y empresas líderes.'
        },
        networking: {
          title: 'Red de Contactos',
          description: 'Networking con profesionales del sector jurídico y directivos de recursos humanos.'
        },
        practical: {
          title: 'Formación Práctica',
          description: 'Metodología basada en casos reales del ámbito laboral y empresarial.'
        }
      },
      statsLabels: {
        experience: 'Años de Experiencia',
        professionals: 'Profesionales Formados',
        professors: 'Profesores Expertos',
        collaborators: 'Despachos Colaboradores'
      }
    },

    // News page
    news: {
      title: 'Noticias y',
      titleHighlight: 'Eventos',
      subtitle: 'Mantente al día con las últimas novedades del sector jurídico-laboral',
      featuredNews: 'Noticia Destacada',
      latestNews: 'Últimas Noticias',
      upcomingEvents: 'Próximos Eventos',
      readMore: 'Leer más',
      readTime: 'min de lectura'
    },

    // Contact page
    contact: {
      title: 'Contacta con',
      titleHighlight: 'Nosotros',
      subtitle: 'Estamos aquí para resolver todas tus dudas sobre nuestros programas',
      form: {
        name: 'Nombre',
        lastName: 'Apellidos',
        email: 'Email',
        phone: 'Teléfono',
        program: 'Programa de interés',
        message: 'Mensaje',
        privacy: 'Acepto la política de privacidad',
        send: 'Enviar mensaje',
        sending: 'Enviando...'
      },
      info: {
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Email',
        hours: 'Horario'
      },
      success: 'Mensaje enviado correctamente',
      error: 'Error al enviar el mensaje'
    },

    // Admission page
    admission: {
      title: 'Proceso de',
      titleHighlight: 'Admisión',
      subtitle: 'Únete a la próxima generación de profesionales del derecho y recursos humanos',
      form: {
        personalInfo: 'Información Personal',
        name: 'Nombre',
        lastName: 'Apellidos',
        email: 'Email',
        phone: 'Teléfono',
        program: 'Programa',
        privacy: 'Acepto la política de privacidad',
        academicInfo: 'Información Académica',
        experience: 'Experiencia profesional',
        motivation: 'Motivación para el programa',
        education: 'Formación académica',
        company: 'Empresa actual',
        position: 'Cargo actual',
        cv: 'Curriculum Vitae (URL)',
        submit: 'Enviar solicitud',
        submitting: 'Enviando...'
      },
      steps: {
        application: 'Solicitud Online',
        applicationDesc: 'Completa el formulario de admisión',
        review: 'Revisión',
        reviewDesc: 'Evaluamos tu perfil y experiencia',
        interview: 'Entrevista',
        interviewDesc: 'Entrevista personal con nuestro equipo',
        admission: 'Admisión',
        admissionDesc: 'Confirmación y matrícula'
      },
      success: 'Solicitud enviada correctamente',
      error: 'Error al enviar la solicitud'
    },

    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar'
    }
  },

  en: {
    // Navigation
    nav: {
      inicio: 'Home',
      programas: 'Programs',
      escuela: 'About',
      noticias: 'News',
      contacto: 'Contact',
      admision: 'Admission'
    },

    // Home page
    home: {
      title: 'Specialists in',
      titleHighlight: 'Law',
      titleEnd: 'and Human Resources',
      subtitle: 'Specialized training in Labor Law, Bar Admission and Human Resources management',
      explorePrograms: 'Explore Programs',
      moreInfo: 'More Information',
      ourPrograms: 'Our Programs',
      programsSubtitle: 'Specialized programs designed to boost your professional career in the legal-labor field',
      stats: {
        experience: 'Years of Experience',
        professionals: 'Trained Professionals',
        professors: 'Expert Professors',
        employability: 'Employability'
      },
      viewMore: 'View More',
      whyChooseUs: 'Why choose Sagardoy?',
      whySubtitle: 'Leaders in specialized legal education',
      reasons: {
        specialization: {
          title: 'Legal Specialization',
          description: 'Specialized programs in Labor Law and bar admission'
        },
        practical: {
          title: 'Practical Training',
          description: 'Methodology based on real cases from the labor and business field'
        },
        networking: {
          title: 'Professional Network',
          description: 'Networking with labor lawyers and HR executives'
        },
        employability: {
          title: 'High Employability',
          description: '95% job placement in specialized law firms'
        }
      }
    },

    // Programs page
    programs: {
      title: 'Our Programs',
      subtitle: 'Specialized training in Labor Law, Bar Admission and Human Resources',
      filters: {
        all: 'All Programs',
        master: 'Masters',
        executive: 'Executive'
      },
      duration: 'Duration',
      price: 'Price',
      consult: 'Consult',
      moreInfo: 'More information'
    },

    // About page
    about: {
      title: 'The',
      titleHighlight: 'School',
      subtitle: 'With over 50 years of experience, Sagardoy Business School is a reference in specialized training in Labor Law, Bar Admission and Human Resources Management.',
      mission: 'Our Mission',
      missionText: 'To train highly qualified legal and human resources professionals, providing specialized and practical training that responds to labor market demands.',
      missionDetails: 'We combine the experience of active professionals with innovative methodologies, offering comprehensive training in the legal-labor and business field.',
      values: 'Our Values',
      valuesList: {
        specialization: {
          title: 'Legal Specialization',
          description: 'Specialized programs in Labor Law, bar admission and labor compliance.'
        },
        experience: {
          title: 'Professional Experience',
          description: 'Active professors with extensive experience in prestigious law firms and leading companies.'
        },
        networking: {
          title: 'Contact Network',
          description: 'Networking with legal sector professionals and human resources executives.'
        },
        practical: {
          title: 'Practical Training',
          description: 'Methodology based on real cases from the labor and business field.'
        }
      },
      statsLabels: {
        experience: 'Years of Experience',
        professionals: 'Trained Professionals',
        professors: 'Expert Professors',
        collaborators: 'Partner Law Firms'
      }
    },

    // News page
    news: {
      title: 'News and',
      titleHighlight: 'Events',
      subtitle: 'Stay updated with the latest news from the legal-labor sector',
      featuredNews: 'Featured News',
      latestNews: 'Latest News',
      upcomingEvents: 'Upcoming Events',
      readMore: 'Read more',
      readTime: 'min read'
    },

    // Contact page
    contact: {
      title: 'Contact',
      titleHighlight: 'Us',
      subtitle: 'We are here to solve all your questions about our programs',
      form: {
        name: 'Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        program: 'Program of interest',
        message: 'Message',
        privacy: 'I accept the privacy policy',
        send: 'Send message',
        sending: 'Sending...'
      },
      info: {
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        hours: 'Hours'
      },
      success: 'Message sent successfully',
      error: 'Error sending message'
    },

    // Admission page
    admission: {
      title: 'Admission',
      titleHighlight: 'Process',
      subtitle: 'Join the next generation of law and human resources professionals',
      form: {
        personalInfo: 'Personal Information',
        name: 'Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        program: 'Program',
        privacy: 'I accept the privacy policy',
        academicInfo: 'Academic Information',
        experience: 'Professional experience',
        motivation: 'Motivation for the program',
        education: 'Academic background',
        company: 'Current company',
        position: 'Current position',
        cv: 'Curriculum Vitae (URL)',
        submit: 'Submit application',
        submitting: 'Submitting...'
      },
      steps: {
        application: 'Online Application',
        applicationDesc: 'Complete the admission form',
        review: 'Review',
        reviewDesc: 'We evaluate your profile and experience',
        interview: 'Interview',
        interviewDesc: 'Personal interview with our team',
        admission: 'Admission',
        admissionDesc: 'Confirmation and enrollment'
      },
      success: 'Application submitted successfully',
      error: 'Error submitting application'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  }
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let current: any = translations[language];
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to Spanish if key not found
      current = translations['es'];
      for (const fallbackKey of keys) {
        if (current && typeof current === 'object' && fallbackKey in current) {
          current = current[fallbackKey];
        } else {
          return key; // Return the key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof current === 'string' ? current : key;
}