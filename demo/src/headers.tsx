import { withTooltip } from '@package'

const Header = () => <h2>Component with tooltip</h2>

export const HeaderWithTootip = withTooltip(Header, { title: 'Welcome to React with tooltip', tag: 'a' })

export const NormalHeader = () => <h2>Normal component</h2>
