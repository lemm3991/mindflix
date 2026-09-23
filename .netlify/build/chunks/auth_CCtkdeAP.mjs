import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/lib/server/auth.ts
var SESSION_SECRET = process.env.AUTH_SECRET || "mindflix-secure-production-secret-salt-2026-v1";
var COOKIE_NAME = "mindflix_session";
var SESSION_MAX_AGE_SECONDS = 2592e3;
var BCRYPT_SALT_ROUNDS = 12;
var INITIAL_USERS = [{
	id: "user-lemmg0800",
	username: "lemmg0800",
	email: "lemmg0800@mindflix.local",
	name: "Lemmg0800",
	defaultPasswordBcrypt: "$2b$12$SKlRFwDPob5NpZY8wCj5oeVmsaFBuEwWjy3y1i7dpOcV7X9yKJX0u"
}, {
	id: "user-tamydoagro",
	username: "tamydoagro",
	email: "tamydoagro@mindflix.local",
	name: "Tamydoagro",
	defaultPasswordBcrypt: "$2b$12$TIh97M2oQQKcO85uzOEYkuHTfytbHtKWyScQ7nk5qCry0L/XPWf3u"
}];
var PRIMARY_CUSTOM_PASS_PATH = path.resolve(process.cwd(), "src", "data", "custom_passwords.json");
var TMP_CUSTOM_PASS_PATH = path.join(os.tmpdir(), "mindflix_custom_passwords.json");
function getCustomPasswordHashes() {
	let custom = {};
	if (fs.existsSync(PRIMARY_CUSTOM_PASS_PATH)) try {
		custom = JSON.parse(fs.readFileSync(PRIMARY_CUSTOM_PASS_PATH, "utf8"));
	} catch {}
	if (fs.existsSync(TMP_CUSTOM_PASS_PATH)) try {
		const tmp = JSON.parse(fs.readFileSync(TMP_CUSTOM_PASS_PATH, "utf8"));
		custom = {
			...custom,
			...tmp
		};
	} catch {}
	return custom;
}
function saveCustomPasswordHash(username, bcryptHash) {
	const current = getCustomPasswordHashes();
	current[username.toLowerCase()] = bcryptHash;
	const jsonStr = JSON.stringify(current, null, 2);
	try {
		const dir = path.dirname(PRIMARY_CUSTOM_PASS_PATH);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(PRIMARY_CUSTOM_PASS_PATH, jsonStr, "utf8");
		return true;
	} catch (err) {
		try {
			fs.writeFileSync(TMP_CUSTOM_PASS_PATH, jsonStr, "utf8");
			return true;
		} catch {
			return false;
		}
	}
}
function findUserByUsername(username) {
	if (!username) return null;
	const norm = username.trim().toLowerCase();
	return INITIAL_USERS.find((u) => u.username.toLowerCase() === norm || u.email.toLowerCase() === norm) || null;
}
function findUserById(id) {
	if (!id) return null;
	return INITIAL_USERS.find((u) => u.id === id) || null;
}
/**
* Verifies credentials using standard Bcrypt constant-time comparison
*/
async function verifyCredentials(inputLogin, inputPass) {
	if (!inputLogin || !inputPass) return { success: false };
	const user = findUserByUsername(inputLogin);
	if (!user) return { success: false };
	const targetHash = getCustomPasswordHashes()[user.username.toLowerCase()] || user.defaultPasswordBcrypt;
	try {
		if (await bcrypt.compare(inputPass.trim(), targetHash)) return {
			success: true,
			user
		};
	} catch (err) {
		console.error("Bcrypt comparison error:", err);
	}
	return { success: false };
}
/**
* Updates password using standard Bcrypt hashing with 12 salt rounds
*/
async function updateServerUserPassword(username, newPass) {
	if (!username || !newPass || newPass.trim().length < 6) return false;
	const user = findUserByUsername(username);
	if (!user) return false;
	try {
		const bcryptHash = await bcrypt.hash(newPass.trim(), BCRYPT_SALT_ROUNDS);
		return saveCustomPasswordHash(user.username, bcryptHash);
	} catch (err) {
		console.error("Bcrypt hashing error:", err);
		return false;
	}
}
function createSessionToken(user) {
	const iat = Math.floor(Date.now() / 1e3);
	const exp = iat + SESSION_MAX_AGE_SECONDS;
	const payload = {
		uid: user.id,
		username: user.username,
		name: user.name,
		iat,
		exp
	};
	const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
	return `${payloadB64}.${crypto.createHmac("sha256", SESSION_SECRET).update(payloadB64).digest("base64url")}`;
}
function verifySessionToken(token) {
	if (!token || typeof token !== "string") return null;
	const parts = token.split(".");
	if (parts.length !== 2) return null;
	const [payloadB64, signature] = parts;
	const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(payloadB64).digest("base64url");
	try {
		const sigBuf = Buffer.from(signature, "utf8");
		const expSigBuf = Buffer.from(expectedSig, "utf8");
		if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) return null;
	} catch {
		return null;
	}
	try {
		const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
		const now = Math.floor(Date.now() / 1e3);
		if (payload.exp && payload.exp < now) return null;
		if (!findUserById(payload.uid)) return null;
		return payload;
	} catch {
		return null;
	}
}
//#endregion
export { verifyCredentials as a, updateServerUserPassword as i, SESSION_MAX_AGE_SECONDS as n, verifySessionToken as o, createSessionToken as r, COOKIE_NAME as t };
