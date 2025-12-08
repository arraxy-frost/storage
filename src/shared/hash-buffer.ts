import { createHash } from 'crypto';

export default function hashBuffer(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
}
