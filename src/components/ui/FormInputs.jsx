import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

// Common wrapper/error/hint components
function FieldWrapper({ label, id, error, hint, required, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-xs">{children}</div>
      {error && (
        <p className="form-error" id={`${id}-error`}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p className="form-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── FormInput ─────────────────────────────────────────────────────────────────
export const FormInput = forwardRef(function FormInput(
  { label, id, error, hint, required, className = '', ...props },
  ref
) {
  return (
    <FieldWrapper label={label} id={id} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />
    </FieldWrapper>
  );
});

// ─── SelectInput ───────────────────────────────────────────────────────────────
export const SelectInput = forwardRef(function SelectInput(
  { label, id, error, hint, required, children, placeholder, className = '', ...props },
  ref
) {
  return (
    <FieldWrapper label={label} id={id} error={error} hint={hint} required={required} className={className}>
      <select
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`form-input appearance-none bg-no-repeat bg-right pr-10 ${error ? 'form-input-error' : ''}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundSize: '1.25rem 1.25rem',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    </FieldWrapper>
  );
});

// ─── DateInput ─────────────────────────────────────────────────────────────────
export const DateInput = forwardRef(function DateInput(
  { label, id, error, hint, required, className = '', ...props },
  ref
) {
  return (
    <FieldWrapper label={label} id={id} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        ref={ref}
        type="date"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />
    </FieldWrapper>
  );
});

// ─── QuantityInput ─────────────────────────────────────────────────────────────
export const QuantityInput = forwardRef(function QuantityInput(
  { label, id, error, hint, required, min = 0, className = '', ...props },
  ref
) {
  return (
    <FieldWrapper label={label} id={id} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        ref={ref}
        type="number"
        min={min}
        step="1"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        onKeyDown={(e) => {
          if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
        }}
        {...props}
      />
    </FieldWrapper>
  );
});

// ─── TextareaInput ─────────────────────────────────────────────────────────────
export const TextareaInput = forwardRef(function TextareaInput(
  { label, id, error, hint, required, rows = 3, className = '', ...props },
  ref
) {
  return (
    <FieldWrapper label={label} id={id} error={error} hint={hint} required={required} className={className}>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`form-input resize-none ${error ? 'form-input-error' : ''}`}
        {...props}
      />
    </FieldWrapper>
  );
});
