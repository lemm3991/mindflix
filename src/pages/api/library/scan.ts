import type { APIRoute } from 'astro';
import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

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
    const customRoot = body.root ? ` --root "${body.root}"` : '';
    const flag = dryRun ? '--dry-run' : '--apply';

    const venvPythonWin = path.resolve(process.cwd(), '.venv', 'Scripts', 'python.exe');
    const venvPythonUnix = path.resolve(process.cwd(), '.venv', 'bin', 'python');
    let pythonBin = 'python';
    if (fs.existsSync(venvPythonWin)) {
      pythonBin = `"${venvPythonWin}"`;
    } else if (fs.existsSync(venvPythonUnix)) {
      pythonBin = `"${venvPythonUnix}"`;
    }

    const cmd = `${pythonBin} "${SCRIPT_PATH}" ${flag}${customRoot}`;

    return new Promise((resolve) => {
      exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          return resolve(new Response(JSON.stringify({ 
            error: error.message, 
            stderr: stderr.toString() 
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
          output: stdout.toString(),
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
