import { useId } from "react";
import "./FilterDropdown.css";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterDropdownProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

/**
 * Dropdown de filtro no estilo do protótipo (label uppercase em cima,
 * caixa com valor em mono + chevron). Usa <select> nativo por baixo
 * para manter teclado/acessibilidade de graça, só estilizado por cima.
 */
export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: FilterDropdownProps) {
  const id = useId();

  return (
    <div className="filter-dropdown">
      <label htmlFor={id} className="filter-dropdown__label">
        {label}
      </label>

      <div
        className={`filter-dropdown__control ${
          disabled ? "filter-dropdown__control--disabled" : ""
        }`}
      >
        <select
          id={id}
          className="filter-dropdown__select"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span
          className="material-symbols-outlined filter-dropdown__chevron"
          aria-hidden="true"
        >
          arrow_drop_down
        </span>
      </div>
    </div>
  );
}

export default FilterDropdown;
