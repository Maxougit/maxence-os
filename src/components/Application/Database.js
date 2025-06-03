import React, { useState } from 'react';
import SkillsUniverse from './SkillsUniverse';

const skillsData = {
  Programation: [
    {
      Name: 'C#',
      Details: ['WPF', 'UWP', 'API', '.NET', 'ORM'],
    },
    {
      Name: 'C++',
      Details: ['App Development'],
    },
    {
      Name: 'Python',
      Details: ['Data Analysis', 'Machine Learning', 'Web Development'],
    },
    {
      Name: 'JavaScript',
      Details: ['React', 'Angular', 'Next.js'],
    },
    {
      Name: 'TypeScript',
      Details: ['node.js', 'expressJS'],
    },
    {
      Name: 'Rust',
      Details: ['Systems Programming', 'Performance'],
    },
    {
      Name: 'SQL',
      Details: ['Database Design', 'Optimization'],
    },
    {
      Name: 'HTML/CSS',
      Details: ['Web Design', 'Responsive Layouts'],
    },
  ],
  Technologies: [
    {
      Name: 'Node.js',
      Details: ['Server-Side Programming', 'API Development'],
    },
    {
      Name: 'Git',
      Details: ['Version Control', 'Collaboration'],
    },
    {
      Name: 'Docker',
      Details: ['Containerization', 'Microservices'],
    },
    {
      Name: 'Kubernetes',
      Details: [
        'Container Orchestration',
        'Scalability',
        'Azure Kubernetes Service',
        'K8S',
      ],
    },
    {
      Name: 'Blockchain',
      Details: ['Smart Contracts', 'DApps'],
    },
    {
      Name: 'Linux',
      Details: ['Ubuntu Server', 'CentOS', 'Debian', 'Shell Scripting'],
    },
    {
      Name: 'Arduino',
      Details: ['Embedded Systems', 'IoT Projects'],
    },
  ],
  Concepts: [
    {
      Name: 'Decentralization',
      Details: ['Blockchain', 'P2P Networks'],
    },
    {
      Name: 'Self-Hosting',
      Details: ['Personal Data Management', 'Custom Servers'],
    },
    {
      Name: 'Networking',
      Details: ['LAN/WAN', 'Cisco Devices'],
    },
    {
      Name: 'Big Data',
      Details: ['Data Analysis', 'ETL Processes', 'Business Intelligence', 'Power BI'],
    },
  ],
  Experiences: [
    {
      Name: 'ArcelorMittal Distribution Solutions',
      Details: [
        'CDD & contrat pro BAC+5 (2+12 mois)',
        'Assistant projet – architecture GenAI et automatisation',
      ],
    },
    {
      Name: 'STELLANTIS',
      Details: [
        'Alternance – ingénieur informatique (3 ans)',
        "Développement d'outils IT et automatisation",
      ],
    },
    {
      Name: 'AXON’CABLE',
      Details: [
        'Stage – technicien systèmes & réseaux (2 mois)',
        'Maintenance infrastructure et support utilisateurs',
      ],
    },
    {
      Name: 'E.P.S.M.D de l’Aisne',
      Details: [
        'Stage – technicien systèmes & réseaux (2 mois)',
        'Déploiement et installation de postes',
      ],
    },
    {
      Name: 'Décathlon logistique',
      Details: ['Opérateur logistique (CDD de 2 mois)'],
    },
    {
      Name: 'Freelance / auto‑entrepreneur',
      Details: ['Intervention PC / réseau & développement web'],
    },
  ],
};

const Database = () => {
  const [selectedCategory, setSelectedCategory] = useState('Schema');

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const generateSQLQuery = (category) => {
    return [`SELECT name, details FROM ${category}`, `WHERE person = 'Maxence';`];
  };

  return (
    <div className="flex flex-col w-auto p-4 justify-center items-center h-full">
      <ul className="menu w-full menu-vertical lg:menu-horizontal bg-base-200 rounded-box mb-4">
        {['Schema', 'Programation', 'Technologies', 'Concepts', 'Experiences'].map(
          (tab, index) => (
            <li key={index}>
              <a
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  selectedCategory === tab ? ' text-blue-500' : 'none'
                }`}
                onClick={() => handleSelectCategory(tab)}
              >
                {tab}
              </a>
            </li>
          )
        )}
      </ul>

      {selectedCategory !== 'Schema' && (
        <>
          <div className="mb-4 w-full">
            <div className="mt-5">
              <pre className="bg-gray-800 text-green-400 p-5 rounded-lg overflow-x-auto">
                {generateSQLQuery(selectedCategory).map((query, i) => (
                  <React.Fragment key={i}>
                    {i === 0 && <span className="text-blue-500 mr-2">$</span>}
                    <code>{query}</code>
                    {i < generateSQLQuery(selectedCategory).length - 1 && <br />}
                  </React.Fragment>
                ))}
              </pre>
            </div>
          </div>
          <div className="flex-grow bg-white border rounded-md overflow-hidden h-64 w-full md:w-96">
            <div className="overflow-y-auto h-full">
              <table className="min-w-full divide-y">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skillsData[selectedCategory]?.map((skill, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-900">
                        {skill.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-900">
                        {skill.Details.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {selectedCategory === 'Schema' && (
        <div className="w-96 h-80 rounded-box">
          <SkillsUniverse skillsData={skillsData} />
        </div>
      )}
    </div>
  );
};

export default Database;
