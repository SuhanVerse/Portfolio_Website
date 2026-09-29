import {mkdir,writeFile,readdir,unlink} from 'node:fs/promises';
import {build} from 'esbuild';
import {home,casePage,shell,domain} from '../src/templates.mjs';
import {projects} from '../src/projects.mjs';
await mkdir('assets/js',{recursive:true});
for(const file of await readdir('assets/js'))if(/\.js$/.test(file))await unlink(`assets/js/${file}`);
await build({entryPoints:['src/main.js'],outdir:'assets/js',bundle:true,minify:true,splitting:true,format:'esm',target:'es2020',legalComments:'eof',chunkNames:'[name]-[hash]'});
await build({entryPoints:['src/site.css'],outfile:'assets/site.css',minify:true});
await writeFile('index.html',home());
for(const p of projects){await mkdir(`projects/${p.slug}`,{recursive:true});await writeFile(`projects/${p.slug}/index.html`,casePage(p));}
await writeFile('404.html',shell('Page not found — Suhan Khadka','Return to Suhan Khadka’s robotics and software portfolio.','/404.html','<section class="not-found wrap"><div class="eyebrow">404 / A small detour</div><h1>This page has moved<br>or does not exist.</h1><p>You can find my current projects on the homepage.</p><div class="actions"><a class="button" href="/">Back to the portfolio ↗</a></div></section>'));
await writeFile('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);
await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...projects.map(p=>`/projects/${p.slug}/`)].map(p=>`<url><loc>${domain}${p}</loc></url>`).join('')}</urlset>\n`);
await writeFile('.nojekyll','');
console.log('Built homepage, four case studies, 404, sitemap, CSS and optional 3D module.');
