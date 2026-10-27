import type { ReactNode } from "react";
import { Search, ArrowUpRight, Inbox, Info, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="action-row">{children}</div>
    </div>
  );
}
export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  const s = String(children);
  return (
    <span
      className={`badge ${/Aprovada|Aplicado|Concluído|Pronto|Adequado/.test(s) ? "success" : /Pendente|Em revisão|Média|andamento|preparação|Atenção/.test(s) ? "warning" : /Rejeitada|Difícil|Prioritária/.test(s) ? "danger" : /Rascunho|Arquivado|Fácil/.test(s) ? "neutral" : ""}`}
    >
      {children}
    </span>
  );
}
export function Metric({
  title,
  value,
  icon: Icon,
  note,
  tone = "",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  note: string;
  tone?: string;
}) {
  return (
    <div className="panel metric">
      <div className="metric-top">
        <span className="metric-label">{title}</span>
        <div className={`icon-tile ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">
        <ArrowUpRight size={13} className="text-success" />
        {note}
      </div>
    </div>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Buscar...",
  label = "Buscar",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="search-input flex-1 min-w-48">
      <Search size={16} />
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
export function SelectField({
  value,
  onChange,
  options,
  label,
  all,
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  label: string;
  all?: string;
}) {
  return (
    <select
      aria-label={label}
      className="control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {all && <option value="">{all}</option>}
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o}>{o}</option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ),
      )}
    </select>
  );
}
export function Empty({ text = "Nenhum registro encontrado." }: { text?: string }) {
  return (
    <div className="empty">
      <Inbox size={35} />
      <h3>{text}</h3>
      <p className="subtext">Tente ajustar os filtros selecionados.</p>
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description || "Dados demonstrativos do Mentary."}</DialogDescription>
        </DialogHeader>
        <div className="modal-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
export function DemoNote() {
  return (
    <span className="demo-note">
      <Info size={12} />
      Dados demonstrativos
    </span>
  );
}
export function Progress({ value, tone = "" }: { value: number; tone?: string }) {
  return (
    <div className="progress-track">
      <div
        className={`progress-fill ${tone}`}
        ref={(el) => {
          if (el) el.style.width = `${Math.min(100, Math.max(0, value))}%`;
        }}
      />
    </div>
  );
}
export function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" size="icon" title={label} aria-label={label} onClick={onClick}>
      {children}
    </Button>
  );
}
