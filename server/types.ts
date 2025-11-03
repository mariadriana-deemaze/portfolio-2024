export interface Seo {
  title: string;
  description: string;
  image: string;
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
  getProps: (req: { url: string }) => RouteProps<D>;
  getSeo: (ctx: SeoContext) => Seo;
}
