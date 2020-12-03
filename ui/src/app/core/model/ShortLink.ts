export interface ShortLink {
  created_at: Date;
  modified_at: Date;
  id: number;
  title: string;
  link: string;
  fragment: string;
  long_url: string;
}
