'use client';
import React, { useState } from 'react';
import { TRASH_FILES } from '@/data/filesystem';
import { FileIcon } from '@/components/Icons/AppIcons';

/**
 * La Corbeille — easter egg. On peut la vider, évidemment.
 */
const Trash = () => {
  const [emptied, setEmptied] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {emptied ? (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--mac-text-tertiary)',
              fontSize: '13px',
              marginTop: '60px',
            }}
          >
            La corbeille est vide.
            <br />
            Comme mon backlog un vendredi soir.
          </p>
        ) : (
          TRASH_FILES.map((file) => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              <span style={{ width: 26, height: 26, display: 'inline-flex' }}>
                <FileIcon extension={file.extension} />
              </span>
              <span style={{ flex: 1 }}>{file.name}</span>
              <span style={{ color: 'var(--mac-text-tertiary)', fontSize: '12px' }}>
                {file.size}
              </span>
            </div>
          ))
        )}
      </div>
      <div
        style={{
          padding: '9px 14px',
          borderTop: '1px solid var(--mac-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--mac-text-secondary)',
        }}
      >
        <span>{emptied ? '0 élément' : `${TRASH_FILES.length} éléments`}</span>
        {!emptied && (
          <button
            type="button"
            onClick={() => setEmptied(true)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid var(--mac-border-strong)',
              background: 'var(--mac-hover)',
              color: 'var(--mac-text)',
              fontSize: '12px',
              fontFamily: 'inherit',
              cursor: 'default',
            }}
          >
            Vider la corbeille
          </button>
        )}
      </div>
    </div>
  );
};

export default Trash;
