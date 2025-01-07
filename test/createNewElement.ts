export default function createNewElement(
	nodeName = 'button',
	attributes: Record<string, any> = { title: 'Tippy Content' },
	to = document.body
) {
	const el = document.createElement(nodeName)
	el.className = '__tippy'
	
	for (const [attr, value] of Object.entries(attributes)) {
		el.setAttribute(attr, value)
	}

	to.appendChild(el)

	return el
}
