import { useState, useEffect } from 'react';
import type { EntryData } from '../types';

interface SubComponentProps {
  subTitle: string;
  subIndex: number;
  entry: EntryData;
  onSave: (entry: EntryData) => void;
  isOther: boolean;
}

export const SubComponent = ({ subTitle, entry, onSave, isOther }: SubComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drivers, setDrivers] = useState(entry.drivers || '');
  const [interventions, setInterventions] = useState(entry.interventions || '');
  const [other, setOther] = useState(entry.other || '');
  const [levels, setLevels] = useState<string[]>(entry.levels || []);
  const [showSaveMsg, setShowSaveMsg] = useState(false);

  useEffect(() => {
    setDrivers(entry.drivers || '');
    setInterventions(entry.interventions || '');
    setOther(entry.other || '');
    setLevels(entry.levels || []);
  }, [entry]);

  const autoSave = (d: string, i: string, o: string, l: string[]) => {
    onSave({
      drivers: d,
      interventions: i,
      other: o,
      levels: l,
      by: entry.by || []
    });
  };

  const handleSave = () => {
    onSave({
      drivers,
      interventions,
      other,
      levels,
      by: entry.by || []
    });
    setShowSaveMsg(true);
    setTimeout(() => setShowSaveMsg(false), 2500);
  };

  return (
    <div className="sub-card">
      <div className="sub-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="sub-title">{subTitle}</div>
        <span className="sub-toggle">{isOpen ? '▲' : '▼'}</span>
      </div>
      <div className={`sub-body ${isOpen ? 'open' : ''}`}>
        {isOther && (
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label>Specify the challenge</label>
            <input
              className="other-input"
              placeholder="Describe this specific challenge…"
              value={other}
              onChange={(e) => {
                setOther(e.target.value);
                autoSave(drivers, interventions, e.target.value, levels);
              }}
            />
          </div>
        )}
        <div className="form-field">
          <label>Drivers / Root Causes</label>
          <textarea
            placeholder="What are the underlying drivers or root causes?"
            value={drivers}
            onChange={(e) => {
              setDrivers(e.target.value);
              autoSave(e.target.value, interventions, other, levels);
            }}
          />
        </div>
        <div className="form-field">
          <label>Proposed Interventions</label>
          <textarea
            placeholder="What interventions do you propose?"
            value={interventions}
            onChange={(e) => {
              setInterventions(e.target.value);
              autoSave(drivers, e.target.value, other, levels);
            }}
          />
        </div>
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
