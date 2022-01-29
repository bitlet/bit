import { SignJWT, jwtVerify } from 'https://deno.land/x/jose@v4.1.1/index.ts';
import { Base64 } from '../../deps.ts';

export interface Header {
    iss: string;
    exp: string;
    sub?: string;
}

export interface Payload {
    [key: string]: unknown;
}

export class Auth {
    public async generateKey() {
        const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, [
            'sign',
            'verify',
        ]);

        const exported = await crypto.subtle.exportKey('raw', key);

        return Base64.encode(exported);
    }

    /** @param alg Defaults to HS512 */
    public async create(
        header: Header,
        payload: Payload,
        secret: string,
        alg = 'HS512',
    ): Promise<string> {
        const jwt = await new SignJWT(payload)
            .setProtectedHeader({ alg: alg, typ: 'JWT' })
            .setIssuedAt()
            .setIssuer(header.iss)
            .setExpirationTime(header.exp)
            .setSubject(header.sub ?? '')
            .sign(Base64.decode(secret));

        return jwt;
    }

    /** @param alg Defaults to HS512 */
    public async verify(header: Header, jwt: string, secret: string) {
        const { payload, protectedHeader } = await jwtVerify(jwt, Base64.decode(secret), {
            issuer: header.iss,
        });

        console.log(protectedHeader);
        console.log(payload);

        return true;
    }
}
