export interface ListField {
  readonly key: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly secret?: boolean;
}

export interface ListRow {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly hint?: string;
  readonly mono?: boolean;
  readonly editValues?: Record<string, string>;
}
