# Guia — Área do Aluno · Nômades Crosstraining

Este guia tem tudo que você precisa para colocar o site no ar e mantê-lo
atualizado. Ele tem 4 partes:

1. [Como o site funciona](#1-como-o-site-funciona) (leia antes de tudo)
2. [Preparar a Planilha Google](#2-preparar-a-planilha-google) (uma vez só)
3. [Publicar no GitHub](#3-publicar-no-github) (uma vez só)
4. [Atualizar todo mês](#4-atualizar-todo-mês) (rotina — é isto que você vai repetir)
5. [Cores, gráficos e idade metabólica](#5-cores-gráficos-e-idade-metabólica) (como personalizar)

---

## 1. Como o site funciona

O site tem 3 páginas:

- **`index.html`** — a home, com a logo e o botão para a Área do Aluno.
- **`aluno.html`** — cada aluno escolhe o próprio nome e digita a data de
  nascimento pra ver a própria ficha (presença + bioimpedância).
- **`professor.html`** — visão geral da turma inteira (frequência média,
  ranking de presença por aluno, médias e distribuição de IMC/gordura
  visceral). Protegida por uma senha única, que você pode trocar a
  qualquer momento em `js/config.js` (`senhaProfessor`). A senha enviada
  para você configurar é `descansanoburpee` — troque quando quiser, direto
  nesse arquivo.

O site **não guarda dados dentro dele**. Toda vez que alguém abre uma
dessas páginas, o site busca os dados direto na sua Planilha Google
(publicada como CSV) e monta o painel na hora — tanto a ficha individual do
aluno quanto o painel geral do professor usam exatamente as mesmas 3 abas.

Isso responde a sua pergunta: **você não precisa reupar nada no GitHub**
depois de atualizar a planilha. O fluxo passa a ser:

```
Você atualiza a Planilha Google  →  o site já mostra os dados novos
        (não mexe no GitHub)         (na próxima vez que alguém abrir)
```

Você só volta a mexer no GitHub se um dia quiser mudar o **design ou o
funcionamento** do site (cores, textos, layout).

**Enquanto você não configurar a planilha (parte 2)**, as duas páginas
funcionam sozinhas em modo demonstração, com uma "turma fictícia" de 10
alunos de exemplo — é assim que você confere se o site está bonito e
funcionando antes de ligar os dados reais.

### Sobre as senhas — um ponto de atenção

Os dados que o site lê (nome, presença, bioimpedância) ficam num link
público na internet — qualquer pessoa com o link consegue ver a planilha
"crua", mesmo sem saber a senha de ninguém. As senhas (a data de nascimento
de cada aluno, e a senha única do professor) bloqueiam a **tela** do site,
não o arquivo por trás dela — e como é um site só de HTML/JS, mesmo a senha
do professor fica visível para quem souber abrir o código-fonte da página.

Por isso, **é fundamental nunca publicar a aba "Fichas"** (ela tem CPF, RG,
doenças, medicamentos, telefone de emergência). O site só vai usar 3 abas
novas/já existentes, bem mais simples, que você vai criar na parte 2 — nome,
data de nascimento, presença e bioimpedância. Nada de documento ou saúde
detalhada.

Para o uso de vocês (alunos de um box acompanhando a própria frequência e
avaliação física) isso é um risco baixo, mas é bom você saber exatamente o
que está exposto e por quê.

---

## 2. Preparar a Planilha Google

Você vai criar **2 abas novas** na mesma planilha que já usa, e manter a aba
"Bioimpedancia" como já está.

### 2.1 — Aba "Site_Alunos"

Crie uma aba nova chamada exatamente `Site_Alunos`, com estas 3 colunas:

| Nome Completo | Data de Nascimento | Ativo |
|---|---|---|
| Aparecida Antônia Silva | 1959-05-10 | Sim |
| Alcides Rodrigues da Silva | 1949-03-15 | Sim |

Como preencher rápido:
1. Na aba **Fichas**, selecione a coluna A (Nome Completo) inteira, copie.
2. Cole em `Site_Alunos`, coluna A.
3. Volte em Fichas, copie a coluna B (Data de Nascimento), cole em
   `Site_Alunos` coluna B usando **Colar especial → Colar somente valores**
   (menu Editar → Colar especial), pra não trazer nenhuma formatação da
   ficha junto.
4. Na coluna C, escreva `Sim` para todo aluno que está ativo hoje. Se um
   aluno sair do box, troque para `Não` — ele deixa de aparecer na lista do
   site, mas você não perde o histórico dele.

**Importante — formate a coluna B como texto simples**, pra data não mudar
de formato sozinha quando o Google publicar o CSV:
1. Selecione a coluna B inteira.
2. Formatar → Número → **Texto simples**.
3. Confira se as datas ficaram no formato `AAAA-MM-DD` (ex: `1959-05-10`).
   Se alguma vier diferente, ajuste digitando de novo nesse formato.

### 2.2 — Aba "Site_Frequencia"

Crie uma aba nova chamada `Site_Frequencia`, com estas 5 colunas:

| Nome Completo | Mês | Presenças | Faltas | % Presença |
|---|---|---|---|---|
| Aparecida Antônia Silva | 06/26 | 6 | 1 | 0.857142857 |

Você já calcula Presenças/Faltas/% Presença em cada aba mensal (0626, 0726,
0826...). No fim de cada mês, é só trazer esses números pra cá — o passo a
passo fica na [Parte 4](#4-atualizar-todo-mês), porque é uma tarefa que se
repete.

Formate a coluna **Mês** também como **Texto simples** (mesmo processo do
passo anterior), e sempre digite no formato `MM/AA` (ex: `06/26`, `07/26`)
para o site conseguir ordenar os meses certinho.

### 2.3 — Aba "Bioimpedancia"

Não precisa mudar nada aqui — a aba que você já tem está exatamente no
formato que o site precisa (Data, Nome Completo, Peso, % Gordura, % Massa
Magra, Gordura Visceral, Idade Metabólica, IMC, Classificação IMC,
Classificação Visceral).

Só confirme que a coluna **Data** também está como texto simples, no formato
`AAAA-MM-DD`.

### 2.4 — Publicar as 3 abas como CSV

Repita isto **3 vezes** — uma para cada aba (`Site_Alunos`,
`Site_Frequencia`, `Bioimpedancia`):

1. Abra a aba que você quer publicar (clique nela lá embaixo).
2. Menu **Arquivo → Compartilhar → Publicar na Web**.
3. Na primeira caixinha, troque "Documento inteiro" pela aba específica
   (ex: `Site_Alunos`).
4. Na segunda caixinha, escolha **Valores separados por vírgula (.csv)**.
5. Clique em **Publicar** e confirme.
6. Copie o link que aparece — algo como:
   `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123456&single=true&output=csv`
7. Guarde esse link — você vai colar ele no site daqui a pouco.

Faça isso para as 3 abas e guarde os 3 links separados.

> Publicar "na Web" faz o link funcionar mesmo pra quem não tem acesso à
> planilha — é assim que o site consegue ler os dados de fora do Google.
> É exatamente por isso que a aba Fichas nunca deve passar por este passo.

### 2.5 — Colocar os links no site

1. Abra o arquivo `js/config.js` (dentro da pasta do site que você recebeu).
2. Troque cada `"COLE_AQUI_..."` pelo link correspondente que você copiou:

```js
const NOMADES_CONFIG = {
  csvAlunos: "https://docs.google.com/spreadsheets/d/e/SEU-LINK-AQUI/pub?output=csv",
  csvFrequencia: "https://docs.google.com/spreadsheets/d/e/SEU-LINK-AQUI/pub?output=csv",
  csvBioimpedancia: "https://docs.google.com/spreadsheets/d/e/SEU-LINK-AQUI/pub?output=csv",
  ...
};
```

3. Salve o arquivo. Assim que isso estiver feito, o site sai do modo
   demonstração e passa a mostrar os alunos de verdade.

---

## 3. Publicar no GitHub

1. Crie uma conta em [github.com](https://github.com), se ainda não tiver.
2. Clique em **New repository** (Novo repositório). Dê um nome, por exemplo
   `nomades-area-do-aluno`. Deixe como **Public** (o plano gratuito do
   GitHub Pages exige repositório público — como já vimos, os dados em si já
   ficam públicos via CSV, então isso não muda a exposição real).
3. Não marque nenhuma opção de "adicionar README" — deixe o repositório
   vazio por enquanto.
4. Na página do repositório recém-criado, clique em **uploading an existing
   file** (ou "Add file → Upload files").
5. Arraste a pasta inteira do site (todos os arquivos e subpastas:
   `index.html`, `aluno.html`, `professor.html`, `css/`, `js/`, `assets/`) para a área de
   upload. Confirme o commit ("Commit changes").
6. Vá em **Settings → Pages** (barra lateral esquerda).
7. Em "Branch", escolha `main` e a pasta `/ (root)`, depois **Save**.
8. Espere 1–2 minutos e recarregue a página — vai aparecer um link do tipo
   `https://seu-usuario.github.io/nomades-area-do-aluno/`. Esse é o
   endereço do seu site.

Pronto — pode compartilhar esse link com os alunos.

---

## 4. Atualizar todo mês

Isto aqui é a rotina mensal. **Não envolve o GitHub em nenhum momento.**

### 4.1 — Lançar a frequência do mês

1. No fim do mês, confira os totais na aba mensal correspondente (ex:
   `0826` para agosto), nas colunas Nome Completo / Presenças / Faltas / %
   Presença.
2. Selecione as colunas A até D dessa aba (sem o cabeçalho) e copie.
3. Cole em `Site_Frequencia`, nas primeiras linhas vazias abaixo dos dados
   já existentes, usando **Colar especial → Colar somente valores**.
4. Na coluna "Mês" dessas linhas novas, digite o mês correspondente no
   formato `MM/AA` (ex: `08/26`) — copie o mesmo valor para todas as linhas
   que você acabou de colar (selecione a célula preenchida, arraste a
   alcinha azul do canto para baixo até cobrir todas as linhas novas).

### 4.2 — Lançar uma nova avaliação de bioimpedância

Sempre que fizer uma avaliação nova de um aluno:

1. Vá até a aba `Bioimpedancia` (a mesma de sempre).
2. Adicione uma linha nova no final, preenchendo Data, Nome Completo,
   Altura, Peso, % Gordura, % Massa Magra, Gordura Visceral, Idade
   Metabólica, IMC, Classificação IMC, Classificação Visceral — do mesmo
   jeito que você já faz hoje.
3. Não precisa apagar nem mover a avaliação anterior do mesmo aluno — o site
   usa a **primeira e a mais recente** de cada aluno automaticamente para
   montar a comparação, e mostra todas no gráfico de evolução.

### 4.3 — Novo aluno / aluno que saiu

- **Novo aluno:** adicione uma linha em `Site_Alunos` (Nome, Data de
  Nascimento, Ativo = Sim).
- **Aluno que saiu:** troque o `Ativo` dele para `Não` em `Site_Alunos`. Ele
  some da lista do site, mas o histórico continua guardado.

Depois desses passos, é isso — não precisa publicar de novo, não precisa
copiar link de novo, não precisa subir nada no GitHub. Na próxima vez que
alguém abrir o site, os dados já vêm atualizados direto da planilha.

---

## 5. Cores, gráficos e idade metabólica

Esta rodada de melhorias mexeu só na **Área do Aluno** (a Área do Professor
continua igual). O que mudou:

### Cores em tudo, não só no IMC e na Gordura Visceral

Antes, só IMC e Gordura Visceral ganhavam um selo colorido (bom/atenção/
elevado), porque só eles tinham uma coluna de "Classificação" na planilha.
Agora a coluna **Variação** da tabela também fica colorida — verde quando a
mudança foi pra melhor, vermelho quando foi pra pior — para **todas** as
métricas (Peso, IMC, % Gordura, % Massa Magra, Gordura Visceral e Idade
Metabólica).

Como o site decide o que é "melhora" pra cada métrica:
- **% Gordura**: diminuir é melhora.
- **% Massa Magra**: aumentar é melhora.
- **Idade Metabólica**: diminuir é melhora.
- **Peso e IMC**: usam a classificação de IMC da própria planilha. Se o
  aluno mudou de faixa (ex.: saiu de "Sobrepeso" pra "Peso Adequado"), conta
  como melhora. Se ficou na mesma faixa, o site ainda olha se o número andou
  na direção da faixa ideal (por exemplo, emagrecer continua sendo verde
  mesmo enquanto o aluno ainda está classificado como "Sobrepeso").
- **Gordura Visceral**: mesma lógica de faixa, usando a "Classificação
  Visceral" da planilha.

Se um dia você criar uma classificação nova (ex.: uma faixa nova de IMC),
adicione ela em **dois lugares** no `js/config.js`: em `classificacoes`
(pra cor do selo) e em `classificacoesOrdem` (pra cor da variação — número
menor = classificação melhor).

### Gráfico de evolução com seletor de métrica

O gráfico da Bioimpedância agora tem botões (Peso, IMC, % Gordura, % Massa
Magra, Gordura Visceral, Idade Metabólica) para escolher qual métrica ver
evoluindo ao longo das avaliações — antes só mostrava o Peso. Nos gráficos
de IMC e Gordura Visceral, cada ponto também é colorido conforme a
classificação daquela avaliação.

### Comparação "Idade Real x Idade Metabólica"

Card novo que compara a idade real do aluno (calculada a partir da data de
nascimento) com a Idade Metabólica da avaliação mais recente. Aparece em
verde quando a metabólica é menor que a real, e em amarelo/vermelho quando
está acima — o limite entre amarelo e vermelho é 3 anos de diferença, e dá
pra mudar isso em `js/config.js`, no bloco `idadeMetabolica.toleranciaAtencao`.

### Bugs de exibição corrigidos

- A tabela de bioimpedância agora tem rolagem horizontal própria em telas
  estreitas, em vez de espremer o conteúdo ou estourar a largura da página.
- O número e o selo de classificação (ex.: "25.7 Sobrepeso") agora quebram
  linha direitinho quando não cabem lado a lado num celular mais estreito.
- O gráfico de frequência mensal e o número grande de frequência geral
  agora também ficam coloridos por faixa (verde 80%+, amarelo 60-79%,
  vermelho abaixo de 60%).

---

## Problemas comuns

**"Não foi possível carregar os dados"** — normalmente é um dos links do
`config.js` errado ou a aba não publicada corretamente. Reveja o passo 2.4.

**Aluno não aparece na lista** — confira se a coluna `Ativo` dele em
`Site_Alunos` está exatamente como `Sim` (sem espaço extra) e se o nome
está preenchido.

**"Data de nascimento não confere"** — confira se a data em `Site_Alunos`
está no formato `AAAA-MM-DD` e como texto simples (passo 2.1).

**Mudei a planilha e não vejo a mudança no site** — o navegador às vezes
guarda uma cópia antiga da página em cache. Feche e abra o site de novo, ou
force um recarregamento (no celular, puxe a página pra baixo para atualizar;
no computador, Ctrl+F5).
