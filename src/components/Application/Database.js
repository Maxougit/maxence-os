'use client';
import React, { useState, useEffect } from 'react';
import SkillsHologram from './SkillsHologram';
import styles from './Database.module.css';
import { skillsData } from '@/data/cv';

const TABS = ['Schema', ...Object.keys(skillsData)];

const TAB_LABELS = {
  Schema: 'Schema',
  Programation: 'Langages',
  Technologies: 'Technos',
  Concepts: 'Concepts',
  Experiences: 'Parcours',
};

const totalSkills = Object.values(skillsData).reduce((sum, arr) => sum + arr.length, 0);

const Database = () => {
  const [tab, setTab] = useState('Schema');
  const [hovered, setHovered] = useState(null);

  return (
    <div className={styles.console}>
      <div className={styles.hudTop}>
        <span className={styles.brand}>MAXENCE.DB</span>
        <span className={styles.subtitle}>Neural Skill Core</span>
        <span className={styles.status}>
          <span className={styles.statusDot} />
          ONLINE
        </span>
      </div>

      <div className={styles.tabs} role="tablist">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            className={`${styles.tab} ${tab === name ? styles.active : ''}`}
            onClick={() => setTab(name)}
          >
            {TAB_LABELS[name] || name}
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        {tab === 'Schema' ? (
          <SchemaView hovered={hovered} onHover={setHovered} />
        ) : (
          <QueryConsole key={tab} category={tab} rows={skillsData[tab]} />
        )}
      </div>
    </div>
  );
};

const SchemaView = ({ hovered, onHover }) => (
  <>
    <div className={styles.canvasWrap}>
      <SkillsHologram skillsData={skillsData} onHover={onHover} />
    </div>

    <span className={`${styles.corner} ${styles.cornerTL}`} />
    <span className={`${styles.corner} ${styles.cornerTR}`} />
    <span className={`${styles.corner} ${styles.cornerBL}`} />
    <span className={`${styles.corner} ${styles.cornerBR}`} />
    <span className={styles.reticle} />

    <div className={styles.hudStats}>
      <div>
        NODES <b>{totalSkills}</b>
      </div>
      <div>
        CLUSTERS <b>{Object.keys(skillsData).length}</b>
      </div>
      <div>
        MODE <b>ORBIT</b>
      </div>
    </div>

    <div className={styles.readout}>
      {hovered ? (
        <>
          <span className={styles.readoutCat}>
            {hovered.type === 'category' ? 'CLUSTER' : hovered.category}
          </span>
          <div className={styles.readoutName}>{hovered.name}</div>
          <div className={styles.readoutDetails}>
            {hovered.type === 'category'
              ? `${hovered.count} compétences indexées`
              : hovered.details}
          </div>
        </>
      ) : (
        <div className={styles.readoutHint}>‹ survolez un nœud pour l’inspecter ›</div>
      )}
    </div>
  </>
);

const QueryConsole = ({ category, rows }) => {
  const query = `SELECT name, details FROM ${category}\nWHERE owner = 'maxence' ORDER BY level DESC;`;
  const [typed, setTyped] = useState('');
  const done = typed.length >= query.length;

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(query.slice(0, i));
      if (i >= query.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [query]);

  return (
    <div className={styles.query}>
      <pre className={styles.queryLine}>
        <span className={styles.prompt}>SQL▸</span>
        {typed}
        {!done && <span className={styles.caret}>█</span>}
      </pre>

      {done && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.rowsTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>name</th>
                  <th>details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((skill, index) => (
                  <tr key={skill.Name} style={{ animationDelay: `${index * 0.04}s` }}>
                    <td>{String(index + 1).padStart(2, '0')}</td>
                    <td>{skill.Name}</td>
                    <td>{skill.Details.join(' · ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.queryFooter}>
            <span>
              ▸ <b>{rows.length}</b> rows returned
            </span>
            <span>exec {(rows.length * 0.7 + 1.3).toFixed(1)} ms</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Database;
