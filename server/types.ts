export interface Seo {
  title: string;
  description: string;
  image?: string;
  alternates?: {
    canonical?: string;
  };
}

export type SeoContext = {
  path: string;
  url: string;
};

export type RouteProps<D = unknown> = {
  location: string;
  initialData?: D;
};

export interface RouteModule<D = unknown> {
  path: string | RegExp;
  getProps: (_req: { url: string }) => RouteProps<D>;
  getInitialData?: (_req: { url: string }) => Promise<D> | D;
  getSeo: (_ctx: SeoContext) => Promise<Seo> | Seo;
}
