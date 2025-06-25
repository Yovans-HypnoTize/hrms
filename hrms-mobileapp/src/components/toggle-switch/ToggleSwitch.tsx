import "./toggle-switch.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="my-auto">
      <label className="custom-toggle-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider1"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
