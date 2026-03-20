# 🚀 Guia de Deploy — Divórcio Transparente
## Alan Mac Dowell Velloso · OAB/GO 4573

---

## O que você vai precisar (tudo gratuito)

- Conta no **GitHub** → github.com (para guardar o código)
- Conta no **Vercel** → vercel.com (para publicar o site)
- O arquivo ZIP do projeto (fornecido pelo Claude)

Tempo total estimado: **15-20 minutos**

---

## PASSO 1 — Criar conta no GitHub

1. Acesse **github.com**
2. Clique em **"Sign up"** (canto superior direito)
3. Preencha:
   - Username: ex. `alanmacdowell`
   - E-mail: seu e-mail
   - Senha: crie uma senha forte
4. Confirme o e-mail que chegar na sua caixa

---

## PASSO 2 — Criar o repositório no GitHub

1. Depois de logar no GitHub, clique no botão **"+"** (canto superior direito)
2. Clique em **"New repository"**
3. Preencha:
   - Repository name: `divorcio-transparente`
   - Deixe em **Public** (necessário para o Vercel gratuito)
   - NÃO marque nenhuma opção adicional
4. Clique em **"Create repository"**

---

## PASSO 3 — Fazer upload dos arquivos

Na tela que apareceu após criar o repositório:

1. Clique em **"uploading an existing file"** (link azul no meio da página)
2. Arraste a pasta `divorcio-transparente` inteira para a área indicada
   - OU clique em "choose your files" e selecione todos os arquivos
3. Aguarde o upload terminar
4. No campo "Commit changes" escreva: `primeiro deploy`
5. Clique em **"Commit changes"** (botão verde)

---

## PASSO 4 — Criar conta no Vercel

1. Acesse **vercel.com**
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** ← importante usar o GitHub
4. Autorize o Vercel a acessar sua conta GitHub

---

## PASSO 5 — Publicar o projeto no Vercel

1. No painel do Vercel, clique em **"Add New Project"**
2. Você verá seus repositórios do GitHub listados
3. Encontre `divorcio-transparente` e clique em **"Import"**
4. Na tela de configuração:
   - Framework Preset: **Vite** (o Vercel detecta automaticamente)
   - Build Command: `npm run build` (já preenchido)
   - Output Directory: `dist` (já preenchido)
5. Clique em **"Deploy"**
6. Aguarde ~2 minutos ☕

---

## PASSO 6 — Seu site está no ar! 🎉

O Vercel vai gerar um link como:
**`divorcio-transparente-xyz.vercel.app`**

Este link já funciona e pode ser usado nos anúncios!

---

## PASSO 7 (opcional) — Domínio personalizado

Se você tiver ou quiser comprar um domínio como `simulador.alanmacdowell.adv.br`:

1. No painel do Vercel, vá em **Settings → Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio
4. O Vercel mostrará as configurações de DNS para apontar
5. Acesse o painel do seu registrador de domínio (GoDaddy, Registro.br, etc.)
6. Adicione os registros DNS conforme indicado
7. Em ~30 minutos seu domínio próprio já funciona com HTTPS automático

---

## Links úteis para anúncios

Após o deploy, seus links serão:

| Página | URL |
|--------|-----|
| Landing Page | `seu-dominio.vercel.app` |
| Simulador direto | `seu-dominio.vercel.app?simulador=1` |
| Simulador (ad direto) | Use este para anúncios de remarketing |

---

## 🔧 Atualizações futuras

Sempre que precisar atualizar o site (ex: mudar textos, cores):

1. Edite os arquivos no GitHub (botão de lápis em cada arquivo)
2. Salve (commit)
3. O Vercel re-publica automaticamente em ~1 minuto

---

## 📞 Suporte

Qualquer dúvida no processo, abra uma nova conversa com o Claude
e informe em qual passo está com dificuldade.

---

*Documento gerado em: ${new Date().toLocaleDateString("pt-BR")}*
*Projeto: Divórcio Transparente · Alan Mac Dowell Velloso*
