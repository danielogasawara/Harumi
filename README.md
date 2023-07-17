<div align='center'>
  <img src='https://i.imgur.com/D4MlzkG.png' height='256px' />
</div>
<h1 align='center'>Harumi</h1>

<div align='center'>
  <img src='https://img.shields.io/github/license/danielogasawara/harumi?&color=0078ac&label=Licen%C3%A7a' alt='Licença GPL v3' />
  <img src='https://img.shields.io/github/package-json/v/danielogasawara/harumi/master?&color=0078ac&label=Vers%C3%A3o' />
  <img src='https://img.shields.io/github/commit-activity/m/danielogasawara/harumi?label=Commits&color=0078ac' />
  <img src='https://img.shields.io/npm/v/discord.js?label=discord.js&color=0078ac' />
</div>
<br/>
Harumi é um bot para discord que tem uma personalidade alegre, divertida e amigável. Ela gosta de interagir com os usuários, enviar memes, jogar jogos, tocar música, e dar dicas e conselhos. Ela também é capaz de moderar o chat, gerenciar o servidor, e executar comandos úteis. Harumi é de código aberto, o que significa que você pode ver como ela funciona, contribuir para o seu aprimoramento, ou personalizá-la do seu jeito. Se você quer um bot que te faça sorrir, te ajude nas tarefas, e seja sua companheira no discord, convide a Harumi!

## 🚧 Desenvolvimento

- [x] 🖼️ Enviar imagens do Pixiv
- [ ] 🎭 Enviar memes
- [ ] 🎵 Tocar músicas
- [ ] 🍙 Quiz de anime
- [x] 🛠️ Ferramentas de moderação
- [ ] 🤖 Integração com IA? (Quem sabe...)
- [ ] 🍡 Recomendação de anime e mangás
- [ ] ✨ Muito mais...

## 🤖 Adicione ao seu servidor

Em breve...

## 💡Instalação

Com os passos abaixo você poderá criar o seu próprio bot baseado no nosso código-fonte.

### Requisitos

- (Necessário) [Node.js](https://nodejs.org/en) - Para rodar o código JS na sua máquina.
- (Necessário) [Git](https://git-scm.com/) - Ferramenta para controle de versão.
- (Opcional) [VS Code](https://code.visualstudio.com/) - Editor de código.

> O uso do Visual Studio Code (VS Code) é opcional, mas altamente recomendado para melhor leitura e edição do código.

### Instalação e configuração

Após fazer a instalação dos programas necessários, escolha uma pasta em seu computador para clonar o repositório.

> Exemplo: C:\Users\SEU_USUÁRIO\Documents\Bot

Em seguida abra o seu terminal na pasta escolhida:

```shell
cd CAMINHO_ATÉ_A_PASTA
```

Logo após digite o seguinte comando:

```shell
git clone https://github.com/danielogasawara/Harumi.git
```

Agora entre no diretório com terminal e digite:

```shell
npm install
```

Aguarde o processo terminar e você terá uma estrutura de pastas semelhante a esta:

> node_modules\
> src\
> .env.example\
> .gitignore\
> .prettierrc\
> LICENSE\
> package-lock.json\
> package.json\
> README.md\
> tsconfig.json

Duplique o arquivo `.env.example` e renomei a cópia para `.env`, agora substitua os valores das chaves com as informações do seu bot, segue um exemplo abaixo:

**Campos obrigatórios**

```javascript
BOT_TOKEN= // O token do bot vai aqui.
CLIENT_ID= // O Client ID do bot vai aqui.
PREFIX= // Prefixo usado para comandos sem /.
```

**Campos opcionais**

```javascript
PIXIV_COOKIE= // Seu cookie do pixiv.
PIXIV_USER_AGENT= // O mesmo user-agent do cookie.
MONGO_URI= // URL de conexão com o MongoDB.
MONGO_DATABASE_NAME= // Nome da Base de dados.
```

> Mais detalhes sobre como encontrar o cookie do pixiv e o user-agente em [@ibaraki-douji/pixivts](https://www.npmjs.com/package/@ibaraki-douji/pixivts#login-with-cookies-recommended).

### Execução

Após todo o processo de instalação e configuração agora basta executar o comando no terminal:

```shell
npm run build
```

E depois do comando terminar de compilar você executa este comando:

```shell
npm run start
```

Se tudo ocorreu bem seu bot estará online e você já poderá interagir com ele.

## 🔖 Créditos

Este bot utiliza pacotes e códigos disponibilizados gratuitamente pelos usuários abaixo:

[Ibaraki Douji](https://github.com/ibaraki-douji) - Pixiv Downloader (pixivts)

[MericcaN41](https://github.com/MericcaN41) -
Discord.js v14 Typescript template
