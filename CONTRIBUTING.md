# Contribuindo

## Problemas (issues)

Ao enviar um problema, inclua um caso reproduzível que possamos realmente executar.

## Contribuição para o código-fonte (Pull Requests)

- As novas funcionalidades devem ser gerais e o mais simples possível. Além disso, devem incluir, no minímo, testes básicos associados.
- Todos os PR's requerem revisão para aprovação.

## Orientações para mensagens de commit

Devemos utilizar uma convenção sobre como as mensagens de commit do git devem ser formatadas. Isso resulta em **mensagens mais legíveis** que são fáceis de acompanhar ao examinar o **histórico do projeto**.

### Formato da mensagem de commit

Cada mensagem de confirmação consiste em um **cabeçalho**, e um **corpo**. O cabeçalho tem um formato especial que inclui um **tipo**, um **escopo** e um **assunto**:

```txt
<tipo>(<escopo>): <assunto>
<LINHA EM BRANCO>
<corpo>
```

O **cabeçalho** é obrigatório. O **escopo** do cabeçalho e o **corpo** são opcionais.

Nenhuma linha da mensagem de commit pode ter mais de 100 caracteres! Isso permite que a mensagem seja mais fácil de ler, bem como em várias ferramentas do git.

Exemplos:

```sh
docs(readme): atualizar README
```

```txt
fix(release): precisa depender do rxjs e do zone.js mais recentes

A versão em nosso package.json é copiada para a que publicamos, e os usuários precisam da mais recente delas.
```

### Tipo

Deve ser um dos seguintes:

- **build**: alterações que afetam o sistema de compilação ou dependências externas (exemplos de escopos: gulp, npm);
- **docs**: alterações apenas na documentação;
- **feat**: um novo recurso;
- **fix**: uma correção de bug;
- **perf**: uma alteração de código que melhora o desempenho;
- **chore**: uma pequena alteração que não são novas funcionalidades (ativos gráficos, como imagens, ícones, etc.);
- **refactor**: uma alteração de código que não corrige um bug nem adiciona um recurso;
- **style**: alterações que não afetam o significado do código (espaços em branco, formatação, falta de ponto e vírgula, etc.);
- **test**: adição de testes ausentes ou correção de testes existentes.

### Escopo

O escopo deve ser o nome do local do projeto afetado.

Exemplo:

```sh
docs(readme): atualizar README
```

```sh
feat(dashboard.login): criar tela de login de usuários
```

```sh
style(home): adicionar ponto e vírgulas ausentes
```

### Assunto

O assunto contém uma descrição sucinta da alteração:

- use o imperativo, tempo presente: "alterar", não "alterado" nem "alterações";
- não coloque a primeira letra em maiúscula;
- sem ponto (.) no final.

### Corpo

Assim como no sujeito, use o imperativo, tempo presente: "alterar" e não "alterando" ou "alterações". O corpo deve incluir a motivação para a mudança e contrastá-la com o comportamento anterior.
