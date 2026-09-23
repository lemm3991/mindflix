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
    if (body.drive !== false) {
      args.push('--drive');
    } else {
      args.push('--no-drive');
    }

    if (body.root && typeof body.root === 'string') {
      const sanitizedRoot = path.resolve(body.root.trim());
      if (fs.existsSync(sanitizedRoot)) {
        args.push('--root', sanitizedRoot);
      }
    }

    const isCloudEnv = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL);
    if (isCloudEnv) {
      return new Response(JSON.stringify({
        success: true,
        dry_run: dryRun,
        is_cloud: true,
        output: [
          '======================================================',
          'ℹ️  VARREDURA DE BIBLIOTECA — AMBIENTE EM NUVEM (NETLIFY)',
          '======================================================',
          '',
          'A varredura física do acervo precisa ler a pasta de cursos na sua máquina',
          '(ex: "G:\\Meu Drive\\Cursos\\Cursos Mindflix" ou caminho configurado).',
          '',
          'Como o Netlify opera em servidores em nuvem isolados, o scanner direto',
          'deve ser executado no terminal do seu computador:',
          '',
          '1. Abra o PowerShell ou terminal na pasta do Mindflix:',
          '   cd "d:\\projetos antigravity\\mindflix"',
          '',
          '2. Execute o scanner:',
          dryRun 
            ? '   python scan_library.py --dry-run' 
            : '   python scan_library.py --apply',
          '',
          '3. Para sincronizar as alterações com o Netlify:',
          '   git add src/data/catalog.json src/data/trilhas.json',
          '   git commit -m "atualizar catalogo"',
          '   git push origin main',
          '',
          'Seu site no Netlify será atualizado automaticamente!',
          '======================================================'
        ].join('\n'),
        summary: {
          status: 'cloud_environment_notice',
          dry_run: dryRun,
          scanned_at: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
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
            success: false,
            error: error.message, 
            output: stderr ? stderr.toString() : stdout ? stdout.toString() : error.message,
            stderr: stderr ? stderr.toString() : '' 
          }), {
            status: 200,
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
          output: stdout ? stdout.toString() : 'Varredura concluída com sucesso.',
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
    return new Response(JSON.stringify({ 
      success: false,
      error: err?.message || 'Falha ao executar scanner.',
      output: `Erro inesperado: ${err?.message || err}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
