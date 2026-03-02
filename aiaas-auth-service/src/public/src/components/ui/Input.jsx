import { useState, forwardRef } from 'react';
import './Input.css';

/**
 * Floating-label input with error state.
 */
const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    hint,
    id,
    required,
    className = '',
    ...props
  },
  ref
) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      <div className="input-wrapper">
        <input
          ref={ref}
          id={id}
          type={inputType}
          className="input-field"
          placeholder=" "
          required={required}
          {...props}
        />
        {label && (
          <label className="input-label" htmlFor={id}>
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            className="input-eye"
            onClick={() => setShowPass((s) => !s)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <p className="input-error">{error}</p>}
      {hint && !error && <p className="input-hint">{hint}</p>}
    </div>
  );
});

export default Input;
