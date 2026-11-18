/* global localStorage */
// Light or dark theme: follows the system until the user picks one with the
// toggle, which is then remembered. layout.pug applies a saved choice before
// the page renders; the CSS swaps the toggle's icon.
module.exports = function () {
  const toggle = document.querySelector('#theme-toggle')
  if (!toggle) return

  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
  const current = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light')

  function updateLabel () {
    const label = current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    toggle.setAttribute('aria-label', label)
    toggle.setAttribute('title', label)
  }

  toggle.addEventListener('click', function () {
    const theme = current() === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (err) {
      // Private mode or storage disabled: the choice lasts for this page only
    }
    updateLabel()
  })

  systemDark.addEventListener('change', updateLabel)
  updateLabel()
}
