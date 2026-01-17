
export interface Skill {
    id: string;
    name: string;
    category: string;
    description: string;
    onet_code?: string; // O*NET canonical code
}

export interface Domain {
    id: string;
    name: string;
    skills: Skill[];
}

export const DOMAINS: Domain[] = [
    {
        id: 'agri_tech',
        name: 'Advanced Agriculture',
        skills: [
            { id: 'at_1', name: 'Precision Agriculture (IoT)', category: 'Technical', description: 'Deployment of sensor networks for micro-climate monitoring.', onet_code: '19-1012.00' },
            { id: 'at_2', name: 'Autonomous Drone Piloting', category: 'Operations', description: 'UAV operation for crop dusting and spectral imaging.', onet_code: '53-6051.00' },
            { id: 'at_3', name: 'Soil Chemistry Analysis', category: 'Science', description: 'Nitrogen/Phosphorus optimization algorithms.', onet_code: '19-1013.00' },
            { id: 'at_4', name: 'Agri-Supply Chain Logistics', category: 'Management', description: 'Cold-chain optimization and blockchain provenance.', onet_code: '11-3051.01' },
            { id: 'at_5', name: 'Vertical Farming Systems', category: 'Engineering', description: 'Hydroponic and aeroponic system architecture.', onet_code: '17-2199.00' },
            { id: 'at_6', name: 'Livestock Health biometrics', category: 'Data', description: 'Real-time monitoring of animal welfare via wearables.', onet_code: '29-1131.00' }
        ]
    },
    {
        id: 'computer_science',
        name: 'Computer Science',
        skills: [
            { id: 'cs_1', name: 'AI & Machine Learning', category: 'Advanced Computing', description: 'Neural network architecture and LLM fine-tuning.', onet_code: '15-1221.00' },
            { id: 'cs_2', name: 'Cloud Architecture (AWS/GCP)', category: 'Infrastructure', description: 'Scalable distributed systems design.', onet_code: '15-1299.08' },
            { id: 'cs_3', name: 'Cybersecurity Ops', category: 'Security', description: 'Penetration testing and zero-trust implementation.', onet_code: '15-1212.00' },
            { id: 'cs_4', name: 'Full-Stack Development', category: 'Engineering', description: 'Modern React/Node.js application lifecycle.', onet_code: '15-1252.00' },
            { id: 'cs_5', name: 'DevOps & CI/CD', category: 'Operations', description: 'Automated deployment pipelines and containerization.', onet_code: '15-1251.00' },
            { id: 'cs_6', name: 'Quantum Computing Fundamentals', category: 'Research', description: 'Qubit logic and quantum algorithm design.', onet_code: '19-1029.00' }
        ]
    },
    {
        id: 'smart_city',
        name: 'Smart Urban Systems',
        skills: [
            { id: 'sc_1', name: 'Urban IoT Grid', category: 'Technical', description: 'City-wide sensor mesh for traffic and waste.', onet_code: '17-2051.00' },
            { id: 'sc_2', name: 'Geospatial Data (GIS)', category: 'Analytics', description: 'Spatial analysis for zoning and transit planning.', onet_code: '15-1199.04' },
            { id: 'sc_3', name: 'Renewable Microgrids', category: 'Energy', description: 'Solar/Wind integration into municipal power.', onet_code: '17-2199.03' }
        ]
    }
];

export const MOCK_USER_SKILLS: Record<string, number> = {
    'at_1': 4,
    'at_2': 3,
    'cs_1': 2,
    'cs_4': 5,
    'sc_2': 4
};
