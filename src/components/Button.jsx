import { Link } from 'react-router-dom';

const isInternal = (href) => href && href.startsWith('/') && !href.startsWith('//') && !/\.(pdf|png|jpg)$/i.test(href);

/** variant: primary | secondary | secondary-on-dark | text | navy */
export default function Button({ href, variant = 'primary', children, className = '', block = false, ...rest }) {
  const cls = `btn btn--${variant}${block ? ' btn--block' : ''} ${className}`.trim();
  const content = variant === 'text' ? <>{children} <span aria-hidden="true">→</span></> : children;
  if (!href) return <button className={cls} {...rest}>{content}</button>;
  if (isInternal(href)) return <Link to={href} className={cls} {...rest}>{content}</Link>;
  return <a href={href} className={cls} {...rest}>{content}</a>;
}
