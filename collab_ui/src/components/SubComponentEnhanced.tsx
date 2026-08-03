import { useState, useEffect } from 'react';
import type { EntryData, DriverItem, InterventionItem } from '../types';
import { LEVELS } from '../constants/categories';

interface SubComponentEnhancedProps {
  subTitle: string;
  subIndex: number;
  entry: EntryData;
  onSave: (entry: EntryData) => void;
  isOther: boolean;
}

const genId = () => Math.random().toString(36).slice(2, 10);

const colStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
};

const colHeadStyle = (color: string): React.CSSProperties => ({
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color,
  marginBottom: '0.75rem',
});

const itemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  padding: '0.6rem 0.75rem',
  background: 'rgba(200,130,42,0.06)',
  border: '1px solid rgba(200,130,42,0.15)',
  borderRadius: '6px',
  marginBottom: '0.45rem',
};

const interventionItemStyle: React.CSSProperties = {
  ...itemRowStyle,
  background: 'white',
  border: '1px solid rgba(28,40,32,0.12)',
};

const iconBtn = (color = 'var(--rust)'): React.CSSProperties => ({
  padding: '0.2rem 0.4rem',
  background: 'transparent',
  border: `1px solid ${color}44`,
  borderRadius: '4px',
  fontSize: '0.72rem',
  color,
  cursor: 'pointer',
  lineHeight: 1,
  flexShrink: 0,
});

const addTextareaStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.6rem 0.8rem',
  border: '1.5px solid rgba(28,40,32,0.12)',
  borderRadius: '4px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.85rem',
  color: 'var(--deep)',
  background: 'var(--cream)',
  resize: 'vertical',
  minHeight: '56px',
  outline: 'none',
};

export const SubComponentEnhanced = ({ subTitle, entry, onSave, isOther }: SubComponentEnhancedProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [other, setOther] = useState(entry.other || '');
  const [levels, setLevels] = useState<string[]>(entry.levels || []);
  const [showSaveMsg, setShowSaveMsg] = useState(false);

  const [driversList, setDriversList] = useState<DriverItem[]>(entry.driversList || []);
  const [interventionsList, setInterventionsList] = useState<InterventionItem[]>(entry.interventionsList || []);

  const [newDriverText, setNewDriverText] = useState('');
  const [newInterventionText, setNewInterventionText] = useState('');
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);

  // Edit state
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [editingDriverText, setEditingDriverText] = useState('');
  const [editingInterventionId, setEditingInterventionId] = useState<string | null>(null);
  const [editingInterventionText, setEditingInterventionText] = useState('');

  useEffect(() => {
    setOther(entry.other || '');
    setLevels(entry.levels || []);
    setDriversList(entry.driversList || []);
    setInterventionsList(entry.interventionsList || []);
  }, [entry]);

  const autoSave = (
    drivers: DriverItem[],
    interventions: InterventionItem[],
    otherText: string,
    lvls: string[]
  ) => {
    onSave({
      drivers: entry.drivers || '',
      interventions: entry.interventions || '',
      driversList: drivers,
      interventionsList: interventions,
      other: otherText,
      levels: lvls,
      by: entry.by || [],
    });
  };

  // --- Drivers ---
  const handleAddDriver = () => {
    if (!newDriverText.trim()) return;
    const updated = [...driversList, { id: genId(), text: newDriverText.trim() }];
    setDriversList(updated);
    setNewDriverText('');
    autoSave(updated, interventionsList, other, levels);
  };

  const handleRemoveDriver = (id: string) => {
    const updated = driversList.filter(d => d.id !== id);
    const updatedInterventions = interventionsList.map(i => ({
      ...i,
      linkedDriverIds: i.linkedDriverIds.filter(dId => dId !== id),
    }));
    setDriversList(updated);
    setInterventionsList(updatedInterventions);
    autoSave(updated, updatedInterventions, other, levels);
  };

  const startEditDriver = (driver: DriverItem) => {
    setEditingDriverId(driver.id);
    setEditingDriverText(driver.text);
  };

  const confirmEditDriver = (id: string) => {
    if (!editingDriverText.trim()) return;
    const updated = driversList.map(d => d.id === id ? { ...d, text: editingDriverText.trim() } : d);
    setDriversList(updated);
    setEditingDriverId(null);
    autoSave(updated, interventionsList, other, levels);
  };

  // --- Interventions ---
  const handleAddIntervention = () => {
    if (!newInterventionText.trim()) return;
    const updated = [
      ...interventionsList,
      { id: genId(), text: newInterventionText.trim(), linkedDriverIds: [...selectedDriverIds], levels: [] },
    ];
    setInterventionsList(updated);
    setNewInterventionText('');
    setSelectedDriverIds([]);
    autoSave(driversList, updated, other, levels);
  };

  const handleRemoveIntervention = (id: string) => {
    const updated = interventionsList.filter(i => i.id !== id);
    setInterventionsList(updated);
    autoSave(driversList, updated, other, levels);
  };

  const startEditIntervention = (intervention: InterventionItem) => {
    setEditingInterventionId(intervention.id);
    setEditingInterventionText(intervention.text);
  };

  const confirmEditIntervention = (id: string) => {
    if (!editingInterventionText.trim()) return;
    const updated = interventionsList.map(i =>
      i.id === id ? { ...i, text: editingInterventionText.trim() } : i
    );
    setInterventionsList(updated);
    setEditingInterventionId(null);
    autoSave(driversList, updated, other, levels);
  };

  const toggleDriverSelection = (driverId: string) => {
    setSelectedDriverIds(prev =>
      prev.includes(driverId) ? prev.filter(id => id !== driverId) : [...prev, driverId]
    );
  };

  const handleInterventionLevelToggle = (interventionId: string, level: string) => {
    const updated = interventionsList.map(i => {
      if (i.id !== interventionId) return i;
      const newLevels = i.levels.includes(level)
        ? i.levels.filter(l => l !== level)
        : [...i.levels, level];
      return { ...i, levels: newLevels };
    });
    setInterventionsList(updated);
    autoSave(driversList, updated, other, levels);
  };

  const handleSave = () => {
    autoSave(driversList, interventionsList, other, levels);
    setShowSaveMsg(true);
    setTimeout(() => setShowSaveMsg(false), 2500);
  };

  return (
    <div className="sub-card">
      <div className="sub-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="sub-title">{subTitle}</div>
        <span className="sub-toggle">{isOpen ? '▲' : '▼'}</span>
      </div>

      <div className={`sub-body ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
        {isOther && (
          <div className="form-field" style={{ marginBottom: '1.5rem' }}>
            <label>Specify the challenge</label>
            <input
              className="other-input"
              placeholder="Describe this specific challenge…"
              value={other}
              onChange={(e) => {
                setOther(e.target.value);
                autoSave(driversList, interventionsList, e.target.value, levels);
              }}
            />
          </div>
        )}

        {/* Side-by-side columns */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>

          {/* LEFT: Drivers / Root Causes */}
          <div style={colStyle}>
            <div style={colHeadStyle('var(--rust)')}>Drivers / Root Causes</div>

            {driversList.map((driver, index) => (
              <div key={driver.id} style={itemRowStyle}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ochre)', minWidth: '18px', paddingTop: '2px' }}>
                  {index + 1}.
                </span>

                {editingDriverId === driver.id ? (
                  <>
                    <textarea
                      value={editingDriverText}
                      onChange={e => setEditingDriverText(e.target.value)}
                      autoFocus
                      style={{ ...addTextareaStyle, minHeight: '40px', flex: 1 }}
                      onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) confirmEditDriver(driver.id); }}
                    />
                    <button style={iconBtn('var(--forest)')} onClick={() => confirmEditDriver(driver.id)}>✓</button>
                    <button style={iconBtn()} onClick={() => setEditingDriverId(null)}>✕</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--deep)', lineHeight: 1.45 }}>
                      {driver.text}
                    </span>
                    <button style={iconBtn('var(--ochre)')} onClick={() => startEditDriver(driver)}>✏</button>
                    <button style={iconBtn()} onClick={() => handleRemoveDriver(driver.id)}>✕</button>
                  </>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
              <textarea
                placeholder="Add a driver or root cause…"
                value={newDriverText}
                onChange={e => setNewDriverText(e.target.value)}
                style={addTextareaStyle}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddDriver(); }}
              />
              <button
                onClick={handleAddDriver}
                style={{
                  padding: '0.6rem 0.9rem',
                  background: 'var(--ochre)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  alignSelf: 'flex-start',
                }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: 'rgba(28,40,32,0.1)', alignSelf: 'stretch', flexShrink: 0 }} />

          {/* RIGHT: Proposed Interventions */}
          <div style={colStyle}>
            <div style={colHeadStyle('var(--forest)')}>Proposed Interventions</div>

            {interventionsList.map((intervention, index) => (
              <div key={intervention.id} style={interventionItemStyle}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--forest)', minWidth: '18px', paddingTop: '2px' }}>
                  {index + 1}.
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingInterventionId === intervention.id ? (
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <textarea
                        value={editingInterventionText}
                        onChange={e => setEditingInterventionText(e.target.value)}
                        autoFocus
                        style={{ ...addTextareaStyle, minHeight: '40px', flex: 1 }}
                        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) confirmEditIntervention(intervention.id); }}
                      />
                      <button style={iconBtn('var(--forest)')} onClick={() => confirmEditIntervention(intervention.id)}>✓</button>
                      <button style={iconBtn()} onClick={() => setEditingInterventionId(null)}>✕</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.88rem', color: 'var(--deep)', lineHeight: 1.45, display: 'block', marginBottom: '0.5rem' }}>
                      {intervention.text}
                    </span>
                  )}

                  {/* Level tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: intervention.linkedDriverIds.length > 0 ? '0.5rem' : 0 }}>
                    {LEVELS.map(level => (
                      <span
                        key={level}
                        onClick={() => handleInterventionLevelToggle(intervention.id, level)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.68rem',
                          fontWeight: 500,
                          borderRadius: '14px',
                          border: intervention.levels.includes(level)
                            ? '1.5px solid var(--forest)'
                            : '1.5px solid rgba(28,40,32,0.18)',
                          background: intervention.levels.includes(level) ? 'var(--forest)' : 'transparent',
                          color: intervention.levels.includes(level) ? 'white' : 'var(--deep)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.12s',
                        }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>

                  {intervention.linkedDriverIds.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {intervention.linkedDriverIds.map(dId => {
                        const idx = driversList.findIndex(d => d.id === dId);
                        return idx >= 0 ? (
                          <span
                            key={dId}
                            style={{
                              fontSize: '0.68rem',
                              padding: '0.15rem 0.45rem',
                              background: 'rgba(200,130,42,0.15)',
                              border: '1px solid rgba(200,130,42,0.25)',
                              borderRadius: '10px',
                              color: 'var(--ochre)',
                              fontWeight: 500,
                            }}
                          >
                            Driver #{idx + 1}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {editingInterventionId !== intervention.id && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                    <button style={iconBtn('var(--forest)')} onClick={() => startEditIntervention(intervention)}>✏</button>
                    <button style={iconBtn()} onClick={() => handleRemoveIntervention(intervention.id)}>✕</button>
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: driversList.length > 0 ? '0.5rem' : 0 }}>
                <textarea
                  placeholder="Add a proposed intervention…"
                  value={newInterventionText}
                  onChange={e => setNewInterventionText(e.target.value)}
                  style={addTextareaStyle}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddIntervention(); }}
                />
                <button
                  onClick={handleAddIntervention}
                  style={{
                    padding: '0.6rem 0.9rem',
                    background: 'var(--forest)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    alignSelf: 'flex-start',
                  }}
                >
                  + Add
                </button>
              </div>

              {driversList.length > 0 && (
                <div style={{
                  padding: '0.6rem',
                  background: 'rgba(200,130,42,0.04)',
                  border: '1px dashed rgba(200,130,42,0.2)',
                  borderRadius: '4px',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--deep)', marginBottom: '0.4rem' }}>
                    Link to driver(s): (optional)
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {driversList.map((driver, index) => (
                      <button
                        key={driver.id}
                        onClick={() => toggleDriverSelection(driver.id)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          background: selectedDriverIds.includes(driver.id) ? 'var(--ochre)' : 'white',
                          color: selectedDriverIds.includes(driver.id) ? 'white' : 'var(--deep)',
                          border: `1.5px solid ${selectedDriverIds.includes(driver.id) ? 'var(--ochre)' : 'rgba(28,40,32,0.15)'}`,
                          borderRadius: '18px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: selectedDriverIds.includes(driver.id) ? 600 : 400,
                          transition: 'all 0.12s',
                        }}
                      >
                        Driver #{index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sub-save">
          <button className="btn-save" onClick={handleSave}>Save Input</button>
          <span className={`save-msg ${showSaveMsg ? 'show' : ''}`}>✓ Saved</span>
        </div>
      </div>
    </div>
  );
};
