import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector('#counter'))
