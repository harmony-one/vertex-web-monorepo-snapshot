import { ErrorSection } from 'sections/ErrorSection/ErrorSection';

export default function Custom404() {
  return <ErrorSection statusCode={404} errorMessage="Page not found" />;
}
