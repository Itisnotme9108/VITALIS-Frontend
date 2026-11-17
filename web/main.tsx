import { createRoot } from 'react-dom/client';
import { CompatibilityGate } from '../app/compatibility';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(<CompatibilityGate />);
