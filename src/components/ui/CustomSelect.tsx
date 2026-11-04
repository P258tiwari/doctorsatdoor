'use client';

import { Children, isValidElement, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './custom-select.css';

type Props = {
  children: ReactNode;
  value: string | number;
  onChange: (event: { target: { value: string } }) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  'aria-label'?: string;
};

function textOf(node: ReactNode): string {
  return Children.toArray(node).map(child => isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : String(child)).join('');
}

export function CustomSelect({ children, value, onChange, id, name, disabled, required, className = '', 'aria-label': label }: Props) {
  const uid = useId();
  const menuId = `${uid}-options`;
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const typed = useRef('');
  const typedAt = useRef(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const options = Children.toArray(children).flatMap(child => {
    if (!isValidElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>(child)) return [];
    const text = textOf(child.props.children).trim();
    return [{ value: String(child.props.value ?? text), label: text, disabled: Boolean(child.props.disabled) }];
  });
  const selected = options.findIndex(option => option.value === String(value));

  const place = useCallback(() => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const upward = below < Math.min(260, options.length * 42 + 16) && above > below;
    const height = Math.max(70, Math.min(288, upward ? above : below));
    const width = Math.min(Math.max(rect.width, 180), window.innerWidth - 24);
    setPosition({ position: 'fixed', margin: 0, inset: 'auto', left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width, maxHeight: height, ...(upward ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }) });
  }, [options.length]);

  function show(index = selected >= 0 ? selected : options.findIndex(option => !option.disabled)) {
    if (disabled || !options.length) return;
    setActive(Math.max(0, index));
    place();
    menu.current?.showPopover();
    setOpen(true);
  }

  function close() {
    menu.current?.hidePopover();
    setOpen(false);
    typed.current = '';
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange({ target: { value: option.value } });
    close();
    trigger.current?.focus({ preventScroll: true });
  }

  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Tab') { close(); return; }
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
      if (!enabled.length) return;
      let next = active;
      if (event.key === 'Home') next = enabled[0];
      else if (event.key === 'End') next = enabled[enabled.length - 1];
      else if (!open) next = selected >= 0 ? selected : enabled[0];
      else next = enabled[(enabled.indexOf(active) + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length];
      if (!open) show(next); else setActive(next);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(active); else show();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      typed.current = (now - typedAt.current > 700 ? '' : typed.current) + event.key.toLowerCase();
      typedAt.current = now;
      const match = options.findIndex(option => !option.disabled && option.label.toLowerCase().startsWith(typed.current));
      if (match >= 0) { if (!open) show(match); else setActive(match); }
    }
  }

  useEffect(() => {
    const list = menu.current;
    const option = document.getElementById(`${menuId}-${active}`);
    if (!open || !list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }, [active, open, menuId]);

  useEffect(() => {
    if (!open) return;
    const reposition = (event: Event) => {
      if (event.target instanceof Node && menu.current?.contains(event.target)) return;
      place();
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => { window.removeEventListener('resize', reposition); window.removeEventListener('scroll', reposition, true); };
  }, [open, place]);

  return <span className={`custom-select ${className}`}>
    {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    <button ref={trigger} id={id} type="button" role="combobox" className="custom-select-trigger" aria-label={label} aria-expanded={open} aria-controls={menuId} aria-haspopup="listbox" aria-required={required} aria-activedescendant={open ? `${menuId}-${active}` : undefined} disabled={disabled || !options.length} onKeyDown={keyboard} onClick={() => open ? close() : show()}>
      <span>{options[selected]?.label || 'Select an option'}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    <div ref={menu} id={menuId} popover="auto" role="listbox" aria-label={label || 'Options'} className="custom-select-menu" style={position} onToggle={event => setOpen((event.nativeEvent as ToggleEvent).newState === 'open')}>
      {options.map((option, index) => <div key={option.value} id={`${menuId}-${index}`} role="option" aria-selected={index === selected} aria-disabled={option.disabled || undefined} className={`custom-select-option ${index === active ? 'is-active' : ''}`} onPointerMove={() => { if (!option.disabled) setActive(index); }} onMouseDown={event => event.preventDefault()} onClick={event => { event.preventDefault(); event.stopPropagation(); choose(index); }}>
        <span>{option.label}</span>{index === selected && <Check size={16} aria-hidden="true" />}
      </div>)}
    </div>
  </span>;
}
