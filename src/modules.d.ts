declare module "*.module.css" {
  const styles: { [className: string]: string };
  export = styles;
}
declare module "*.css" {
  const content: { [className: string]: string } | string;
  export default content;
}

declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.sass" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}
