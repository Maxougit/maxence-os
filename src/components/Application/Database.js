import React, { useEffect, useState } from "react";
import styles from "./Database.module.css";

const skillsData = [
  {
    id: 1,
    skill: "Python",
    details: {
      applications: ["Automatisation", "Scraping", "Selenium", "DataAnalysis"],
    },
  },
  {
    id: 2,
    skill: "React",
    details: {
      applications: ["next.js", "Angular", "API", "ORM"],
    },
  },
  {
    id: 3,
    skill: "C#",
    details: {
      applications: ["WPF", "UWP", "API", "ORM", ".NET"],
    },
  },
  {
    id: 4,
    skill: "SQL",
    details: {
      applications: ["MySQL", "MicrosoftSQL", "MariaDB", "PostgreSQL"],
    },
  },
  {
    id: 5,
    skill: "HTML/CSS",
    details: {
      applications: ["Tailwind", "MUI"],
    },
  },
];

const Database = () => {
  // État pour stocker les compétences chargées
  const [skills, setSkills] = useState([]);
  // État pour la compétence sélectionnée
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Simule le chargement des données
  useEffect(() => {
    setSkills(skillsData);
  }, []);

  return (
    <div className={styles.databasewindow}>
      <div className={styles.header}>Compétences</div>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          {skills.map((skill) => (
            <div key={skill.id} className={styles.sidebarBTN} onClick={() => setSelectedSkill(skill)}>
              {skill.skill}
            </div>
          ))}
        </div>
        <div className={styles.database}>
          {selectedSkill ? (
            <div>
              <ul>
                {selectedSkill.details.applications.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div>Sélectionnez une compétence pour voir les détails.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Database;
