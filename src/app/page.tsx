import { CalsumaApp } from '@/components/CalsumaApp';

/**
 * Home route. The calculator is fully client-interactive, but the shell renders
 * on the server for fast first paint and SEO.
 */
export default function HomePage() {
  return <CalsumaApp />;
}
