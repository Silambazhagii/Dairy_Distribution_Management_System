import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

// ─── FieldWrapper ──────────────────────────────────────────────────────────────
interface FieldWrapperProps {
  label?: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FieldWrapper({ label, id, error, hint, required, children, className = '' }: FieldWrapperProps) {
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

// ─── Shared field props ─────────────────────────────────────────────────────────
interface FieldProps {
  label?: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

// ─── FormInput ─────────────────────────────────────────────────────────────────
type FormInputProps = FieldProps & React.ComponentPropsWithoutRef<'input'>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
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
type SelectInputProps = FieldProps & React.ComponentPropsWithoutRef<'select'> & {
  placeholder?: string;
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
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
type DateInputProps = FieldProps & Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
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
type QuantityInputProps = FieldProps & Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'step'> & {
  min?: number | string;
};

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(function QuantityInput(
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
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
        }}
        {...props}
      />
    </FieldWrapper>
  );
});

// ─── TextareaInput ─────────────────────────────────────────────────────────────
type TextareaInputProps = FieldProps & React.ComponentPropsWithoutRef<'textarea'> & {
  rows?: number;
};

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(function TextareaInput(
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
