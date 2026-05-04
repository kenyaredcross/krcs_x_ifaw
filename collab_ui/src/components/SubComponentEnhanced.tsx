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

export const SubComponentEnhanced = ({ subTitle, entry, onSave, isOther }: SubComponentEnhancedProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [other, setOther] = useState(entry.other || '');
  const [levels, setLevels] = useState<string[]>(entry.levels || []);
  const [showSaveMsg, setShowSaveMsg] = useState(false);

  // New structured lists
  const [driversList, setDriversList] = useState<DriverItem[]>(entry.driversList || []);
  const [interventionsList, setInterventionsList] = useState<InterventionItem[]>(entry.interventionsList || []);

  // Input states
  const [newDriverText, setNewDriverText] = useState('');
  const [newInterventionText, setNewInterventionText] = useState('');
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);

  useEffect(() => {
    setOther(entry.other || '');
    setLevels(entry.levels || []);
    setDriversList(entry.driversList || []);
    setInterventionsList(entry.interventionsList || []);
  }, [entry]);

  const autoSave = (drivers: DriverItem[], interventions: InterventionItem[], otherText: string, lvls: string[]) => {
    onSave({
      drivers: entry.drivers || '', // Keep legacy field
      interventions: entry.interventions || '', // Keep legacy field
      driversList: drivers,
      interventionsList: interventions,
      other: otherText,
      levels: lvls,
      by: entry.by || []
    });
  };

  const handleAddDriver = () => {
    if (!newDriverText.trim()) return;

    const newDriver: DriverItem = {
      id: genId(),
      text: newDriverText.trim()
    };

    const updated = [...driversList, newDriver];
    setDriversList(updated);
    setNewDriverText('');
    autoSave(updated, interventionsList, other, levels);
  };

  const handleRemoveDriver = (id: string) => {
    const updated = driversList.filter(d => d.id !== id);
    setDriversList(updated);

    // Remove this driver from all intervention links
    const updatedInterventions = interventionsList.map(int => ({
      ...int,
      linkedDriverIds: int.linkedDriverIds.filter(dId => dId !== id)
    }));
    setInterventionsList(updatedInterventions);

    autoSave(updated, updatedInterventions, other, levels);
  };

  const handleAddIntervention = () => {
    if (!newInterventionText.trim()) return;

    const newIntervention: InterventionItem = {
      id: genId(),
      text: newInterventionText.trim(),
      linkedDriverIds: [...selectedDriverIds],
      levels: []
    };

    const updated = [...interventionsList, newIntervention];
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

  const toggleDriverSelection = (driverId: string) => {
    setSelectedDriverIds(prev =>
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const handleInterventionLevelToggle = (interventionId: string, level: string) => {
    const updated = interventionsList.map(intervention => {
      if (intervention.id === interventionId) {
        const newLevels = intervention.levels.includes(level)
          ? intervention.levels.filter(l => l !== level)
          : [...intervention.levels, level];
        return { ...intervention, levels: newLevels };
      }
      return intervention;
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
          <div className="form-field" style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
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

        {/* Drivers Section */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--rust)',
            marginBottom: '0.75rem'
          }}>
            Drivers / Root Causes
          </label>

          {/* Existing drivers list */}
          <div style={{ marginBottom: '1rem' }}>
            {driversList.map((driver, index) => (
              <div
                key={driver.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(200,130,42,0.06)',
                  border: '1px solid rgba(200,130,42,0.15)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}
              >
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--ochre)',
                  minWidth: '20px'
                }}>
                  {index + 1}.
                </span>
                <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--deep)' }}>
                  {driver.text}
                </span>
                <button
                  onClick={() => handleRemoveDriver(driver.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(155,58,26,0.3)',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--rust)',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add new driver */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <textarea
              placeholder="Add a new driver or root cause..."
              value={newDriverText}
              onChange={(e) => setNewDriverText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.7rem 0.9rem',
                border: '1.5px solid rgba(28,40,32,0.12)',
                borderRadius: '4px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                color: 'var(--deep)',
                background: 'var(--cream)',
                resize: 'vertical',
                minHeight: '60px',
                outline: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddDriver();
                }
              }}
            />
            <button
              onClick={handleAddDriver}
              style={{
                padding: '0.7rem 1.2rem',
                background: 'var(--ochre)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              + Add Driver
            </button>
          </div>
        </div>

        {/* Interventions Section */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--rust)',
            marginBottom: '0.75rem'
          }}>
            Proposed Interventions
          </label>

          {/* Existing interventions list */}
          <div style={{ marginBottom: '1rem' }}>
            {interventionsList.map((intervention, index) => (
              <div
                key={intervention.id}
                style={{
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid rgba(28,40,32,0.12)',
                  borderRadius: '6px',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--forest)',
                    minWidth: '20px'
                  }}>
                    {index + 1}.
                  </span>
                  <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--deep)' }}>
                    {intervention.text}
                  </span>
                  <button
                    onClick={() => handleRemoveIntervention(intervention.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: '1px solid rgba(155,58,26,0.3)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--rust)',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Level of Intervention for this specific intervention */}
                <div style={{ paddingLeft: '2rem', marginBottom: intervention.linkedDriverIds.length > 0 ? '0.75rem' : 0 }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--deep)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Level of Intervention:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {LEVELS.map((level) => (
                      <span
                        key={level}
                        onClick={() => handleInterventionLevelToggle(intervention.id, level)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          borderRadius: '16px',
                          border: intervention.levels.includes(level)
                            ? '1.5px solid var(--forest)'
                            : '1.5px solid rgba(28,40,32,0.2)',
                          background: intervention.levels.includes(level)
                            ? 'var(--forest)'
                            : 'transparent',
                          color: intervention.levels.includes(level)
                            ? 'white'
                            : 'var(--deep)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          userSelect: 'none'
                        }}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                {intervention.linkedDriverIds.length > 0 && (
                  <div style={{ paddingLeft: '2rem' }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--ochre)',
                      fontWeight: 500,
                      marginBottom: '0.25rem'
                    }}>
                      Addresses drivers:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {intervention.linkedDriverIds.map(driverId => {
                        const driver = driversList.find(d => d.id === driverId);
                        const driverIndex = driversList.findIndex(d => d.id === driverId);
                        return driver ? (
                          <span
                            key={driverId}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              background: 'rgba(200,130,42,0.15)',
                              border: '1px solid rgba(200,130,42,0.25)',
                              borderRadius: '12px',
                              color: 'var(--ochre)',
                              fontWeight: 500
                            }}
                          >
                            Driver #{driverIndex + 1}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new intervention */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <textarea
                placeholder="Add a new proposed intervention..."
                value={newInterventionText}
                onChange={(e) => setNewInterventionText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.7rem 0.9rem',
                  border: '1.5px solid rgba(28,40,32,0.12)',
                  borderRadius: '4px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.88rem',
                  color: 'var(--deep)',
                  background: 'var(--cream)',
                  resize: 'vertical',
                  minHeight: '60px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddIntervention();
                  }
                }}
              />
              <button
                onClick={handleAddIntervention}
                style={{
                  padding: '0.7rem 1.2rem',
                  background: 'var(--forest)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  alignSelf: 'flex-start'
                }}
              >
                + Add Intervention
              </button>
            </div>

            {/* Link to drivers */}
            {driversList.length > 0 && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(200,130,42,0.04)',
                border: '1px dashed rgba(200,130,42,0.2)',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--deep)',
                  marginBottom: '0.5rem'
                }}>
                  Link this intervention to driver(s): (optional)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {driversList.map((driver, index) => (
                    <button
                      key={driver.id}
                      onClick={() => toggleDriverSelection(driver.id)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: selectedDriverIds.includes(driver.id) ? 'var(--ochre)' : 'white',
                        color: selectedDriverIds.includes(driver.id) ? 'white' : 'var(--deep)',
                        border: `1.5px solid ${selectedDriverIds.includes(driver.id) ? 'var(--ochre)' : 'rgba(28,40,32,0.15)'}`,
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: selectedDriverIds.includes(driver.id) ? 600 : 400,
                        transition: 'all 0.15s'
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

        

        {/* Save Button */}
        <div className="sub-save">
          <button className="btn-save" onClick={handleSave}>
            Save Input
          </button>
          <span className={`save-msg ${showSaveMsg ? 'show' : ''}`}>✓ Saved</span>
        </div>
      </div>
    </div>
  );
};
