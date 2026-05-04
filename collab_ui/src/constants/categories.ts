import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'c1',
    num: 'Category 1',
    title: 'Systems & Services',
    icon: 'H+',
    color: '#9B3A1A',
    subs: [
      'Zoonotic disease surveillance & early detection gaps',
      'Veterinary & Public Health gaps',
      'Laboratory and diagnostic capacity',
      'Data systems & information sharing',
      'Other – Specify'
    ]
  },
  {
    id: 'c2',
    num: 'Category 2',
    title: 'Human-Livestock-Wildlife-Environment interface risks',
    icon: 'W',
    color: '#C8822A',
    subs: [
      'Zoonotic disease transmission risk',
      'Human–wildlife–livestock interaction',
      'Antimicrobial resistance (AMR) practices',
      'Food safety & animal products handling',
      'Other – Specify'
    ]
  },
  {
    id: 'c3',
    num: 'Category 3',
    title: 'Community & Socio-Economic Risks',
    icon: 'C',
    color: '#6B8F4E',
    subs: [
      'Community knowledge, attitudes & practices',
      'Livelihoods vulnerabilities',
      'Risk communication & awareness gaps',
      'Cultural/Social practices',
      'Other – Specify'
    ]
  },
  {
    id: 'c4',
    num: 'Category 4',
    title: 'Environment, Climate & Disaster Risks',
    icon: 'E',
    color: '#3A6B8C',
    subs: [
      'Environmental degradation (land, water, habitats)',
      'Climate risks (drought, floods, variability)',
      'Disaster risk & emergency preparedness gaps',
      'Early warning & anticipatory action systems',
      'Other – Specify'
    ]
  },
  {
    id: 'c5',
    num: 'Category 5',
    title: 'Governance, Policy & Financing',
    icon: 'G',
    color: '#2D5016',
    subs: [
      'Coordination & multi-sectoral collaboration',
      'Policy & regulatory gaps',
      'Research & evidence gaps',
      'Financing & sustainability challenges',
      'Other – Specify'
    ]
  },
  {
    id: 'c6',
    num: 'Category 6',
    title: 'Other',
    icon: '+',
    color: '#D4A853',
    subs: [
      'Other – Specify'
    ]
  }
];

export const LEVELS = ['Community', 'County', 'National', 'Ecosystem'];
