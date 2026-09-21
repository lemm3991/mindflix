import type { APIRoute } from 'astro';
import { execFile } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { invalidateCatalogCache } from '../../../lib/catalog';

const SCRIPT_PATH = path.resolve(process.cwd(), 'scan_library.py');
const SUMMARY_PATH = path.resolve(process.cwd(), 'src', 'data', 'catalog_summary.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const dryRun = body.dry_run !== false; // default to dry-run unless apply explicitly requested
    const flag = dryRun ? '--dry-run' : '--apply';

    const args: string[] = [SCRIPT_PATH, flag];

    if (body.root && typeof body.root === 'string') {
      const sanitizedRoot = path.resolve(body.root.trim());
      if (fs.existsSync(sanitizedRoot)) {
        args.push('--root', sanitizedRoot);
      }
    }

    const venvPythonWin = path.resolve(process.cwd(), '.venv', 'Scripts', 'python.exe');
    const venvPythonUnix = path.resolve(process.cwd(), '.venv', 'bin', 'python');
    let pythonBin = 'python';
    if (fs.existsSync(venvPythonWin)) {
      pythonBin = venvPythonWin;
    } else if (fs.existsSync(venvPythonUnix)) {
      pythonBin = venvPythonUnix;
    }

    return new Promise((resolve) => {
      execFile(pythonBin, args, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (!dryRun) {
          invalidateCatalogCache();
        }

        if (error) {
          return resolve(new Response(JSON.stringify({ 
            error: error.message, 
            stderr: stderr ? stderr.toString() : '' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }));
        }

        let summary: any = null;
        if (fs.existsSync(SUMMARY_PATH)) {
          try {
            summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf-8'));
          } catch {}
        }

        return resolve(new Response(JSON.stringify({
          success: true,
          dry_run: dryRun,
          output: stdout ? stdout.toString() : '',
          summary: summary || {
            status: 'completed',
            dry_run: dryRun,
            scanned_at: new Date().toISOString()
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Falha ao executar scanner.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
