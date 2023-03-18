import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'pawn-party',
  description:
    'This extension hides a combination of the chess pieces on the board, making parts of the position invisible to the player. ',

  version: '1.1.2',
  manifest_version: 3,
  icons: {
    '16': 'img/img-16.png',
    '38': 'img/img-38.png',
    '48': 'img/img-48.png',
    '148': 'img/img-148.png',
  },
  // action: {
  //   default_popup: 'popup.html',
  //   default_icon: 'img/logo-48.png',
  // },
  // options_page: 'options.html',
  content_scripts: [
    {
      matches: ['https://lichess.org/*'],
      js: ['src/content/index.tsx'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/img-16.png', 'img/img-38.png', 'img/img-48.png', 'img/img-148.png'],
      matches: [],
    },
  ],
  permissions: [
    'storage', // Allows access to the browser's storage API
  ],
})
