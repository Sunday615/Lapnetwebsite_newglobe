export const TOKEN_PREFIX = "/r/";

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "");
}

export function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecode(b64url: string): string {
  const normalized = String(b64url || "").trim().replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : "";
  const binary = atob(normalized + pad);

  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

export function normalizeInternalPath(input: string): string {
  let value = stripControlChars(String(input || "").trim());

  if (!value) {
    return "/";
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
    return "/";
  }

  if (value.startsWith("#")) {
    value = value.slice(1);
  }

  if (!value.startsWith("/")) {
    value = `/${value}`;
  }

  value = value.replace(/^\/{2,}/, "/");

  if (value.startsWith(TOKEN_PREFIX)) {
    return "/";
  }

  return value;
}

export function encodePathToken(fullPath: string): string {
  return base64UrlEncode(normalizeInternalPath(fullPath));
}

export function decodePathToken(token: string): string | null {
  try {
    const decoded = base64UrlDecode(token);
    return normalizeInternalPath(decoded);
  } catch {
    return null;
  }
}